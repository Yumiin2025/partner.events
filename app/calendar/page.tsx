'use client';

import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import FilterBar from '@/components/FilterBar';
import { useEventStore } from '@/lib/store';

export default function KalenderPage() {
  const { getFilteredEvents } = useEventStore();
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />
      <div style={{ background: 'linear-gradient(135deg, var(--green-900), var(--green-700))' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--green-400)' }}>
            Kalender
          </p>
          <h1 className="text-3xl font-bold text-white">Event-Kalender</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Alle Events nach Monat durchsuchen
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-6">
        <FilterBar />
        <CalendarView events={getFilteredEvents()} />
      </div>
    </div>
  );
}
