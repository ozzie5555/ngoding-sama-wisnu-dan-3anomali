import { supabase } from '../../../lib/supabase/client'

const CHAT_IMAGE_BUCKET = 'chat-images'
const CHAT_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const CHAT_IMAGE_EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_CHAT_IMAGES = 4
const MAX_CHAT_IMAGE_SIZE = 5 * 1024 * 1024
const messageSelect = 'id, room_id, user_id, content, message_type, attachment_paths, is_deleted, created_at, edited_at, reply_to_id'

const uploadChatImages = async (files, roomId, currentUserId) => {
  if (files.length > MAX_CHAT_IMAGES) throw new Error(`Maksimal ${MAX_CHAT_IMAGES} gambar per pesan.`)

  const uploadedPaths = []
  try {
    for (const file of files) {
      if (!CHAT_IMAGE_TYPES.has(file.type)) throw new Error('Format gambar harus JPG, PNG, atau WebP.')
      if (file.size > MAX_CHAT_IMAGE_SIZE) throw new Error('Ukuran setiap gambar maksimal 5MB.')

      const path = `${currentUserId}/${roomId}/${crypto.randomUUID()}.${CHAT_IMAGE_EXTENSIONS[file.type]}`
      const { error } = await supabase.storage
        .from(CHAT_IMAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false })
      if (error) throw error
      uploadedPaths.push(path)
    }
    return uploadedPaths
  } catch (error) {
    if (uploadedPaths.length) await supabase.storage.from(CHAT_IMAGE_BUCKET).remove(uploadedPaths)
    throw new Error(error.message || 'Gambar gagal diunggah.', { cause: error })
  }
}

const hydrateMessages = async (messages, currentUserId) => {
  const rows = messages || []
  const userIds = [...new Set(rows.flatMap((message) => [message.user_id, message.reply_user_id]).filter(Boolean))]
  let profiles = []
  if (userIds.length > 0) {
    const { data, error } = await supabase.rpc('get_public_profiles', { p_ids: userIds })
    if (!error) profiles = data || []
  }
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]))
  const replyIds = [...new Set(rows.map((message) => message.reply_to_id).filter(Boolean))]
  let replies = []
  if (replyIds.length > 0) {
    const { data } = await supabase
      .from('chat_messages')
      .select('id, user_id, content, attachment_paths, is_deleted')
      .in('id', replyIds)
    replies = data || []
  }
  const replyMap = new Map(replies.map((reply) => [reply.id, reply]))
  const replyUserIds = [...new Set(replies.map((reply) => reply.user_id).filter(Boolean))]
  if (replyUserIds.length > 0) {
    const { data: replyProfiles } = await supabase.rpc('get_public_profiles', { p_ids: replyUserIds })
    ;(replyProfiles || []).forEach((profile) => profileMap.set(profile.id, profile))
  }
  return Promise.all(rows.map((message) => mapMessage({
    ...message,
    profiles: profileMap.get(message.user_id) || null,
    reply: replyMap.get(message.reply_to_id) || null,
    replyProfile: replyMap.get(message.reply_to_id)
      ? profileMap.get(replyMap.get(message.reply_to_id).user_id) || null
      : null,
  }, currentUserId)))
}

const mapMessage = async (message, currentUserId) => {
  const profile = Array.isArray(message.profiles) ? message.profiles[0] : message.profiles
  const imageUrls = message.is_deleted
    ? []
    : (await Promise.all((message.attachment_paths || []).map(async (path) => {
        const { data, error } = await supabase.storage.from(CHAT_IMAGE_BUCKET).createSignedUrl(path, 60 * 60)
        return error ? null : data?.signedUrl
      }))).filter(Boolean)
  return {
    id: message.id,
    sender: message.user_id === currentUserId ? 'You' : (profile?.full_name || profile?.username || 'Pengguna'),
    avatar: profile?.avatar_path || '',
    text: message.is_deleted ? 'Pesan dihapus' : message.content,
    images: imageUrls,
    isOwn: message.user_id === currentUserId,
    createdAt: message.created_at,
    editedAt: message.edited_at,
    replyTo: message.reply ? {
      sender: message.replyProfile?.full_name || message.replyProfile?.username || 'Pengguna',
      text: message.reply.is_deleted
        ? 'Pesan dihapus'
        : (message.reply.content || (message.reply.attachment_paths?.length ? 'Foto' : 'Pesan')),
    } : null,
  }
}

export const chatService = {
  async getTopDonors(limit = 4) {
    const { data, error } = await supabase.rpc('get_top_donors', { p_limit: limit })
    if (error) throw new Error(error.message)
    return (data || []).map((donor) => ({
      id: donor.donor_id,
      name: donor.donor_name || donor.username || 'Donatur',
      avatar: donor.avatar_path || '',
      totalItems: donor.total_items || 0,
      totalDonations: donor.total_donations || 0,
    }))
  },

  async getRoom(slug) {
    const { data, error } = await supabase.rpc('get_or_create_community_chat_room', {
      p_community_slug: slug === 'general' ? null : slug,
    })
    if (error) throw new Error(error.message)
    return data
  },

  async getMessages(roomId, currentUserId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(messageSelect)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    return hydrateMessages(data, currentUserId)
  },

  async updateMessage(messageId, content, currentUserId) {
    const text = content.trim()
    if (!text) throw new Error('Pesan tidak boleh kosong.')
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ content: text, edited_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('user_id', currentUserId)
      .select(messageSelect)
      .single()
    if (error) throw new Error(error.message)
    const [message] = await hydrateMessages([data], currentUserId)
    return message
  },

  async sendMessage(roomId, content, currentUserId, replyToId = null, imageFiles = []) {
    const text = content.trim()
    if (!text && imageFiles.length === 0) return null

    const attachmentPaths = await uploadChatImages(imageFiles, roomId, currentUserId)
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: currentUserId,
        content: text,
        message_type: attachmentPaths.length ? 'image' : 'text',
        attachment_paths: attachmentPaths,
        reply_to_id: replyToId,
      })
      .select(messageSelect)
      .single()
    if (error) {
      if (attachmentPaths.length) await supabase.storage.from(CHAT_IMAGE_BUCKET).remove(attachmentPaths)
      throw new Error(error.message)
    }
    const [message] = await hydrateMessages([data], currentUserId)
    return message
  },

  subscribe(roomId, currentUserId, onMessage) {
    const channel = supabase
      .channel(`community-chat:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('chat_messages')
          .select(messageSelect)
          .eq('id', payload.new.id)
          .single()
        if (data) {
          const [message] = await hydrateMessages([data], currentUserId)
          if (message) onMessage(message)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  },
}
