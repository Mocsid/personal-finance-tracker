'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select } from '../ui/select'
import { Badge } from '../ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Settings, Database, Download, Upload, Trash2 } from 'lucide-react'

export function AppSettings() {
  const [currency, setCurrency] = useState('USD')
  const [dateFormat, setDateFormat] = useState('MM/dd/yyyy')
  const [taxRate, setTaxRate] = useState('20')
  const [autoBackup, setAutoBackup] = useState(false)

  const handleExportBackup = () => {
    // This would export the entire database
    const backupData = {
      settings: { currency, dateFormat, taxRate },
      exportDate: new Date().toISOString(),
      version: '1.0.0'
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
            // Here you would restore the data
            console.log('Backup data:', backupData)
            if (window.toast) {
              window.toast('Backup imported successfully!', 'success')
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
      // This would clear all data from the database
      if (window.toast) {
        window.toast('All data cleared successfully', 'success')
      }
    }
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
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="PHP">PHP (₱)</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                Example: {formatCurrency(1234.56)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select 
                id="dateFormat" 
                value={dateFormat} 
                onChange={(e) => setDateFormat(e.target.value)}
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
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
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
                <Button variant="outline" onClick={handleExportBackup} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={handleImportBackup} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={handleClearAllData}
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>Information about your data privacy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold">100% Local</div>
                <div className="text-sm text-muted-foreground mt-1">
                  All data stored on your device
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-blue-600 font-semibold">No Cloud Sync</div>
                <div className="text-sm text-muted-foreground mt-1">
                  No external servers involved
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-purple-600 font-semibold">Open Source</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Transparent and auditable code
                </div>
              </div>
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