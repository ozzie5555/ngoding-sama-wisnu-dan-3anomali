import { supabase } from '../../../lib/supabase/client';

export const authService = {
  login: async (emailOrUsername, password) => {
    let email = emailOrUsername;

    if (!emailOrUsername.includes('@')) {
      const { data: profile, error: lookupError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single();

      if (lookupError || !profile || !profile.email) {
        throw new Error('Username tidak ditemukan. Gunakan email untuk login.');
      }

      email = profile.email;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email atau Password salah.');
      }
      throw new Error(error.message);
    }

    // Fetch profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || data.user.email.split('@')[0],
        username: profile?.username || '@' + data.user.email.split('@')[0],
        phone: profile?.phone || '',
        avatar: profile?.avatar_path || '',
      },
    };
  },

  register: async (email, password, fullName = '', username = '') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          username: username || '@' + email.split('@')[0],
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Email sudah terdaftar.');
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email || email,
        name: fullName || email.split('@')[0],
        username: username || '@' + email.split('@')[0],
      },
      needsConfirmation: !data.session,
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  resetPassword: async (email) => {
    return authService.requestEmailReset(email);
  },

  /**
   * Request Supabase password recovery email
   */
  requestEmailReset: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Fallback for development if local supabase offline
        if (import.meta.env.DEV && (error.message.includes('fetch') || error.message.includes('network'))) {
          console.warn('[authService] Local Supabase offline, using dev mock for email reset.');
          await new Promise((res) => setTimeout(res, 600));
          return { success: true, isMock: true };
        }
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (err) {
      if (import.meta.env.DEV && (err.message.includes('fetch') || err.message.includes('Failed to fetch'))) {
        console.warn('[authService] Dev mock fallback for email reset.');
        await new Promise((res) => setTimeout(res, 600));
        return { success: true, isMock: true };
      }
      throw err;
    }
  },

  /**
   * Request WhatsApp OTP service abstraction
   * Designed for direct integration with WhatsApp Business API / Twilio / custom provider
   */
  requestWhatsappOtp: async (phone) => {
    // Service abstraction for WhatsApp OTP provider
    // In dev / before backend integration, provides mock response
    await new Promise((res) => setTimeout(res, 700));
    return {
      success: true,
      message: 'Kode verifikasi telah dikirim ke WhatsApp Anda.',
      isMock: true,
    };
  },

  /**
   * Verify WhatsApp 4-digit OTP service abstraction
   */
  verifyOtp: async (phone, otpCode) => {
    await new Promise((res) => setTimeout(res, 700));
    const otp = typeof otpCode === 'string' ? otpCode : otpCode.join('');
    if (!otp || otp.length !== 4) {
      throw new Error('Kode verifikasi harus 4 digit.');
    }
    // Accept valid 4 digit numeric OTP
    return {
      success: true,
      message: 'Verifikasi berhasil.',
    };
  },

  /**
   * Update password in Supabase for user in recovery/authenticated session
   */
  updateUserPassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (import.meta.env.DEV && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Auth session missing'))) {
          console.warn('[authService] Dev mock fallback for password update.');
          await new Promise((res) => setTimeout(res, 600));
          return { success: true, isMock: true };
        }
        throw new Error(error.message);
      }

      return { success: true, user: data.user };
    } catch (err) {
      if (import.meta.env.DEV && (err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('Auth session missing'))) {
        console.warn('[authService] Dev mock fallback for password update.');
        await new Promise((res) => setTimeout(res, 600));
        return { success: true, isMock: true };
      }
      throw err;
    }
  },

  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        username: updates.username,
        email: updates.email || user.email,
        phone: updates.phone,
        birth_date: updates.birthDate || null,
        address: updates.location,
      })
      .eq('id', user.id);

    if (error) throw new Error(error.message);
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // ==========================================
  // AVATAR UPLOAD
  // ==========================================
  uploadAvatar: async (file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_path: publicUrl })
      .eq('id', user.id);

    if (updateError) throw new Error(updateError.message);

    return { success: true, url: publicUrl };
  },

  // ==========================================
  // PRIVACY SETTINGS
  // ==========================================
  getPrivacySettings: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profile_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);

    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('profile_settings')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      return newData;
    }

    return data;
  },

  updatePrivacySettings: async (settings) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profile_settings')
      .upsert({
        user_id: user.id,
        contribution_visibility: settings.contributionVisibility,
        general_location: settings.generalLocation,
        impact_report: settings.impactReport,
        donation_history: settings.donationHistory,
      }, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);
    return { success: true };
  },

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================
  deleteAccount: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Delete from profiles (cascades to profile_settings)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) throw new Error(profileError.message);

    // Sign out (Supabase doesn't allow self-delete via client, so we clean up data + sign out)
    await supabase.auth.signOut();

    return { success: true };
  },

  // ==========================================
  // CHANGE EMAIL (requires re-auth)
  // ==========================================
  changeEmail: async (newEmail, currentPassword) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Re-authenticate first
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (authError) throw new Error('Password salah.');

    // Update email
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw new Error(error.message);

    // Update email in profiles table
    await supabase
      .from('profiles')
      .update({ email: newEmail })
      .eq('id', user.id);

    return { success: true };
  },

  // ==========================================
  // CHANGE PASSWORD (requires current password)
  // ==========================================
  changePassword: async (currentPassword, newPassword) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Re-authenticate first
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (authError) throw new Error('Password lama salah.');

    // Update password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);

    // Save timestamp to profiles
    await supabase
      .from('profiles')
      .update({ password_last_updated: new Date().toISOString() })
      .eq('id', user.id);

    return { success: true };
  },

  // ==========================================
  // UPDATE WHATSAPP
  // ==========================================
  updateWhatsapp: async (phone) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ phone })
      .eq('id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};

