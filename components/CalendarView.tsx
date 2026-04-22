'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import Link from 'next/link';
import AudienceBadge from './AudienceBadge';

interface Props {
  events: Event[];
}

const AUDIENCE_COLORS: Record<string, string> = {
  customers: '#2e7d32',
  partners: '#1565c0',
  team: '#e65100',
  all: '#6a1b9a',
};

export default function CalendarView({ events }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const weeks: Date[][] = [];
  let day = startDate;
  while (day <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), date));

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar */}
      <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #ede9e1' }}>
        {/* Month nav */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #ede9e1' }}>
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#4a7c59' }} />
          </button>
          <h2 className="text-lg font-bold" style={{ color: '#2c3e2d' }}>
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" style={{ color: '#4a7c59' }} />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #ede9e1' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold py-2"
              style={{ color: '#5a6b5b' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {weeks.flat().map((date, i) => {
            const dayEvents = getEventsForDay(date);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isSelected = selectedDay && isSameDay(date, selectedDay);
            const isTodayDate = isToday(date);

            return (
              <button
                key={i}
                onClick={() => setSelectedDay(isSelected ? null : date)}
                className="min-h-[80px] p-1.5 text-left transition-all hover:bg-gray-50 relative"
                style={{
                  border: '1px solid #f0ece4',
                  backgroundColor: isSelected ? '#e8f0e9' : undefined,
                }}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1 ${
                    !isCurrentMonth ? 'opacity-30' : ''
                  }`}
                  style={
                    isTodayDate
                      ? { backgroundColor: '#4a7c59', color: '#fff' }
                      : { color: '#2c3e2d' }
                  }
                >
                  {format(date, 'd')}
                </span>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-[10px] leading-tight font-medium px-1 py-0.5 rounded truncate"
                      style={{
                        backgroundColor: AUDIENCE_COLORS[event.audience] + '22',
                        color: AUDIENCE_COLORS[event.audience],
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] font-medium" style={{ color: '#5a6b5b' }}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <div className="lg:w-80">
        {selectedDay ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h3 className="font-bold text-base mb-4" style={{ color: '#2c3e2d' }}>
              {format(selectedDay, 'EEEE, MMMM d')}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-sm" style={{ color: '#5a6b5b' }}>No events on this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block p-3 rounded-xl transition-all hover:shadow-md"
                    style={{ border: '1px solid #ede9e1', backgroundColor: '#fafaf8' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold" style={{ color: '#2c3e2d' }}>
                        {event.title}
                      </h4>
                      <AudienceBadge audience={event.audience} />
                    </div>
                    <div className="text-xs space-y-1" style={{ color: '#5a6b5b' }}>
                      <div>{event.time}{event.endTime && ` – ${event.endTime}`}</div>
                      <div>{event.isOnline ? 'Online' : `${event.city}, ${event.country}`}</div>
                      <div>{event.organizer.name}</div>
                    </div>
                    {event.ticketUrl && (
                      <div
                        className="mt-2 text-xs font-semibold"
                        style={{ color: '#4a7c59' }}
                      >
                        → Get Tickets
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm"
            style={{ border: '1px solid #ede9e1', minHeight: '200px' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: '#e8f0e9' }}
            >
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
              Select a day
            </p>
            <p className="text-xs mt-1" style={{ color: '#5a6b5b' }}>
              Click on any date to see events
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#5a6b5b' }}>
            LEGEND
          </p>
          <div className="space-y-2">
            {Object.entries(AUDIENCE_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs capitalize" style={{ color: '#2c3e2d' }}>
                  {key === 'all' ? 'All Welcome' : key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
