'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MapPin, Clock, ArrowUpRight, Wifi } from 'lucide-react';
import { Event } from '@/lib/types';
import AudienceBadge from './AudienceBadge';

const ACCENT = ['#4A7B72','#2A4A44','#5E9186','#7AAF9F','#345C55'];
const accent = (id: string) => ACCENT[id.charCodeAt(0) % ACCENT.length];

export default function EventCard({ event, view = 'grid' }: { event: Event; view?: 'grid' | 'list' }) {
  const d = new Date(event.date);
  const isPast = event.status === 'past';
  const color = accent(event.id);

  /* ── LISTE ── */
  if (view === 'list') {
    return (
      <Link href={`/events/${event.id}`} className="block group">
        <div
          className="card-shadow card-shadow-hover flex items-center gap-4 bg-white rounded-2xl px-5 py-4 transition-all"
          style={{ opacity: isPast ? 0.55 : 1 }}
        >
          {/* Datum-Block */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white" style={{ background: color }}>
            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
              {format(d, 'MMM', { locale: de })}
            </span>
            <span className="text-lg font-bold leading-none">{format(d, 'd')}</span>
          </div>

          {/* Inhalt */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <AudienceBadge audience={event.audience} />
              {event.status === 'ongoing' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 animate-pulse">LIVE</span>
              )}
            </div>
            <h3 className="font-semibold text-sm truncate group-hover:underline transition-colors" style={{ color: 'var(--text)' }}>
              {event.title}
            </h3>
            <div className="flex items-center gap-3 mt-1" style={{ color: 'var(--text-3)', fontSize: '12px' }}>
              <span className="flex items-center gap-1">
                {event.isOnline ? <Wifi className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {event.isOnline ? 'Online' : `${event.city}, ${event.country}`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time}{event.endTime ? ` – ${event.endTime}` : ''} Uhr
              </span>
              <span className="hidden sm:inline truncate">{event.organizer.name}</span>
            </div>
          </div>

          {/* Rechts */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {event.isFree
              ? <span className="text-xs font-semibold" style={{ color: 'var(--green-600)' }}>Kostenlos</span>
              : event.price
              ? <span className="text-xs font-semibold" style={{ color: 'var(--green-600)' }}>{event.price}</span>
              : null
            }
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--green-600)' }} />
          </div>
        </div>
      </Link>
    );
  }

  /* ── RASTER ── */
  return (
    <Link href={`/events/${event.id}`} className="block group h-full">
      <div
        className="card-shadow card-shadow-hover bg-white rounded-2xl overflow-hidden h-full flex flex-col transition-all"
        style={{ opacity: isPast ? 0.55 : 1 }}
      >
        {/* Farbstreifen oben */}
        <div className="h-2 w-full" style={{ background: color }} />

        <div className="p-5 flex flex-col flex-1">
          {/* Datum + Badges */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="text-center rounded-xl px-2.5 py-1.5" style={{ background: color + '14' }}>
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                  {format(d, 'MMM', { locale: de })}
                </div>
                <div className="text-lg font-bold leading-none" style={{ color }}>
                  {format(d, 'd')}
                </div>
              </div>
              {event.status === 'ongoing' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 animate-pulse">LIVE</span>
              )}
              {isPast && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--text-3)' }}>
                  Vergangen
                </span>
              )}
            </div>
            <AudienceBadge audience={event.audience} />
          </div>

          {/* Titel */}
          <h3 className="font-semibold text-base mb-2 clamp-2 group-hover:underline transition-colors leading-snug" style={{ color: 'var(--text)' }}>
            {event.title}
          </h3>

          {/* Beschreibung */}
          <p className="text-sm clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {event.description}
          </p>

          {/* Meta */}
          <div className="mt-auto space-y-1.5" style={{ color: 'var(--text-3)', fontSize: '12px' }}>
            <div className="flex items-center gap-1.5">
              {event.isOnline ? <Wifi className="w-3.5 h-3.5 flex-shrink-0" /> : <MapPin className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className="truncate">{event.isOnline ? 'Online Event' : `${event.city}, ${event.country}`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{format(d, 'EEE d. MMM', { locale: de })} · {event.time}{event.endTime ? ` – ${event.endTime}` : ''} Uhr</span>
            </div>
          </div>

          {/* Footer */}
          {!isPast && (
            <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-xs font-semibold" style={{ color: 'var(--green-600)' }}>
                {event.isFree ? 'Kostenlos' : (event.price ?? '')}
              </span>
              {event.ticketUrl && (
                <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}>
                  Tickets <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
