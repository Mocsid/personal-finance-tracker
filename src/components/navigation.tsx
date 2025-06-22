'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DollarSign, Receipt, Home, TrendingUp, Download, Settings } from 'lucide-react'
import { Button } from './ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Bills', href: '/bills', icon: Receipt },
  { name: 'Income', href: '/income', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Export', href: '/export', icon: Download },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span className="hidden sm:inline">Finance Tracker</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
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
              )
            })}
            
            <div className="hidden sm:flex items-center space-x-2 ml-6 pl-6 border-l">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}