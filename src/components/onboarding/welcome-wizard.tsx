'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Select } from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { CURRENCIES, CurrencyCode } from '@/lib/currency'
import { useCurrency } from '../currency/currency-provider'
import { Coins, Calculator, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

interface WelcomeWizardProps {
  onComplete: () => void
}

export function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [step, setStep] = useState(1)
  const [settings, setSettings] = useState({
    currency: 'USD' as CurrencyCode,
    defaultTaxRate: '20',
    userName: '',
  })
  const { setCurrency } = useCurrency()

  const handleComplete = () => {
    // Save settings
    setCurrency(settings.currency)
    localStorage.setItem('defaultTaxRate', settings.defaultTaxRate)
    localStorage.setItem('userName', settings.userName)
    localStorage.setItem('hasCompletedOnboarding', 'true')
    
    if (window.toast) {
      window.toast('Welcome to your Finance Tracker! 🎉', 'success', 4000)
    }
    
    onComplete()
  }

  const steps = [
    {
      title: 'Welcome to Finance Tracker! 🎉',
      description: 'Your privacy-first financial companion',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold mb-2">Take Control of Your Finances</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Track your income and bills with complete privacy. All your data stays on your device - no cloud, no sharing, no tracking.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800 dark:text-green-400">100% Private</div>
              <div className="text-sm text-green-600 dark:text-green-500">Local storage only</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800 dark:text-blue-400">Smart Tracking</div>
              <div className="text-sm text-blue-600 dark:text-blue-500">Automated calculations</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800 dark:text-purple-400">Modern Design</div>
              <div className="text-sm text-purple-600 dark:text-purple-500">Beautiful interface</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Customize Your Experience',
      description: 'Set up your preferences',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">What should we call you? (Optional)</Label>
              <Input
                id="userName"
                value={settings.userName}
                onChange={(e) => setSettings(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Your name or nickname"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Your Primary Currency</Label>
              <Select 
                id="currency" 
                value={settings.currency} 
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value as CurrencyCode }))}
              >
                {Object.entries(CURRENCIES).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.symbol} {info.name} ({code})
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                You can change this anytime in settings
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.defaultTaxRate}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultTaxRate: e.target.value }))}
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">
                Used as default when adding income. Common rates: US ~22%, EU ~25%, UK ~20%
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'You\'re All Set! 🚀',
      description: 'Ready to start tracking your finances',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {settings.userName ? `Welcome, ${settings.userName}!` : 'Welcome!'}
            </h2>
            <p className="text-muted-foreground">
              Your finance tracker is ready. Here's what you can do next:
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-medium">Add Your First Bill</div>
                <div className="text-sm text-muted-foreground">Start by adding a recurring bill like rent or utilities</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div className="font-medium">Record Your Income</div>
                <div className="text-sm text-muted-foreground">Add your salary or other income sources with tax calculations</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div className="font-medium">Explore Analytics</div>
                <div className="text-sm text-muted-foreground">View insights and trends in your financial data</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div className="font-semibold text-blue-800 dark:text-blue-400">Privacy Reminder</div>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              All your financial data is stored locally on your device. We never see or store your personal information.
            </div>
          </div>
        </div>
      )
    }
  ]

  const currentStep = steps[step - 1]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </div>
            <Badge variant="outline">
              {step} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep.content}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < steps.length ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Start Tracking!
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}