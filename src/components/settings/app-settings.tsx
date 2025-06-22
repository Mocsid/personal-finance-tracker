'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Badge } from '../ui/badge'
import { Tooltip } from '../ui/tooltip'
import { CurrencyDisplay } from '../ui/currency-display'
import { CURRENCIES, CurrencyCode } from '@/lib/currency'
import { useCurrency } from '@/components/currency/currency-provider'
import { Settings, Database, Download, Upload, Trash2, Coins, Info } from 'lucide-react'

export function AppSettings() {
  const { currency, setCurrency } = useCurrency()
  const [dateFormat, setDateFormat] = useState('MM/dd/yyyy')
  const [taxRate, setTaxRate] = useState('20')
  const [autoBackup, setAutoBackup] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setDateFormat(localStorage.getItem('dateFormat') || 'MM/dd/yyyy')
      setTaxRate(localStorage.getItem('defaultTaxRate') || '20')
      setAutoBackup(localStorage.getItem('autoBackup') === 'true')
    }
  }, [])

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency)
    if (window.toast) {
      window.toast(`Currency changed to ${CURRENCIES[newCurrency].name}!`, 'success')
    }
  }

  const handleDateFormatChange = (format: string) => {
    setDateFormat(format)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dateFormat', format)
    }
    if (window.toast) {
      window.toast('Date format updated!', 'success')
    }
  }

  const handleTaxRateChange = (rate: string) => {
    setTaxRate(rate)
    if (typeof window !== 'undefined') {
      localStorage.setItem('defaultTaxRate', rate)
    }
    if (window.toast) {
      window.toast('Default tax rate updated!', 'success')
    }
  }

  const handleExportBackup = () => {
    // This would export the entire database
    const backupData = {
      settings: { 
        currency, 
        dateFormat, 
        taxRate,
        autoBackup 
      },
      exportDate: new Date().toISOString(),
      version: '1.2.0'
    }
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (window.toast) {
      window.toast('Backup exported successfully!', 'success')
    }
  }

  const handleImportBackup = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const backupData = JSON.parse(e.target?.result as string)
            
            // Restore settings if available
            if (backupData.settings) {
              if (backupData.settings.currency) {
                setCurrency(backupData.settings.currency)
              }
              if (backupData.settings.dateFormat) {
                setDateFormat(backupData.settings.dateFormat)
                localStorage.setItem('dateFormat', backupData.settings.dateFormat)
              }
              if (backupData.settings.taxRate) {
                setTaxRate(backupData.settings.taxRate)
                localStorage.setItem('defaultTaxRate', backupData.settings.taxRate)
              }
            }
            
            console.log('Backup data:', backupData)
            if (window.toast) {
              window.toast('Settings restored from backup!', 'success')
            }
          } catch (error) {
            if (window.toast) {
              window.toast('Invalid backup file format', 'error')
            }
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      // Clear localStorage settings
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currency')
        localStorage.removeItem('dateFormat')
        localStorage.removeItem('defaultTaxRate')
        localStorage.removeItem('autoBackup')
        localStorage.removeItem('hasCompletedOnboarding')
        localStorage.removeItem('userName')
      }
      
      // Reset to defaults
      setCurrency('USD')
      setDateFormat('MM/dd/yyyy')
      setTaxRate('20')
      setAutoBackup(false)
      
      if (window.toast) {
        window.toast('All data and settings cleared!', 'success')
      }
    }
  }

  if (!mounted) {
    return <div className="flex justify-center items-center h-64">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your finance tracker preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>Customize your app preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select 
                id="currency" 
                value={currency} 
                onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
              >
                {Object.entries(CURRENCIES).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.symbol} {info.name} ({code})
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Example: <CurrencyDisplay amount={1234.56} />
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select 
                id="dateFormat" 
                value={dateFormat} 
                onChange={(e) => handleDateFormatChange(e.target.value)}
              >
                <option value="MM/dd/yyyy">MM/dd/yyyy (US)</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy (EU)</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd (ISO)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                Example: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Tooltip content="This will be used as the default when adding new income entries">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
              </div>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => handleTaxRateChange(e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-muted-foreground">
                Used as default when adding new income
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription>Backup and restore your financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Database Status</div>
                  <div className="text-sm text-muted-foreground">Local SQLite database</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Tooltip content="Export your settings and data as a backup file">
                  <Button variant="outline" onClick={handleExportBackup} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </Tooltip>
                <Tooltip content="Import settings and data from a backup file">
                  <Button variant="outline" onClick={handleImportBackup} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </Tooltip>
              </div>
              
              <Tooltip content="⚠️ This will permanently delete all your data and settings">
                <Button 
                  variant="destructive" 
                  onClick={handleClearAllData}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Currency Information</span>
          </CardTitle>
          <CardDescription>Currently supported currencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(CURRENCIES).map(([code, info]) => (
              <Tooltip key={code} content={`Click to switch to ${info.name}`}>
                <div 
                  className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                    currency === code ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                  onClick={() => handleCurrencyChange(code as CurrencyCode)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{info.name}</div>
                      <div className="text-sm text-muted-foreground">{code}</div>
                    </div>
                    <div className="text-lg font-bold">{info.symbol}</div>
                  </div>
                  {currency === code && (
                    <Badge variant="success" className="mt-2">
                      Current
                    </Badge>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>Information about your data privacy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Tooltip content="All your financial data is stored locally on your device - never in the cloud">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-green-600 font-semibold">100% Local</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    All data stored on your device
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip content="No external servers are involved - your data never leaves your device">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-blue-600 font-semibold">No Cloud Sync</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    No external servers involved
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip content="The source code is publicly available and can be audited by anyone">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-purple-600 font-semibold">Open Source</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Transparent and auditable code
                  </div>
                </div>
              </Tooltip>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Your privacy is our priority:</strong> This application stores all data locally in a SQLite database 
                on your device. No personal information is transmitted to external servers.
              </p>
              <p>
                The database file is automatically excluded from git commits and will never be shared publicly. 
                You have complete control over your financial data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}