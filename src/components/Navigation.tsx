'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Trophy, Search, User, TrendingUp, LogOut, LogIn, Menu } from 'lucide-react'

import ThemeToggle from './ThemeToggle'
import { useAuth } from '@/lib/contexts/AuthContexts'

const Navigation: React.FC = () => {
  const pathname = usePathname()
  const { isAuthenticated, signOut, signIn } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-reddit-light-bg dark:bg-reddit-dark-bg-light shadow-lg border-b border-reddit-light-border dark:border-reddit-dark-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-reddit-orange" />
              <div className="absolute inset-0 bg-reddit-orange/20 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-reddit-light-text dark:text-reddit-dark-text">Thought Police</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-reddit-orange text-white shadow-lg shadow-reddit-orange/25' 
                    : 'text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Analyze</span>
              </Link>
              <Link
                href="/leaderboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/leaderboard') 
                    ? 'bg-reddit-orange text-white shadow-lg shadow-reddit-orange/25' 
                    : 'text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/stats"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/stats') 
                    ? 'bg-reddit-orange text-white shadow-lg shadow-reddit-orange/25' 
                    : 'text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Stats</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/profile') 
                    ? 'bg-reddit-orange text-white shadow-lg shadow-reddit-orange/25' 
                    : 'text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={signIn}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-orange transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation