import { supabase } from '../../../lib/supabase/client';

// Generate unique donation code: KBL-XXXX
const generateDonationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'KBL-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const donationService = {
  /**
   * Submit a new donation
   */
  submitDonation: async ({ communityId, needId, category, itemName, conditionNote, quantity, description, pickupAddress, pickupAt, photos }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const donationCode = generateDonationCode();

    // Insert donation
    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        donation_code: donationCode,
        donor_id: user.id,
        community_id: communityId,
        need_id: needId || null,
        category: category || 'barang_bekas',
        item_name: itemName,
        condition_note: conditionNote || '',
        quantity: quantity || 1,
        description: description || '',
        pickup_address: pickupAddress || '',
        pickup_at: pickupAt || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Upload photos if provided
    if (photos && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${donation.id}/photo-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('item-photos')
          .upload(filePath, file);

        if (!uploadError) {
          await supabase
            .from('donation_items')
            .insert({
              donation_id: donation.id,
              storage_path: filePath,
              sort_order: i,
            });
        }
      }
    }

    return { success: true, donationCode, donation };
  },
  /**
   * Get all donations for the current user
   */
  getUserDonations: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        donation_code,
        item_name,
        category,
        quantity,
        status,
        submitted_at,
        received_at,
        condition_note,
        communities (
          name
        )
      `)
      .eq('donor_id', user.id)
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Compute user stats from donations
   */
  getUserStats: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select('status, quantity')
      .eq('donor_id', user.id);

    if (error) throw new Error(error.message);

    const donations = data || [];
    const totalDonations = donations.length;
    const distributed = donations.filter(d => d.status === 'received').length;
    const totalItems = donations.reduce((sum, d) => sum + (d.quantity || 0), 0);

    return {
      donations: totalDonations,
      distributed: distributed,
      saved: totalItems,
  /**
   * Get unique communities the user has donated to
   */
  getUserCommunities: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select(`
        community_id,
        communities (
          id, name, description, location, logo_path, slug
        )
      `)
      .eq('donor_id', user.id);

    if (error) throw new Error(error.message);

    const communityMap = new Map();
    (data || []).forEach((d) => {
      if (d.communities && !communityMap.has(d.community_id)) {
        communityMap.set(d.community_id, d.communities);
      }
    });

    return Array.from(communityMap.values());
  },
};
  },

  /**
   * Get active (in-progress) donation for the current user
   */
  getActiveDonation: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        donation_code,
        item_name,
        category,
        quantity,
        status,
        submitted_at,
        condition_note,
        communities (
          name
        )
      `)
      .eq('donor_id', user.id)
      .in('status', ['pending', 'verified', 'in_transit'])
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    return data;
  },

  /**
   * Get donation history (completed/cancelled)
   */
  getDonationHistory: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        donation_code,
        item_name,
        category,
        quantity,
        status,
        submitted_at,
        received_at,
        communities (
          name
        )
      `)
      .eq('donor_id', user.id)
      .in('status', ['received', 'cancelled'])
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },
};
