'use client';

import Header from '@/components/Header';
import CalendarView from '@/components/CalendarView';
import FilterBar from '@/components/FilterBar';
import { useEventStore } from '@/lib/store';

export default function CalendarPage() {
  const { getFilteredEvents } = useEventStore();
  const events = getFilteredEvents();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Header />

      <div
        className="relative overflow-hidden py-8"
        style={{ background: 'linear-gradient(135deg, #2d5438 0%, #4a7c59 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-1">Calendar View</h1>
          <p className="text-white/70">Browse all events by month</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <FilterBar />
        <CalendarView events={events} />
      </div>
    </div>
  );
}
