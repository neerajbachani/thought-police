'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  Award,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Share,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Shield,
  Star
} from 'lucide-react'
// import { BoltNewBadge } from '../ui/bolt-new-badge'

const StatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const contradictionTrendData = [
    { date: '2024-01', contradictions: 234, accuracy: 89 },
    { date: '2024-02', contradictions: 456, accuracy: 91 },
    { date: '2024-03', contradictions: 398, accuracy: 87 },
    { date: '2024-04', contradictions: 567, accuracy: 93 },
    { date: '2024-05', contradictions: 623, accuracy: 90 },
    { date: '2024-06', contradictions: 789, accuracy: 88 }
  ]

  const categoryData = [
    { name: 'Political', value: 35, color: '#ef4444' },
    { name: 'Personal Preference', value: 28, color: '#3b82f6' },
    { name: 'Factual', value: 18, color: '#8b5cf6' },
    { name: 'Opinion', value: 12, color: '#10b981' },
    { name: 'Lifestyle', value: 5, color: '#f59e0b' },
    { name: 'Relationship', value: 2, color: '#ec4899' }
  ]

  const topSubredditsData = [
    { name: 'politics', contradictions: 1234, color: '#ef4444' },
    { name: 'unpopularopinion', contradictions: 987, color: '#f97316' },
    { name: 'changemyview', contradictions: 756, color: '#eab308' },
    { name: 'AmItheAsshole', contradictions: 543, color: '#22c55e' },
    { name: 'relationship_advice', contradictions: 432, color: '#3b82f6' },
    { name: 'food', contradictions: 321, color: '#8b5cf6' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Reddit-style Subreddit Header */}
      <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-reddit-orange relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Subreddit Info */}
        <div className="px-6 py-4 relative">
          <div className="flex items-start space-x-4">
            <div className="relative -mt-8">
              <div className="w-16 h-16 bg-reddit-orange rounded-full border-4 border-reddit-light-bg dark:border-reddit-dark-bg-paper flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1 mt-2">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">
                  r/ThoughtPolice/Analytics
                </h1>
                {/* Inline Bolt Badge for header */}
                {/* <div className="relative">
                  <BoltNewBadge 
                    position="top-right" 
                    variant="text" 
                    size="small"
                    className="!relative !top-0 !right-0 !w-16 !h-auto"
                  /> 
                </div> */}
              </div>
              <p className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary mt-1">
                Community insights and platform statistics • Real-time data from our thought police operations
              </p>
              <div className="flex items-center space-x-6 mt-3 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>Live analytics</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Updated 2 min ago</span>
                </div>
              </div>
            </div>
            
            {/* Period Selector */}
            <div className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-1 border border-reddit-light-border dark:border-reddit-dark-border">
              {[
                { key: '7d', label: '7D' },
                { key: '30d', label: '30D' },
                { key: '90d', label: '90D' },
                { key: '1y', label: '1Y' }
              ].map((period) => (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key as '7d' | '30d' | '90d' | '1y')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedPeriod === period.key
                      ? 'bg-reddit-orange text-white'
                      : 'text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary hover:text-reddit-light-text dark:hover:text-reddit-dark-text'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Metrics Post */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png"
                  alt="Analytics Bot"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/AnalyticsBot</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">5m ago</span>
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">LIVE</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-4">
                📊 Platform Performance Dashboard - Real-time Metrics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-reddit-orange" />
                    <span className="text-xs text-green-600 font-medium">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">1,247</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Active Officers</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="text-xs text-green-600 font-medium">+23%</span>
                  </div>
                  <div className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">8,932</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Contradictions Found</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">+2.1%</span>
                  </div>
                  <div className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">87.3%</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Accuracy Rate</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span className="text-xs text-green-600 font-medium">+45%</span>
                  </div>
                  <div className="text-2xl font-bold text-reddit-light-text dark:text-reddit-dark-text">156K</div>
                  <div className="text-xs text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Comments Analyzed</div>
                </motion.div>
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
                  <span>32 comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>5 awards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trends Chart Post */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
                  alt="Trend Analyzer"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/trend_analyzer</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                📈 Contradiction Detection Trends
              </h3>
              <div className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={contradictionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="contradictions" 
                      stroke="#FF4500" 
                      fill="#FF4500" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
                  <span>18 comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subreddit Analysis Post */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-reddit-light-border dark:border-reddit-dark-border">
              <div className="flex items-center space-x-3">
                <img
                  src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png"
                  alt="Subreddit Analyst"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">r/ThoughtPolice</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">•</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">Posted by u/subreddit_scout</span>
                    <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">3h ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-reddit-light-text dark:text-reddit-dark-text mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-reddit-orange" />
                🏆 Top Contradiction Sources by Subreddit
              </h3>
              <div className="bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover rounded-lg p-4 border border-reddit-light-border dark:border-reddit-dark-border">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topSubredditsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="contradictions" fill="#FF4500" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-reddit-light-border dark:border-reddit-dark-border bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover">
              <div className="flex items-center space-x-4 text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                <div className="flex items-center space-x-1">
                  <ArrowUp className="h-4 w-4 text-reddit-orange" />
                  <span className="text-reddit-orange font-medium">156</span>
                  <ArrowDown className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>24 comments</span>
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
          {/* Community Stats */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-orange text-white font-medium">
              Analytics Dashboard
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">
                Real-time analytics and insights from the Thought Police community platform.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Total Users</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Cases Solved</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">8,932</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Accuracy Rate</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">87.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary text-sm">Comments Analyzed</span>
                  <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">156K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text flex items-center">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Contradiction Categories
              </h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-reddit-light-text-secondary dark:text-reddit-dark-text-secondary">{category.name}</span>
                    </div>
                    <span className="font-medium text-reddit-light-text dark:text-reddit-dark-text">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-reddit-light-bg dark:bg-reddit-dark-bg-paper rounded-lg border border-reddit-light-border dark:border-reddit-dark-border overflow-hidden">
            <div className="px-4 py-3 bg-reddit-light-bg-hover dark:bg-reddit-dark-bg-hover border-b border-reddit-light-border dark:border-reddit-dark-border">
              <h3 className="font-medium text-reddit-light-text dark:text-reddit-dark-text flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Live Activity
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-sm text-reddit-light-text dark:text-reddit-dark-text">47 users online</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-reddit-orange rounded-full animate-pulse"></div>
                <div className="text-sm text-reddit-light-text dark:text-reddit-dark-text">12 active analyses</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="text-sm text-reddit-light-text dark:text-reddit-dark-text">234 comments processed</div>
              </div>
            </div>
          </div>

          {/* Platform Milestones */}
          <div className="bg-gradient-to-br from-reddit-orange via-red-500 to-reddit-orange-dark rounded-lg p-4 text-white">
            <h3 className="font-bold mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Platform Milestones
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 opacity-80" />
                  <span className="text-sm">Total Analyses</span>
                </div>
                <span className="font-bold">100K+</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 opacity-80" />
                  <span className="text-sm">Comments Processed</span>
                </div>
                <span className="font-bold">1M+</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 opacity-80" />
                  <span className="text-sm">Community Rating</span>
                </div>
                <span className="font-bold">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage