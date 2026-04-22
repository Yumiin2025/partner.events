'use client';

import { useEventStore } from '@/lib/store';
import EventCard from './EventCard';
import FilterBar from './FilterBar';
import { CalendarX } from 'lucide-react';
import Link from 'next/link';

export default function EventsClient() {
  const { filters, getFilteredEvents } = useEventStore();
  const events = getFilteredEvents();

  const upcoming = events.filter((e) => e.status !== 'past');
  const past = events.filter((e) => e.status === 'past');

  return (
    <div className="space-y-6">
      <FilterBar />

      {events.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl"
          style={{ border: '1px solid #ede9e1' }}
        >
          <CalendarX className="w-12 h-12 mb-4" style={{ color: '#c8d8cc' }} />
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#2c3e2d' }}>
            No events found
          </h3>
          <p className="text-sm mb-6" style={{ color: '#5a6b5b' }}>
            Try adjusting your filters or be the first to add an event!
          </p>
          <Link
            href="/events/create"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: '#4a7c59' }}
          >
            Add Event
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#5a6b5b' }}>
                Upcoming · {upcoming.length}
              </h2>
              {filters.view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcoming.map((event, i) => (
                    <div key={event.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <EventCard event={event} view="grid" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((event, i) => (
                    <div key={event.id} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                      <EventCard event={event} view="list" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {past.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#9aada0' }}>
                Past Events · {past.length}
              </h2>
              {filters.view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} view="list" />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
