'use client';

import { useState } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameMonth, isSameDay, addMonths, subMonths, isToday,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '@/lib/types';
import Link from 'next/link';
import AudienceBadge from './AudienceBadge';

const DOT: Record<string, string> = {
  customers: '#52A87B',
  partners:  '#3D7A5A',
  team:      '#D4891A',
  all:       '#8ECFC4',
};

export default function CalendarView({ events }: { events: Event[] }) {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const mStart = startOfMonth(month);
  const mEnd   = endOfMonth(mStart);
  const wStart = startOfWeek(mStart, { weekStartsOn: 1 });
  const wEnd   = endOfWeek(mEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = wStart;
  while (d <= wEnd) { days.push(d); d = addDays(d, 1); }

  const forDay = (date: Date) => events.filter((e) => isSameDay(new Date(e.date), date));
  const dayEvents = selected ? forDay(selected) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Calendar grid */}
      <div className="flex-1 bg-white rounded-2xl overflow-hidden card-shadow">
        {/* Month nav */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setMonth(subMonths(month, 1))} className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--green-700)' }} />
          </button>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            {format(month, 'MMMM yyyy', { locale: de })}
          </span>
          <button onClick={() => setMonth(addMonths(month, 1))} className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--green-700)' }} />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid var(--border)' }}>
          {['Mo','Di','Mi','Do','Fr','Sa','So'].map((n) => (
            <div key={n} className="text-center text-xs font-semibold py-2.5" style={{ color: 'var(--text-3)' }}>{n}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((date, i) => {
            const de_events = forDay(date);
            const inMonth = isSameMonth(date, month);
            const isSel   = selected && isSameDay(date, selected);
            const today   = isToday(date);
            return (
              <button
                key={i}
                onClick={() => setSelected(isSel ? null : date)}
                className="min-h-[76px] p-2 text-left transition-all hover:bg-gray-50"
                style={{ border: '1px solid var(--border)', background: isSel ? 'var(--green-50)' : undefined, opacity: !inMonth ? 0.3 : 1 }}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1.5"
                  style={today ? { background: 'var(--green-700)', color: '#fff' } : { color: 'var(--text)' }}>
                  {format(date, 'd')}
                </span>
                <div className="space-y-0.5">
                  {de_events.slice(0, 2).map((ev) => (
                    <div key={ev.id} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: DOT[ev.audience] }} />
                      <span className="text-[10px] truncate leading-tight" style={{ color: 'var(--text-2)' }}>{ev.title}</span>
                    </div>
                  ))}
                  {de_events.length > 2 && (
                    <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>+{de_events.length - 2}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-72 space-y-4">
        {selected ? (
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              {format(selected, 'EEEE, d. MMMM', { locale: de })}
            </p>
            {dayEvents.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Keine Events an diesem Tag.</p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map((ev) => (
                  <Link key={ev.id} href={`/events/${ev.id}`}
                    className="block p-3 rounded-xl hover:bg-gray-50 transition-all"
                    style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>{ev.title}</span>
                      <AudienceBadge audience={ev.audience} />
                    </div>
                    <div className="text-xs space-y-0.5" style={{ color: 'var(--text-3)' }}>
                      <div>{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''} Uhr</div>
                      <div>{ev.isOnline ? 'Online' : `${ev.city}, ${ev.country}`}</div>
                    </div>
                    {ev.ticketUrl && (
                      <div className="text-xs font-semibold mt-2" style={{ color: 'var(--green-600)' }}>
                        Tickets →
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 card-shadow flex flex-col items-center text-center" style={{ minHeight: '160px', justifyContent: 'center' }}>
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Tag auswählen</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Klicke auf ein Datum um Events zu sehen</p>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>Legende</p>
          <div className="space-y-2">
            {[
              { key: 'customers', label: 'Kunden' },
              { key: 'partners',  label: 'Partner' },
              { key: 'team',      label: 'Team' },
              { key: 'all',       label: 'Alle willkommen' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: DOT[key] }} />
                <span className="text-xs" style={{ color: 'var(--text-2)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
