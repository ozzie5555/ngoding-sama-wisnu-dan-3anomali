import { supabase } from '../../../lib/supabase/client'
import { COMMUNITIES_DATA } from '../../../data/communityData'

const fallbackBySlug = new Map(COMMUNITIES_DATA.map((community) => [community.id, community]))

function mapCommunity(row) {
  const fallback = fallbackBySlug.get(row.slug) || {}
  const needs = (row.community_needs || []).filter((need) => need.status === 'open')
  const instagram = row.social_links?.instagram || fallback.handle || ''

  return {
    ...fallback,
    id: row.slug,
    databaseId: row.id,
    name: row.name,
    headerName: row.header_name || row.name,
    category: row.category_label || fallback.category || 'Komunitas Mitra',
    location: row.location,
    fullLocation: row.location,
    address: row.address || '',
    handle: instagram.startsWith('@') || !instagram ? instagram : `@${instagram}`,
    logo: row.logo_path || fallback.logo || '/logo.svg',
    description: row.description || '',
    donationRules: row.donation_rules?.length ? row.donation_rules : (fallback.donationRules || []),
    currentNeeds: needs.map((need) => need.item_name),
    selectableNeeds: needs.map((need) => ({
      id: need.id,
      title: need.item_name,
      description: need.description,
      category: need.category,
      quantityNeeded: need.quantity_needed,
      quantityReceived: need.quantity_received,
    })),
    chips: needs.slice(0, 4).map((need) => need.item_name),
    categoriesSummary: needs.map((need) => need.item_name).join(', '),
  }
}

export const communityService = {
  async getCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id, name, slug, header_name, category_label, description, location,
        address, logo_path, social_links, donation_rules,
        community_needs (
          id, category, item_name, description, quantity_needed,
          quantity_received, status, created_at
        )
      `)
      .eq('is_verified', true)
      .eq('is_active', true)
      .eq('community_needs.status', 'open')
      .order('name')
      .order('created_at', { referencedTable: 'community_needs', ascending: true })

    if (error) throw new Error(error.message)
    return (data || []).map(mapCommunity)
  },
}

export { COMMUNITIES_DATA as FALLBACK_COMMUNITIES }
