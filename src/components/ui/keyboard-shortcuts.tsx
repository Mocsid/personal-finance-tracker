'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Badge } from './badge'
import { Keyboard } from 'lucide-react'

const shortcuts = [
  { key: 'g d', description: 'Go to Dashboard', path: '/' },
  { key: 'g b', description: 'Go to Bills', path: '/bills' },
  { key: 'g i', description: 'Go to Income', path: '/income' },
  { key: 'g a', description: 'Go to Analytics', path: '/analytics' },
  { key: 'g e', description: 'Go to Export', path: '/export' },
  { key: 'g s', description: 'Go to Settings', path: '/settings' },
  { key: '?', description: 'Show keyboard shortcuts', path: null },
  { key: 'n b', description: 'New Bill (when on bills page)', path: null },
  { key: 'n i', description: 'New Income (when on income page)', path: null },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const [sequence, setSequence] = useState('')
  const router = useRouter()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return
      }

      // Handle single key shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Handle 'g' key sequences
      if (e.key === 'g' || sequence.startsWith('g')) {
        e.preventDefault()
        const newSequence = sequence + e.key
        setSequence(newSequence)

        // Check for complete shortcuts
        const shortcut = shortcuts.find(s => s.key === newSequence)
        if (shortcut && shortcut.path) {
          router.push(shortcut.path)
          setSequence('')
          return
        }

        // Reset sequence after 2 seconds
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          setSequence('')
        }, 2000)
      }

      // Handle 'n' key sequences (new item shortcuts)
      if (e.key === 'n' || sequence.startsWith('n')) {
        e.preventDefault()
        const newSequence = sequence + e.key
        setSequence(newSequence)

        // Trigger custom events for new item creation
        if (newSequence === 'nb') {
          window.dispatchEvent(new CustomEvent('newBill'))
          setSequence('')
        } else if (newSequence === 'ni') {
          window.dispatchEvent(new CustomEvent('newIncome'))
          setSequence('')
        }

        // Reset sequence after 2 seconds
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          setSequence('')
        }, 2000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [sequence, router])

  return (
    <>
      {/* Sequence indicator */}
      {sequence && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Badge variant="outline" className="bg-background">
            <Keyboard className="h-3 w-3 mr-1" />
            {sequence}
          </Badge>
        </div>
      )}

      {/* Shortcuts modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Keyboard className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{shortcut.description}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground pt-3 border-t">
              Press keys in sequence. For example, press 'g' then 'd' to go to Dashboard.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}