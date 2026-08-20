import { supabase } from '../../../lib/supabase/client';

const FALLBACK_IMAGES = {
  barang_bekas: '/abandoned-cart.svg',
  pakaian_layak: '/pakaian-layak.svg',
  buku_atk: '/buku-pelajarn.svg',
  karya_daur_ulang: '/student-studying.svg',
};

const STATUS_LABELS = {
  pending: 'Sedang Dikonfirmasi',
  verified: 'Terverifikasi',
  pickup: 'Dijadwalkan Jemput',
  shipping: 'Dalam Perjalanan',
  received: 'Donasi Diterima',
  cancelled: 'Dibatalkan',
};

const STATUS_STEPS = {
  pending: 2,
  verified: 2,
  pickup: 3,
  shipping: 4,
  received: 5,
  cancelled: 2,
};

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

const mapDonation = async (donation) => {
  const community = Array.isArray(donation.communities)
    ? donation.communities[0]
    : donation.communities;
  const firstItem = donation.donation_items?.[0];
  let photoUrl = null;

  if (firstItem?.storage_path) {
    const { data } = await supabase.storage
      .from('item-photos')
      .createSignedUrl(firstItem.storage_path, 60 * 60);
    photoUrl = data?.signedUrl || null;
  }

  return {
    ...donation,
    title: donation.item_name,
    date: formatDate(donation.submitted_at),
    destination: community?.name || 'Komunitas Terverifikasi',
    destinationFull: community?.name || 'Komunitas Terverifikasi',
    image: photoUrl || FALLBACK_IMAGES[donation.category] || FALLBACK_IMAGES.barang_bekas,
    statusLabel: STATUS_LABELS[donation.status] || donation.status,
    stepIndex: STATUS_STEPS[donation.status] || 2,
    description: donation.description || `${donation.quantity || 1} barang layak pakai.`,
    conditionNote: donation.condition_note,
    optionChosenNote: '(sesuai opsi yang sudah dipilih)',
    reviewSubmitted: Boolean(donation.testimonials?.length),
    reviewText: donation.testimonials?.[0]?.content || '',
  };
};

const DONATION_SELECT = `
  id,
  donation_code,
  item_name,
  category,
  quantity,
  status,
  submitted_at,
  received_at,
  condition_note,
  description,
  pickup_address,
  pickup_at,
  community_id,
  communities ( id, name, slug, location ),
  donation_items ( storage_path, sort_order ),
  testimonials ( id, content )
`;

export const donationService = {
  submitDonation: async ({ communityId, needId, category, itemName, conditionNote, quantity, description, pickupAddress, pickupAt, photos }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let resolvedCommunityId = communityId;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(communityId || '');

    if (communityId && !isUUID) {
      const { data: community, error: lookupError } = await supabase
        .from('communities')
        .select('id')
        .eq('slug', communityId)
        .single();
      if (lookupError || !community) throw new Error(`Komunitas "${communityId}" tidak ditemukan di database.`);
      resolvedCommunityId = community.id;
    }

    if (!resolvedCommunityId) throw new Error('Komunitas tidak ditemukan.');

    const { data: result, error } = await supabase.rpc('submit_donation', {
      payload: {
        community_id: resolvedCommunityId,
        need_id: needId || null,
        category: category || 'barang_bekas',
        item_name: itemName,
        condition_note: conditionNote || '',
        quantity: quantity || 1,
        description: description || '',
        pickup_address: pickupAddress || '',
        pickup_at: pickupAt || null,
      },
    });

    if (error) throw new Error(error.message);

    if (photos?.length && result?.id) {
      for (let i = 0; i < photos.length; i += 1) {
        const file = photos[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${result.id}/photo-${i}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('item-photos').upload(filePath, file, { upsert: false });

        if (uploadError) {
          console.error('[donationService] Photo upload failed:', uploadError.message);
          continue;
        }

        const { error: insertError } = await supabase.from('donation_items').insert({
          donation_id: result.id,
          storage_path: filePath,
          sort_order: i,
        });
        if (insertError) console.error('[donationService] donation_items insert failed:', insertError.message);
      }
    }

    return {
      success: true,
      donationCode: result?.donation_code,
      donation: result,
    };
  },

  getUserDonations: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select(DONATION_SELECT)
      .eq('donor_id', user.id)
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return Promise.all((data || []).map(mapDonation));
  },

  getUserStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select('status, quantity')
      .eq('donor_id', user.id);
    if (error) throw new Error(error.message);

    const donations = data || [];
    return {
      donations: donations.length,
      distributed: donations.filter((d) => d.status === 'received').length,
      saved: donations.reduce((sum, d) => sum + (d.quantity || 0), 0),
    };
  },

  getUserCommunities: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select('community_id, communities ( id, name, description, location, logo_path, slug )')
      .eq('donor_id', user.id);
    if (error) throw new Error(error.message);

    const communityMap = new Map();
    (data || []).forEach((item) => {
      const community = Array.isArray(item.communities) ? item.communities[0] : item.communities;
      if (community && !communityMap.has(item.community_id)) communityMap.set(item.community_id, community);
    });
    return Array.from(communityMap.values());
  },

  getActiveDonation: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('donations')
      .select(DONATION_SELECT)
      .eq('donor_id', user.id)
      .in('status', ['pending', 'verified', 'pickup', 'shipping'])
      .order('submitted_at', { ascending: false })
      .limit(1);

    if (error || !data?.length) return null;
    return mapDonation(data[0]);
  },

  getDonationHistory: async () => {
    return donationService.getUserDonations();
  },

  createTestimonial: async ({ donationId, rating = 5, title = '', content }) => {
    const { data, error } = await supabase.rpc('create_testimonial', {
      p_donation_id: donationId,
      p_rating: rating,
      p_title: title,
      p_content: content,
    });
    if (error) throw new Error(error.message);
    return data;
  },
};
