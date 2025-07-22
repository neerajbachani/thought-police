'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowUp, ArrowDown, MessageSquare, Share, Award, Users, TrendingUp, AlertCircle, Star } from 'lucide-react'
import SearchForm from '../SearchForm'
import AnalysisResults from '../AnalysisResults'
import { Analysis } from '@/lib/types'
import { mockUsers } from '@/lib/data/mockData'
import { analysisService } from '@/lib/services/analysisService'

const HomePage: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (username: string) => {
    setIsLoading(true)
    setError('')
    setAnalysisResult(null)
    
    try {
      const analysis = await analysisService.analyzeUser(username)
      
      if (analysis.status === 'failed') {
        setError(analysis.reportData.summary)
      } else {
        setAnalysisResult(analysis)
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred during analysis')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setError('')
    setAnalysisResult(null)
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg shadow-lg p-8 border border-red-200 dark:border-red-700 transition-colors duration-200"
        >
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-reddit-light-text dark:text-reddit-dark-text mb-4 transition-colors duration-200">Analysis Failed</h2>
            <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mb-6 transition-colors duration-200">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-reddit-orange text-white px-6 py-2 rounded-full hover:bg-reddit-orange-hover transition-colors font-medium"
            >
              Try Another User
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (analysisResult) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <button
            onClick={handleRetry}
            className="text-reddit-orange hover:text-reddit-orange-hover font-medium transition-colors duration-200"
          >
            ← Analyze Another User
          </button>
        </div>
        <AnalysisResults analysis={analysisResult} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Reddit-style Subreddit Header */}
      <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-reddit-orange via-red-500 to-reddit-orange-dark relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Subreddit Info */}
        <div className="px-6 py-4 relative">
          <div className="flex items-start space-x-4">
            <div className="relative -mt-8">
              <div className="w-16 h-16 bg-reddit-orange rounded-full border-4 border-reddit-light-bg dark:border-reddit-dark-bg-paper flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 mt-2">
              <h1 className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">
                r/ThoughtPolice
              </h1>
              <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mt-1">
                Advanced Reddit user analysis • Find contradictions in user histories
              </p>
              <div className="flex items-center space-x-6 mt-3 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>1.2k members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>47 online</span>
                </div>
              </div>
            </div>
            <button className="bg-reddit-orange text-white px-6 py-2 rounded-full font-medium hover:bg-reddit-orange-hover transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Post */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png"
                  alt="Bot"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/AutoModerator</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">2h ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-3">
                🔍 Analyze Reddit Users for Contradictions
              </h2>
              <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mb-4">
                Use our advanced AI to analyze Reddit user comment histories and find contradictions. Enter a username below to get started.
              </p>
              
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Post Actions */}
            <div className="px-4 py-2 border-t border-reddit-light-border dark:border-reddit-dark-border bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover">
              <div className="flex items-center space-x-4 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4" />
                  <span>1.2k</span>
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>47 comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Posts */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/logic_police</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">5h ago</span>
                    <div className="bg-reddit-orange text-white px-2 py-1 rounded text-xs font-medium">TOP</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-2">
                🏆 Found 47 contradictions in user history - New personal record!
              </h3>
              <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mb-3">
                Just analyzed a user who had completely opposite opinions on climate change, cryptocurrency, and pineapple pizza across different subreddits. The AI detected a 94% confidence contradiction rate.
              </p>
              <div className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded p-3 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                Sample contradiction: "Bitcoin is a scam" (r/personalfinance) vs "Just bought more BTC, to the moon! 🚀" (r/cryptocurrency)
              </div>
            </div>

            <div className="px-4 py-2 border-t border-reddit-light-border dark:border-reddit-dark-border bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover">
              <div className="flex items-center space-x-4 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4 text-reddit-orange" />
                  <span className="text-reddit-orange font-medium">847</span>
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>128 comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>24 awards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Community Stats Post */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/DataAnalyst_Pro</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">1d ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-3">
                📊 Community Analytics - This Week's Numbers
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-3">
                  <div className="text-2xl font-bold text-reddit-orange">456</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Cases Solved</div>
                </div>
                <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Accuracy Rate</div>
                </div>
                <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">2.3K</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Users Analyzed</div>
                </div>
                <div className="text-center bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">95K</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Comments Scanned</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-reddit-light-border dark:border-reddit-dark-border bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover">
              <div className="flex items-center space-x-4 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4 text-reddit-orange" />
                  <span className="text-reddit-orange font-medium">234</span>
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>45 comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* About Community */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-orange text-white font-medium">
              About Community
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                A community dedicated to analyzing Reddit user histories for contradictions and inconsistencies using advanced AI technology.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Members</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Online</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Created</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">Jan 2024</span>
                </div>
              </div>

              <button className="w-full bg-reddit-orange text-white py-2 rounded-full font-medium hover:bg-reddit-orange-hover transition-colors">
                Create Post
              </button>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Top Contributors
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">#{index + 1}</span>
                    <img
                      src={user.avatar}
                      alt={user.redditUsername}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-reddit-light-text dark:text-reddit-dark-text">
                      u/{user.redditUsername}
                    </div>
                    <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                      {user.totalPoints} points
                    </div>
                  </div>
                  <Star className="h-4 w-4 text-reddit-orange" />
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text">
                Community Guidelines
              </h3>
            </div>
            <div className="p-4 space-y-2 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
              <div>1. Be respectful and civil</div>
              <div>2. No doxxing or harassment</div>
              <div>3. Use for educational purposes only</div>
              <div>4. Share interesting findings</div>
              <div>5. Respect user privacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage