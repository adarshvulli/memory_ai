
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { UserTrait, MemoryCategory } from '@/types/memory';

interface MemorySearchProps {
  traits: UserTrait[];
  categories: MemoryCategory[];
  onFilteredResults: (filtered: UserTrait[]) => void;
}

interface FilterState {
  searchTerm: string;
  category: string;
  confidence: string;
  source: string;
  priority: string;
}

const MemorySearch: React.FC<MemorySearchProps> = ({
  traits,
  categories,
  onFilteredResults
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: 'all',
    confidence: 'all',
    source: 'all',
    priority: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const applyFilters = () => {
    let filtered = traits;

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(trait =>
        trait.value.toString().toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        trait.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(trait => trait.category === filters.category);
    }

    // Confidence filter
    if (filters.confidence !== 'all') {
      const confidenceThreshold = parseFloat(filters.confidence);
      filtered = filtered.filter(trait => trait.confidence >= confidenceThreshold);
    }

    // Source filter
    if (filters.source !== 'all') {
      filtered = filtered.filter(trait => trait.source === filters.source);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(trait => trait.priority === filters.priority);
    }

    onFilteredResults(filtered);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      confidence: 'all',
      source: 'all',
      priority: 'all'
    });
    onFilteredResults(traits);
  };

  const hasActiveFilters = () => {
    return filters.searchTerm || 
           filters.category !== 'all' || 
           filters.confidence !== 'all' || 
           filters.source !== 'all' || 
           filters.priority !== 'all';
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, traits]);

  return (
    <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search memory traits..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
        {hasActiveFilters() && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Confidence</label>
            <Select
              value={filters.confidence}
              onValueChange={(value) => setFilters({ ...filters, confidence: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="0.9">High (90%+)</SelectItem>
                <SelectItem value="0.7">Medium (70%+)</SelectItem>
                <SelectItem value="0.5">Low (50%+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Source</label>
            <Select
              value={filters.source}
              onValueChange={(value) => setFilters({ ...filters, source: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="conversation">Conversation</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="imported">Imported</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Priority</label>
            <Select
              value={filters.priority}
              onValueChange={(value) => setFilters({ ...filters, priority: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-1">
          {filters.searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: {filters.searchTerm}
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Category: {filters.category}
            </Badge>
          )}
          {filters.confidence !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Confidence: {filters.confidence}%+
            </Badge>
          )}
          {filters.source !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Source: {filters.source}
            </Badge>
          )}
          {filters.priority !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Priority: {filters.priority}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MemorySearch;
