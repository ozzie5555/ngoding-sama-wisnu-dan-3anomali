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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw new Error(error.message);
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
