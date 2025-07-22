'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn as authSignIn, signOut as authSignOut } from '@/lib/auth-client'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, isPending: isLoading } = useSession()
  
  const handleSignIn = async () => {
    try {
      await authSignIn.social({
        provider: 'reddit',
        callbackURL: '/profile', // Redirect to profile after successful login
      })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }
  
  const handleSignOut = async () => {
    try {
      await authSignOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/'
          }
        }
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}