import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from './authContextDef'
import { supabase } from '../lib/supabase/client'
import { DEFAULT_USER } from '../data/profileData'
import { donationService } from '../features/donation/services/donationService'

const formatUsername = (username, email = '') => {
  const value = String(username || email.split('@')[0] || 'pengguna').trim().replace(/^@+/, '')
  return `@${value}`
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(DEFAULT_USER)
  const [initialized, setInitialized] = useState(false)
  const [pendingProfileRedirect, setPendingProfileRedirect] = useState(false)
  const profileRequestId = useRef(0)

  // Fetch profile from database
  const fetchProfile = useCallback(async (userId, sessionEmail, userMetadata = {}) => {
    const requestId = ++profileRequestId.current
    try {
      console.log('[Auth] fetchProfile called for:', userId)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      const email = profile?.email || sessionEmail || ''

      if (error) {
        console.error('[Auth] fetchProfile error:', error.message)
      }

      if (profile) {
        // Check if profile is complete (for Google OAuth users)
        const isComplete = !!profile.phone;
        console.log('[Auth] Profile found - phone:', profile.phone, 'avatar:', profile.avatar_path, 'isComplete:', isComplete)

        if (!isComplete) {
          setIsAuthenticated(true)
          setPendingProfileRedirect(true)
          setUser((prev) => ({
            ...prev,
            id: userId,
            email: email,
            name: profile.full_name || email.split('@')[0],
            shortName: (profile.full_name || email.split('@')[0]).split(' ')[0],
            username: formatUsername(profile.username, email),
            needsProfile: true,
          }))
          return
        }

        // Profile complete — load full data
        const [{ data: settings }, stats] = await Promise.all([
          supabase
            .from('profile_settings')
            .select('*')
            .eq('user_id', userId)
            .single()
            .then(({ data }) => ({ data })),
          donationService.getUserStats().catch(() => DEFAULT_USER.stats),
        ])

        // Ignore an older request that finished after a newer profile refresh.
        if (requestId !== profileRequestId.current) return

        const fallbackName = profile.full_name || (email ? email.split('@')[0] : 'Pengguna');
        setUser({
          id: profile.id,
          name: fallbackName,
          shortName: fallbackName.split(' ')[0],
          username: formatUsername(profile.username, email),
          email: email,
          phone: profile.phone || '',
          birthDate: profile.birth_date || '',
          location: profile.address || '',
          status: profile.role === 'admin' ? 'Admin' : profile.role === 'manager' ? 'Manager Komunitas' : 'Donatur Aktif',
          avatar: profile.avatar_path || DEFAULT_USER.avatar,
          stats: stats,
          passwordLastUpdated: profile.password_last_updated || '',
          whatsapp: profile.phone || '',
          avatarPosition: userMetadata.avatar_position || '50% 50%',
          privacy: {
            contributionVisibility: settings?.contribution_visibility ?? DEFAULT_USER.privacy.contributionVisibility,
            generalLocation: settings?.general_location ?? DEFAULT_USER.privacy.generalLocation,
            impactReport: settings?.impact_report ?? DEFAULT_USER.privacy.impactReport,
            donationHistory: settings?.donation_history ?? DEFAULT_USER.privacy.donationHistory,
          },
        })
      } else {
        if (requestId !== profileRequestId.current) return
        console.warn('[Auth] No profile found for user:', userId)
        setUser((prev) => ({
          ...prev,
          id: userId,
          email: email,
          name: email.split('@')[0],
          shortName: email.split('@')[0],
          username: formatUsername('', email),
          needsProfile: true,
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
      await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
    }
  }, [fetchProfile])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const recoveryPending = typeof window !== 'undefined'
          && (sessionStorage.getItem('kembali_password_recovery_pending') === 'true'
            || window.location.pathname === '/reset-password')

        // INITIAL_SESSION is handled by the validated getSession() flow below.
        // Skipping it here prevents duplicate profile requests during refresh.
        if (event === 'INITIAL_SESSION') return

        if (session?.user && !recoveryPending) {
          setIsAuthenticated(true)
          await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        } else {
          setIsAuthenticated(false)
          setUser(DEFAULT_USER)
        }
        setInitialized(true)
      }
    )

    // Check initial session — validate with getUser() to detect stale tokens
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const recoveryPending = typeof window !== 'undefined'
        && (sessionStorage.getItem('kembali_password_recovery_pending') === 'true'
          || window.location.pathname === '/reset-password')

      if (session?.user && !recoveryPending) {
        // Validate token actually works
        const { data: { user: validUser }, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('[Auth] Stale session detected, clearing:', error.message);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setUser(DEFAULT_USER);
        } else if (validUser) {
          setIsAuthenticated(true)
          await fetchProfile(validUser.id, validUser.email, validUser.user_metadata)
        }
      } else {
        setIsAuthenticated(false)
        setUser(DEFAULT_USER)
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
        pendingProfileRedirect,
        clearPendingProfileRedirect: () => setPendingProfileRedirect(false),
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
