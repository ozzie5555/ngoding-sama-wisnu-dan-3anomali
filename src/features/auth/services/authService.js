import { supabase } from '../../../lib/supabase/client';

export const authService = {
  // Reliable way to get current user (getUser may fail, fallback to session)
  getAuthUser: async () => {
    let { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      // Auth error (403/401) = invalid/stale token — clear session
      if (error.status === 403 || error.status === 401 || error.message?.includes('JWT') || error.message?.includes('token')) {
        console.warn('[authService] Stale session detected, signing out');
        await supabase.auth.signOut();
        return null;
      }
      // Network error — fallback to local session
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user;
    }
    return user;
  },

  login: async (emailOrUsername, password) => {
    const identifier = emailOrUsername.trim();
    let email = identifier;

    if (!identifier.includes('@')) {
      const { data: profileEmail, error: lookupError } = await supabase.rpc(
        'lookup_email_by_username',
        { p_username: identifier }
      );

      if (lookupError || !profileEmail) {
        throw new Error('Username tidak ditemukan. Gunakan email untuk login.');
      }

      email = profileEmail;
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
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) throw new Error(error.message);
    return { success: true, data };
  },

  /**
   * Request WhatsApp OTP service abstraction
   * Designed for direct integration with WhatsApp Business API / Twilio / custom provider
   */
  requestWhatsappOtp: async (phone) => {
    // Demo-only fallback until a real SMS/WhatsApp provider is configured.
    if (!import.meta.env.DEV) {
      throw new Error('Provider OTP belum dikonfigurasi.');
    }
    await new Promise((res) => setTimeout(res, 700));
    return {
      success: true,
      message: 'Kode demo berhasil dibuat.',
      isMock: true,
      demoCode: '1234',
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
    if (import.meta.env.DEV && otp !== '1234') {
      throw new Error('Kode demo salah. Gunakan 1234.');
    }
    if (!import.meta.env.DEV) {
      throw new Error('Provider OTP belum dikonfigurasi.');
    }
    return {
      success: true,
      message: 'Verifikasi berhasil.',
    };
  },

  /**
   * Update password in Supabase for user in recovery/authenticated session
   */
  updateUserPassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);

    const passwordUpdatedAt = new Date().toISOString();
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ password_last_updated: passwordUpdatedAt })
      .eq('id', data.user.id)
      .select('id, password_last_updated')
      .single();

    if (profileError) throw new Error(profileError.message);
    return { success: true, user: data.user, passwordUpdatedAt };
  },

  updateProfile: async (updates) => {
    const user = await authService.getAuthUser();
    if (!user) throw new Error('Not authenticated');

    const profileUpdates = {
      full_name: updates.name,
      username: updates.username,
      email: updates.email,
      phone: updates.phone,
      birth_date: updates.birthDate || null,
      address: updates.location,
      updated_at: new Date().toISOString(),
    };

    // Jangan menghapus foto hanya karena caller lama tidak mengirim field avatar.
    if (Object.prototype.hasOwnProperty.call(updates, 'avatar')) {
      profileUpdates.avatar_path = updates.avatar || null;
    }

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id)
      .select('id, full_name, username, email, phone, birth_date, address, avatar_path')
      .single();

    if (error) throw new Error(error.message);

    // Save avatar position in user metadata when it changes.
    if (updates.avatarPosition) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_position: updates.avatarPosition }
      });
      if (metadataError) throw new Error(metadataError.message);
    }
  },

  getUser: async () => {
    const user = await authService.getAuthUser();
    return user;
  },

  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // ==========================================
  // AVATAR UPLOAD
  // ==========================================
  uploadAvatar: async (file, avatarPosition) => {
    const user = await authService.getAuthUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const timestamp = Date.now();
    const publicUrl = `${supabase.storage.from('profile-photos').getPublicUrl(filePath).data.publicUrl}?t=${timestamp}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_path: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, avatar_path')
      .single();

    if (updateError) throw new Error(updateError.message);

    if (avatarPosition) {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_position: avatarPosition }
      });
      if (metadataError) throw new Error(metadataError.message);
    }

    return { success: true, url: publicUrl };
  },

  removeAvatar: async () => {
    const user = await authService.getAuthUser();
    if (!user) throw new Error('Not authenticated');

    const filePaths = ['avatar.jpg', 'avatar.jpeg', 'avatar.png', 'avatar.webp']
      .map((name) => user.id + '/' + name);

    const { error: removeError } = await supabase.storage
      .from('profile-photos')
      .remove(filePaths);

    if (removeError) throw new Error(removeError.message);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_path: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, avatar_path')
      .single();

    if (updateError) throw new Error(updateError.message);
    return { success: true };
  },

  // ==========================================
  // PRIVACY SETTINGS
  // ==========================================
  getPrivacySettings: async () => {
    const user = await authService.getAuthUser();
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
    const user = await authService.getAuthUser();
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
    const user = await authService.getAuthUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('delete-account', {
      body: {},
    });

    if (error) throw new Error(error.message || 'Gagal menghapus akun');
    if (!data?.success) throw new Error(data?.error || 'Gagal menghapus akun');

    await supabase.auth.signOut();
    return { success: true };
  },

  // ==========================================
  // CHANGE EMAIL (requires re-auth)
  // ==========================================
  changeEmail: async (newEmail, currentPassword) => {
    const user = await authService.getAuthUser();
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
    const user = await authService.getAuthUser();
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

    // Save timestamp to profiles and verify the row was updated.
    const passwordUpdatedAt = new Date().toISOString();
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ password_last_updated: passwordUpdatedAt })
      .eq('id', user.id)
      .select('id, password_last_updated')
      .single();

    if (profileError) throw new Error(profileError.message);
    return { success: true, passwordUpdatedAt };
  },

  // ==========================================
  // UPDATE WHATSAPP
  // ==========================================
  updateWhatsapp: async (phone) => {
    const user = await authService.getAuthUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ phone })
      .eq('id', user.id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
};

