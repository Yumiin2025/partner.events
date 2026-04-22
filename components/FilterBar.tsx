'use client';

import { Search, LayoutGrid, List, X, SlidersHorizontal } from 'lucide-react';
import { useEventStore } from '@/lib/store';
import { Audience } from '@/lib/types';
import { useState } from 'react';

const AUDIENCE_OPTS: { value: Audience | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'customers', label: 'Customers' },
  { value: 'partners', label: 'Partners' },
  { value: 'team', label: 'Team' },
];

const COUNTRIES = ['Austria', 'Germany', 'Switzerland', 'International'];

export default function FilterBar() {
  const { filters, setFilters, resetFilters } = useEventStore();
  const [showMore, setShowMore] = useState(false);

  const hasActive =
    filters.audience !== 'all' || filters.search || filters.country || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-3">
      {/* Row 1: search + view + more */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            placeholder="Search events, cities, organizers…"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none bg-white transition-shadow"
            style={{
              border: '1px solid var(--border-md)',
              color: 'var(--text)',
              boxShadow: '0 1px 2px rgba(0,0,0,.04)',
            }}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} />
            </button>
          )}
        </div>

        {/* View toggle */}
        <div
          className="flex rounded-xl p-1 bg-white"
          style={{ border: '1px solid var(--border-md)' }}
        >
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilters({ view: v })}
              className="p-1.5 rounded-lg transition-all"
              style={filters.view === v
                ? { background: 'var(--green-700)', color: '#fff' }
                : { color: 'var(--text-3)' }
              }
              title={v === 'grid' ? 'Grid view' : 'List view'}
            >
              {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* More filters */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all bg-white"
          style={{
            border: `1px solid ${showMore ? 'var(--green-600)' : 'var(--border-md)'}`,
            color: showMore ? 'var(--green-700)' : 'var(--text-2)',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Clear */}
        {hasActive && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Row 2: audience pills */}
      <div className="flex flex-wrap gap-2">
        {AUDIENCE_OPTS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilters({ audience: value })}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={filters.audience === value
              ? { background: 'var(--green-700)', color: '#fff' }
              : { background: '#fff', color: 'var(--text-2)', border: '1px solid var(--border-md)' }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showMore && (
        <div
          className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white scale-in"
          style={{ border: '1px solid var(--border-md)' }}
        >
          <div className="flex-1">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-3)' }}>
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ country: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
            >
              <option value="">All countries</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-3)' }}>From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-3)' }}>To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
