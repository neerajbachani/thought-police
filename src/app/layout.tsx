import './globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { AuthProvider } from '@/lib/contexts/AuthContexts'
import Navigation from '@/components/Navigation'
// import { BoltNewBadge } from '@/components/ui/bolt-new-badge'

export const metadata: Metadata = {
  title: 'Thought Police - Reddit Contradiction Analysis',
  description: 'Analyze Reddit users for contradictions and inconsistencies in their posting history. Gamified platform with leaderboards and achievements.',
  icons: {
    icon: '/badge.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <ThemeProvider>
         
            <div className="min-h-screen bg-reddit-light-bg-light dark:bg-reddit-dark-bg transition-colors duration-200">
              <Navigation />
              <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              
              {/* <BoltNewBadge 
                position="bottom-right" 
                variant="auto" 
                size="medium"
              /> */}
            </div>
          
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}