'use client';

import { Search, LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';
import { useEventStore } from '@/lib/store';
import { Audience } from '@/lib/types';
import { useState } from 'react';

const AUDIENCES: { value: Audience | 'all'; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'customers', label: 'Customers' },
  { value: 'partners', label: 'Partners' },
  { value: 'team', label: 'Team' },
];

const COUNTRIES = ['Austria', 'Germany', 'Switzerland', 'International'];

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useEventStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.audience !== 'all' ||
    filters.search !== '' ||
    filters.country !== '' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
      {/* Top row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#5a6b5b' }}
          />
          <input
            type="text"
            placeholder="Search events, cities, organizers…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
            style={{
              backgroundColor: '#f7f5f0',
              border: '1px solid #ede9e1',
              color: '#2c3e2d',
            }}
          />
        </div>

        {/* View toggle */}
        <div
          className="flex rounded-lg p-0.5"
          style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1' }}
        >
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilters({ view: v })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={
                filters.view === v
                  ? { backgroundColor: '#4a7c59', color: '#fff' }
                  : { color: '#5a6b5b' }
              }
            >
              {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              <span className="hidden md:inline capitalize">{v}</span>
            </button>
          ))}
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={
            showAdvanced
              ? { backgroundColor: '#4a7c59', color: '#fff' }
              : { backgroundColor: '#f7f5f0', color: '#5a6b5b', border: '1px solid #ede9e1' }
          }
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ color: '#4a7c59', backgroundColor: '#e8f0e9' }}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Audience pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {AUDIENCES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilters({ audience: value as Audience | 'all' })}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={
              filters.audience === value
                ? { backgroundColor: '#4a7c59', color: '#fff' }
                : { backgroundColor: '#f7f5f0', color: '#5a6b5b', border: '1px solid #ede9e1' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3" style={{ borderTop: '1px solid #ede9e1' }}>
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block" style={{ color: '#5a6b5b' }}>
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ country: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1', color: '#2c3e2d' }}
            >
              <option value="">All countries</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block" style={{ color: '#5a6b5b' }}>
              From date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1', color: '#2c3e2d' }}
            />
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block" style={{ color: '#5a6b5b' }}>
              To date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1', color: '#2c3e2d' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
