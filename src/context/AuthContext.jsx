import { useState, useEffect } from 'react'
import { AuthContext } from './authContextDef'
import { DEFAULT_USER } from '../data/profileData'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('kembali_is_authenticated')
    return saved !== null ? JSON.parse(saved) : true // Default true for development & testing
  })

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kembali_user_profile')
    return saved !== null ? JSON.parse(saved) : DEFAULT_USER
  })

  useEffect(() => {
    localStorage.setItem('kembali_is_authenticated', JSON.stringify(isAuthenticated))
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('kembali_user_profile', JSON.stringify(user))
  }, [user])

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields }
      if (updatedFields.name) {
        updated.shortName = updatedFields.name.trim().split(' ')[0] || 'Wisnu'
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

  const deleteAccount = () => {
    setUser(DEFAULT_USER)
    setIsAuthenticated(false)
    localStorage.removeItem('kembali_user_profile')
    localStorage.removeItem('kembali_is_authenticated')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateProfile,
        updatePrivacy,
        updateSecurity,
        resetProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
