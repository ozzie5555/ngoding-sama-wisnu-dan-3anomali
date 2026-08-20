import { supabase } from '../../../lib/supabase/client'

const STATUS_LABELS = {
  pending: 'Menunggu verifikasi',
  verified: 'Terverifikasi',
  pickup: 'Dijadwalkan jemput',
  shipping: 'Dalam perjalanan',
  received: 'Diterima komunitas',
  cancelled: 'Dibatalkan',
}

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
  : '-'

const formatDateTime = (value) => value
  ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  : '-'

const PHOTO_FALLBACK = '/abandoned-cart.svg'

export const adminService = {
  async getDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select('id, donation_code, donor_id, item_name, category, quantity, status, submitted_at, updated_at, pickup_address, pickup_at, description, condition_note, community_id, assigned_to, assigned_at, communities ( id, name, slug ), donation_items ( storage_path, sort_order )')
      .order('submitted_at', { ascending: true })
    if (error) throw new Error(error.message)

    const rows = data || []
    const profileIds = [...new Set(rows.flatMap((row) => [row.donor_id, row.assigned_to]).filter(Boolean))]
    const { data: profiles } = profileIds.length
      ? await supabase.from('profiles').select('id, full_name, username, avatar_path').in('id', profileIds)
      : { data: [] }
    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]))

    return Promise.all(rows.map(async (row) => {
      const item = (row.donation_items || []).slice().sort((a, b) => a.sort_order - b.sort_order)[0]
      let image = PHOTO_FALLBACK
      if (item?.storage_path) {
        const { data: signed } = await supabase.storage.from('item-photos').createSignedUrl(item.storage_path, 60 * 60)
        image = signed?.signedUrl || PHOTO_FALLBACK
      }
      const profile = profileMap.get(row.donor_id)
      const assignee = profileMap.get(row.assigned_to)
      const community = Array.isArray(row.communities) ? row.communities[0] : row.communities
      return {
        ...row,
        donorName: profile?.full_name || profile?.username || 'Donatur',
        donorUsername: profile?.username || '',
        assigneeName: assignee?.full_name || assignee?.username || '',
        communityName: community?.name || 'Komunitas belum dipilih',
        image,
        statusLabel: STATUS_LABELS[row.status] || row.status,
        dateLabel: formatDate(row.submitted_at),
        updatedLabel: formatDateTime(row.updated_at),
      }
    }))
  },

  async getRecentActivity(limit = 8) {
    const { data, error } = await supabase
      .from('donation_status_events')
      .select('id, donation_id, from_status, to_status, note, changed_by, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)

    const rows = data || []
    const profileIds = [...new Set(rows.map((row) => row.changed_by).filter(Boolean))]
    const donationIds = [...new Set(rows.map((row) => row.donation_id).filter(Boolean))]
    const [{ data: profiles }, { data: donations }] = await Promise.all([
      profileIds.length
        ? supabase.from('profiles').select('id, full_name, username').in('id', profileIds)
        : Promise.resolve({ data: [] }),
      donationIds.length
        ? supabase.from('donations').select('id, donation_code, item_name').in('id', donationIds)
        : Promise.resolve({ data: [] }),
    ])
    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]))
    const donationMap = new Map((donations || []).map((donation) => [donation.id, donation]))

    return rows.map((row) => {
      const actor = profileMap.get(row.changed_by)
      const donation = donationMap.get(row.donation_id)
      return {
        ...row,
        actorName: actor?.full_name || actor?.username || 'Sistem',
        donationCode: donation?.donation_code || 'Donasi',
        itemName: donation?.item_name || '',
        toStatusLabel: STATUS_LABELS[row.to_status] || row.to_status,
        timeLabel: formatDateTime(row.created_at),
      }
    })
  },


  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, email, role, phone, created_at')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  },

  async getArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, content, cover_path, category, tags, content_type, author_name, is_featured, cta_text, cta_link, is_published, published_at, updated_at')
      .order('updated_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data || []
  },

  async saveArticle(article) {
    const payload = {
      title: article.title.trim(),
      slug: article.slug.trim(),
      excerpt: article.excerpt.trim(),
      content: article.content.trim(),
      cover_path: article.cover_path.trim() || null,
      category: article.category,
      tags: article.tags,
      content_type: article.content_type,
      author_name: article.author_name.trim() || 'KEMBALI',
      is_featured: article.content_type === 'promo' ? article.is_featured : false,
      cta_text: article.cta_text.trim() || null,
      cta_link: article.cta_link.trim() || null,
      is_published: article.is_published,
      published_at: article.is_published ? (article.published_at || new Date().toISOString()) : null,
    }
    if (article.id) payload.id = article.id

    const { data, error } = await supabase.from('articles').upsert(payload).select().single()
    if (error) throw new Error(error.message)
    return data
  },

  async deleteArticle(articleId) {
    const { error } = await supabase.from('articles').delete().eq('id', articleId)
    if (error) throw new Error(error.message)
  },

  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, user_id, donation_id, rating, content, is_approved, created_at, approved_at')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)

    const rows = data || []
    const profileIds = [...new Set(rows.map((row) => row.user_id).filter(Boolean))]
    const donationIds = [...new Set(rows.map((row) => row.donation_id).filter(Boolean))]
    const [{ data: profiles }, { data: donations }] = await Promise.all([
      profileIds.length
        ? supabase.from('profiles').select('id, full_name, username, avatar_path').in('id', profileIds)
        : Promise.resolve({ data: [] }),
      donationIds.length
        ? supabase.from('donations').select('id, donation_code, item_name').in('id', donationIds)
        : Promise.resolve({ data: [] }),
    ])
    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]))
    const donationMap = new Map((donations || []).map((donation) => [donation.id, donation]))

    return rows.map((row) => {
      const profile = profileMap.get(row.user_id)
      const donation = donationMap.get(row.donation_id)
      return {
        ...row,
        authorName: profile?.full_name || profile?.username || 'Donatur KEMBALI',
        avatar: profile?.avatar_path || '/User 03C.svg',
        donationCode: donation?.donation_code || 'Donasi',
        itemName: donation?.item_name || 'Barang donasi',
        dateLabel: formatDate(row.created_at),
      }
    })
  },

  async moderateTestimonial(testimonialId, approved) {
    const { data, error } = await supabase.rpc('moderate_testimonial', {
      p_testimonial_id: testimonialId,
      p_approved: approved,
    })
    if (error) throw new Error(error.message)
    return data
  },

  async transitionDonation(donationId, nextStatus, note = '') {
    const { data, error } = await supabase.rpc('transition_donation_status', {
      p_donation_id: donationId,
      p_next_status: nextStatus,
      p_note: note,
    })
    if (error) throw new Error(error.message)
    return data
  },

  async claimDonation(donationId, claim = true) {
    const { data, error } = await supabase.rpc('claim_donation', {
      p_donation_id: donationId,
      p_claim: claim,
    })
    if (error) throw new Error(error.message)
    return data
  },
}

export { STATUS_LABELS }
