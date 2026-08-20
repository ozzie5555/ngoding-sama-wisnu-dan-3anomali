import { supabase } from '../../../lib/supabase/client'

const messageSelect = 'id, room_id, user_id, content, message_type, is_deleted, created_at'

const hydrateMessages = async (messages, currentUserId) => {
  const rows = messages || []
  const userIds = [...new Set(rows.map((message) => message.user_id).filter(Boolean))]
  let profiles = []
  if (userIds.length > 0) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_path')
      .in('id', userIds)
    if (!error) profiles = data || []
  }
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]))
  return rows.map((message) => mapMessage({
    ...message,
    profiles: profileMap.get(message.user_id) || null,
  }, currentUserId))
}

const mapMessage = (message, currentUserId) => {
  const profile = Array.isArray(message.profiles) ? message.profiles[0] : message.profiles
  return {
    id: message.id,
    sender: message.user_id === currentUserId ? 'You' : (profile?.full_name || profile?.username || 'Pengguna'),
    avatar: profile?.avatar_path || '',
    text: message.is_deleted ? 'Pesan dihapus' : message.content,
    isOwn: message.user_id === currentUserId,
    createdAt: message.created_at,
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

  async sendMessage(roomId, content, currentUserId) {
    const text = content.trim()
    if (!text) return null
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ room_id: roomId, user_id: currentUserId, content: text, message_type: 'text' })
      .select(messageSelect)
      .single()
    if (error) throw new Error(error.message)
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
