'use client'

import { useState } from 'react'
import { Input } from './input'
import { Select } from './select'
import { Button } from './button'
import { Search, Filter, X } from 'lucide-react'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: Record<string, string>) => void
  categories?: string[]
  placeholder?: string
  showCategoryFilter?: boolean
  showStatusFilter?: boolean
}

export function SearchFilter({ 
  onSearch, 
  onFilter, 
  categories = [], 
  placeholder = "Search...",
  showCategoryFilter = true,
  showStatusFilter = false
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilterChange = (key: string, value: string) => {
    const filters: Record<string, string> = {}
    
    if (key === 'category') {
      setSelectedCategory(value)
      filters.category = value
    } else if (key === 'status') {
      setSelectedStatus(value)
      filters.status = value
    }
    
    // Include all current filters
    if (selectedCategory && key !== 'category') filters.category = selectedCategory
    if (selectedStatus && key !== 'status') filters.status = selectedStatus
    if (value) filters[key] = value
    
    onFilter(filters)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedStatus('')
    onSearch('')
    onFilter({})
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedStatus

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            role="searchbox"
            aria-label="Search income entries"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-accent' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
          {showCategoryFilter && categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-40"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          )}
          
          {showStatusFilter && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={selectedStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-32"
              >
                <option value="">All Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="PARTIAL">Partial</option>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
