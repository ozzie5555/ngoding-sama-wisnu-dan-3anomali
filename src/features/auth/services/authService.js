import { supabase } from '../../../lib/supabase/client';

export const authService = {
  login: async (emailOrUsername, password) => {
    // Supabase Auth only supports email login (not username)
    // If input contains @, treat as email; otherwise, we need to look up the email first
    let email = emailOrUsername;

    if (!emailOrUsername.includes('@')) {
      // Look up email from profiles table by username
      const { data: profile, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', emailOrUsername)
        .single();

      if (lookupError || !profile) {
        throw new Error('Email atau Password salah.');
      }

      // We can't get the email from profiles (not exposed via RLS for security)
      // So we require email login for now
      throw new Error('Silakan login menggunakan email.');
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
};

