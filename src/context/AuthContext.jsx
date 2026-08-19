import { useState, useEffect, useCallback } from 'react'
import { AuthContext } from './authContextDef'
import { supabase } from '../lib/supabase/client'
import { DEFAULT_USER } from '../data/profileData'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(DEFAULT_USER)
  const [initialized, setInitialized] = useState(false)

  // Fetch profile from database
  const fetchProfile = useCallback(async (userId, sessionEmail) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const email = profile?.email || sessionEmail || ''

      if (error) {
        console.error('[Auth] fetchProfile error:', error.message)
      }

      if (profile) {
        // Fetch privacy settings from profile_settings
        const { data: settings } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('user_id', userId)
          .single()

        setUser({
          id: profile.id,
          name: profile.full_name || DEFAULT_USER.name,
          shortName: (profile.full_name || DEFAULT_USER.name).split(' ')[0],
          username: profile.username || DEFAULT_USER.username,
          email: email,
          phone: profile.phone || '',
          birthDate: profile.birth_date || '',
          location: profile.address || '',
          status: profile.role === 'admin' ? 'Admin' : profile.role === 'manager' ? 'Manager Komunitas' : 'Donatur Aktif',
          avatar: profile.avatar_path || DEFAULT_USER.avatar,
          stats: DEFAULT_USER.stats,
          passwordLastUpdated: DEFAULT_USER.passwordLastUpdated,
          whatsapp: profile.phone || '',
          privacy: {
            contributionVisibility: settings?.contribution_visibility ?? DEFAULT_USER.privacy.contributionVisibility,
            generalLocation: settings?.general_location ?? DEFAULT_USER.privacy.generalLocation,
            impactReport: settings?.impact_report ?? DEFAULT_USER.privacy.impactReport,
            donationHistory: settings?.donation_history ?? DEFAULT_USER.privacy.donationHistory,
          },
        })
      } else {
        console.warn('[Auth] No profile found for user:', userId)
        setUser((prev) => ({
          ...prev,
          id: userId,
          email: email,
          name: email.split('@')[0],
          shortName: email.split('@')[0],
          username: '@' + email.split('@')[0],
        }))
      }
    } catch (err) {
      console.error('[Auth] fetchProfile exception:', err)
    }
  }, [])

  // Refresh profile (call after profile updates)
  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await fetchProfile(session.user.id, session.user.email)
    }
  }, [fetchProfile])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true)
          await fetchProfile(session.user.id, session.user.email)
        } else {
          setIsAuthenticated(false)
          setUser(DEFAULT_USER)
        }
        setInitialized(true)
      }
    )

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true)
        await fetchProfile(session.user.id, session.user.email)
      }
      setInitialized(true)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUser(DEFAULT_USER)
  }

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields }
      if (updatedFields.name) {
        updated.shortName = updatedFields.name.trim().split(' ')[0] || 'User'
      }
      return updated
    })
  }

  const updatePrivacy = (key, value) => {
    setUser((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const updateSecurity = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const resetProfile = () => {
    setUser(DEFAULT_USER)
  }

  const deleteAccount = async () => {
    setUser(DEFAULT_USER)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        initialized,
        login,
        logout,
        updateProfile,
        updatePrivacy,
        updateSecurity,
        resetProfile,
        deleteAccount,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
