'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  FileText, 
  Award, 
  Target, 
  Star,
  Shield,
  Trophy,
  Medal,
  Users,
  ArrowUp,
  ArrowDown,
  Share,
  Cake,
  Settings,
  LogIn
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContexts'
import { mockAchievements } from '@/lib/data/mockData'

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'about'>('posts')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-reddit-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="h-16 w-16 text-reddit-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text mb-2">
            Authentication Required
          </h2>
          <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mb-6">
            Please sign in to access your profile
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-reddit-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-reddit-orange-dark transition-colors flex items-center space-x-2 mx-auto"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    )
  }

  // Create user profile data from authenticated user
  const currentUser = {
    id: user.id,
    redditUsername: user.redditUsername || user.name || 'Unknown',
    name: user.name || user.redditUsername || 'Unknown',
    image: user.image || getRedditAvatar(user.redditUsername || user.name || 'default'),
    email: user.email || '',
    rank: 'rookie-detective', // Default rank for new users
    totalPoints: 0, // You'll need to calculate this from your database
    casesSolved: 0, // You'll need to calculate this from your database
    accuracyRate: 0, // You'll need to calculate this from your database
    badgeCount: 0, // You'll need to calculate this from your database
    createdAt: new Date().toISOString(), // You might want to get this from your database
  }

  const tabs = [
    { key: 'posts', label: 'Posts', icon: FileText, count: 0 }, // You'll need to get actual counts
    { key: 'comments', label: 'Comments', icon: MessageSquare, count: 0 },
    { key: 'about', label: 'About', icon: Users, count: null }
  ]

  // For now, we'll use empty arrays since we don't have actual posts/comments yet
  const userPosts: any[] = []
  
  const userComments: any[] = []

  function getRedditAvatar(username: string) {
    const avatarIndex = username.charCodeAt(0) % 10
    return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${avatarIndex}.png`
  }

  const formatKarma = (karma: number) => {
    if (karma >= 1000) {
      return `${(karma / 1000).toFixed(1)}k`
    }
    return karma.toString()
  }

  // Calculate account age (you might want to get this from your database)
  const getAccountAge = () => {
    const created = new Date(currentUser.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`
    } else {
      return `${Math.floor(diffDays / 365)} years ago`
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Reddit-style Profile Header */}
      <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-reddit-orange via-red-500 to-reddit-orange-dark relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Profile Info */}
        <div className="px-6 py-4 relative">
          <div className="flex items-start space-x-4">
            <div className="relative -mt-12">
              <img
                src={currentUser.image}
                alt={currentUser.redditUsername}
                className="w-20 h-20 rounded-full border-4 border-reddit-light-bg dark:border-reddit-dark-bg-paper bg-reddit-light-bg dark:bg-reddit-dark-bg-paper"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-reddit-orange rounded-full border-2 border-reddit-light-bg dark:border-reddit-dark-bg-paper flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">
                  u/{currentUser.redditUsername}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="bg-reddit-orange text-white px-2 py-1 rounded text-xs font-medium">
                    {currentUser.rank.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    VERIFIED
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <Cake className="h-4 w-4" />
                  <span>Joined: {getAccountAge()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>{formatKarma(currentUser.totalPoints)} karma</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{currentUser.casesSolved} cases solved</span>
                </div>
              </div>
              
              <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mt-2">
                Digital truth seeker • Contradiction detective • Making Reddit more honest, one analysis at a time 🕵️‍♂️
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                <p className="text-xs text-green-700 dark:text-green-300">
                  ✅ Authenticated Profile
                </p>
              </div>
              <button className="p-2 text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-light-text dark:hover:text-reddit-dark-text">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Navigation Tabs */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="flex border-b border-reddit-light-border dark:border-reddit-dark-border">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'posts' | 'comments' | 'about')}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.key
                        ? 'border-reddit-orange text-reddit-orange bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover'
                        : 'border-transparent text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-light-text dark:hover:text-reddit-dark-text hover:bg-reddit-light-bg-hover dark:hover:bg-reddit-dark-bg-hover'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border p-8 text-center">
                  <FileText className="h-12 w-12 text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-reddit-light-text dark:text-reddit-dark-text mb-2">
                    No posts yet
                  </h3>
                  <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                    Start analyzing Reddit users to create your first post!
                  </p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden hover:border-reddit-light-border-hover dark:hover:border-reddit-dark-border-hover transition-colors"
                  >
                    {/* Post content would go here */}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {userComments.length === 0 ? (
                <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-reddit-light-text dark:text-reddit-dark-text mb-2">
                    No comments yet
                  </h3>
                  <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                    Your comments will appear here once you start participating in discussions.
                  </p>
                </div>
              ) : (
                userComments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden"
                  >
                    {/* Comment content would go here */}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border p-6"
            >
              <h3 className="text-lg font-bold text-reddit-light-text dark:text-reddit-dark-text mb-4">
                About u/{currentUser.redditUsername}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-reddit-light-text dark:text-reddit-dark-text mb-2">Profile Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Reddit Username:</span>
                      <span className="text-reddit-light-text dark:text-reddit-dark-text">{currentUser.redditUsername}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Email:</span>
                      <span className="text-reddit-light-text dark:text-reddit-dark-text">{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Account Created:</span>
                      <span className="text-reddit-light-text dark:text-reddit-dark-text">{getAccountAge()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-reddit-light-text dark:text-reddit-dark-text mb-2">Bio</h4>
                  <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                    New to Thought Police! Ready to start detecting contradictions and seeking digital truth.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Keep your existing sidebar code but update the data references */}
        <div className="space-y-4">
          {/* Karma Breakdown */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Karma Breakdown
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Post Karma</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{formatKarma(Math.floor(currentUser.totalPoints * 0.7))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Comment Karma</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{formatKarma(Math.floor(currentUser.totalPoints * 0.3))}</span>
              </div>
              <div className="flex justify-between border-t border-reddit-light-border dark:border-reddit-dark-border pt-2">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm font-medium">Total Karma</span>
                <span className="font-bold text-reddit-orange">{formatKarma(currentUser.totalPoints)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Profile Stats
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Cases Solved</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.casesSolved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Accuracy Rate</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.accuracyRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Rank</span>
                <span className="font-medium text-reddit-orange">{currentUser.rank.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Badge Count</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.badgeCount}</span>
              </div>
            </div>
          </div>

          {/* Keep the rest of your sidebar components but they'll show empty/default states for new users */}{/* Sidebar */}
        <div className="space-y-4">
          {/* Karma Breakdown */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Karma Breakdown
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Post Karma</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{formatKarma(currentUser.totalPoints * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Comment Karma</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{formatKarma(currentUser.totalPoints * 0.3)}</span>
              </div>
              <div className="flex justify-between border-t border-reddit-light-border dark:border-reddit-dark-border pt-2">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm font-medium">Total Karma</span>
                <span className="font-bold text-reddit-orange">{formatKarma(currentUser.totalPoints)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Profile Stats
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Cases Solved</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.casesSolved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Accuracy Rate</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.accuracyRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Rank</span>
                <span className="font-medium text-reddit-orange">{currentUser.rank.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Badge Count</span>
                <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{currentUser.badgeCount}</span>
              </div>
            </div>
          </div>

          {/* Trophy Case */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Trophy Case
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {mockAchievements.filter(a => a.unlockedAt).slice(0, 6).map((achievement) => (
                  <div key={achievement.id} className="text-center">
                    <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${
                      achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}>
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-xs text-reddit-light-text dark:text-reddit-dark-text font-medium truncate">
                      {achievement.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Communities */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Active Communities
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {['ThoughtPolice', 'changemyview', 'MachineLearning', 'politics', 'dataisbeautiful'].map((community) => (
                <div key={community} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-reddit-orange rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">r/</span>
                  </div>
                  <span className="text-sm text-reddit-light-text dark:text-reddit-dark-text hover:text-reddit-orange cursor-pointer">
                    r/{community}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage