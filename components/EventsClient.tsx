'use client';

import { useEventStore } from '@/lib/store';
import EventCard from './EventCard';
import FilterBar from './FilterBar';
import { CalendarX } from 'lucide-react';
import Link from 'next/link';

export default function EventsClient() {
  const { filters, getFilteredEvents } = useEventStore();
  const all      = getFilteredEvents();
  const upcoming = all.filter((e) => e.status !== 'past');
  const past     = all.filter((e) => e.status === 'past');

  return (
    <div className="space-y-8">
      <FilterBar />

      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl card-shadow">
          <CalendarX className="w-10 h-10 mb-4" style={{ color: 'var(--text-3)' }} />
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
            No events found
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
            Try different filters or add the first event!
          </p>
          <Link
            href="/events/create"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--green-700)' }}
          >
            Add Event
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-3)' }}>
                Upcoming — {upcoming.length}
              </p>
              {filters.view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcoming.map((e, i) => (
                    <div key={e.id} className="fade-up h-full" style={{ animationDelay: `${i * 40}ms` }}>
                      <EventCard event={e} view="grid" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((e, i) => (
                    <div key={e.id} className="fade-up" style={{ animationDelay: `${i * 25}ms` }}>
                      <EventCard event={e} view="list" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {past.length > 0 && (
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-3)' }}>
                Past Events — {past.length}
              </p>
              {filters.view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {past.map((e) => <EventCard key={e.id} event={e} view="grid" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {past.map((e) => <EventCard key={e.id} event={e} view="list" />)}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
