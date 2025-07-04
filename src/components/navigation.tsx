'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DollarSign, Receipt, Home, TrendingUp, Download, Settings, Keyboard } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ThemeToggle } from './ui/theme-toggle'
import { Tooltip } from './ui/tooltip'
import { useCurrency } from './currency/currency-provider'
import { CURRENCIES } from '@/lib/currency'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, shortcut: 'g d' },
  { name: 'Bills', href: '/bills', icon: Receipt, shortcut: 'g b' },
  { name: 'Income', href: '/income', icon: DollarSign, shortcut: 'g i' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, shortcut: 'g a' },
  { name: 'Export', href: '/export', icon: Download, shortcut: 'g e' },
]

export function Navigation() {
  const pathname = usePathname()
  const { currency } = useCurrency()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Tooltip content="Personal Finance Tracker - Your privacy-first financial companion">
              <Link href="/" className="text-xl font-bold flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <span className="hidden sm:inline">Finance Tracker</span>
              </Link>
            </Tooltip>
            
            {/* Currency Indicator */}
            <Tooltip content={`Current currency: ${CURRENCIES[currency].name}. Click Settings to change.`}>
              <Badge variant="outline" className="hidden sm:flex">
                {CURRENCIES[currency].symbol} {currency}
              </Badge>
            </Tooltip>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.name} content={`${item.name} (${item.shortcut})`}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </Tooltip>
              )
            })}
            
            <div className="flex items-center space-x-2 ml-6 pl-6 border-l">
              <ThemeToggle />
              <Tooltip content="View keyboard shortcuts (press ?)">
                <Button variant="ghost" size="sm" onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: '?' })
                  window.dispatchEvent(event)
                }}>
                  <Keyboard className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Shortcuts</span>
                </Button>
              </Tooltip>
              <Tooltip content="Settings (g s)">
                <Link href="/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Settings</span>
                  </Button>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}