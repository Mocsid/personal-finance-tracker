import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { ToastContainer } from '@/components/ui/toast'
import { CurrencyProvider } from '@/components/currency/currency-provider'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { KeyboardShortcuts } from '@/components/ui/keyboard-shortcuts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'Track your personal income and bills with privacy-first approach',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CurrencyProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
              <ToastContainer />
              <KeyboardShortcuts />
            </div>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}