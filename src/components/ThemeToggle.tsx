'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-colors duration-200 ${
        isDark 
          ? 'bg-reddit-dark-bg-hover text-reddit-dark-text hover:bg-reddit-dark-border' 
          : 'bg-reddit-light-bg-hover text-reddit-light-text-secondary hover:bg-reddit-light-border'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-reddit-dark-text" />
        ) : (
          <Sun className="h-5 w-5 text-reddit-orange" />
        )}
      </motion.div>
      
      {/* Subtle glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          isDark ? 'bg-reddit-blue/20' : 'bg-reddit-orange/20'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default ThemeToggle