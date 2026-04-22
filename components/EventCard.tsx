'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Clock, Ticket, Wifi, User } from 'lucide-react';
import { Event } from '@/lib/types';
import AudienceBadge from './AudienceBadge';

interface Props {
  event: Event;
  view?: 'grid' | 'list';
}

const PLACEHOLDER_COLORS = [
  '#4a7c59', '#2d5438', '#6fa882', '#3d6b4a', '#5a8f6a',
];

function getPlaceholderColor(id: string) {
  const index = id.charCodeAt(0) % PLACEHOLDER_COLORS.length;
  return PLACEHOLDER_COLORS[index];
}

export default function EventCard({ event, view = 'grid' }: Props) {
  const dateObj = new Date(event.date);
  const formattedDate = format(dateObj, 'EEE, MMM d, yyyy');
  const isPast = event.status === 'past';
  const accentColor = getPlaceholderColor(event.id);

  if (view === 'list') {
    return (
      <Link href={`/events/${event.id}`} className="block group">
        <div
          className={`flex gap-4 bg-white rounded-xl p-4 border transition-all hover:shadow-md ${
            isPast ? 'opacity-60' : ''
          }`}
          style={{ borderColor: '#ede9e1' }}
        >
          {/* Date block */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white"
            style={{ backgroundColor: accentColor }}
          >
            <span className="text-xs font-medium uppercase">
              {format(dateObj, 'MMM')}
            </span>
            <span className="text-xl font-bold leading-tight">
              {format(dateObj, 'd')}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3
                  className="font-semibold text-base truncate group-hover:underline"
                  style={{ color: '#2c3e2d' }}
                >
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm" style={{ color: '#5a6b5b' }}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.isOnline ? 'Online' : `${event.city}, ${event.country}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                    {event.endTime && ` – ${event.endTime}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {event.organizer.name}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <AudienceBadge audience={event.audience} />
              </div>
            </div>
          </div>

          {/* Ticket */}
          {event.ticketUrl && !isPast && (
            <div className="flex-shrink-0 flex items-center">
              <span
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#e8f0e9', color: '#4a7c59' }}
              >
                <Ticket className="w-3.5 h-3.5" />
                {event.isFree ? 'Free' : event.price}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`} className="block group h-full">
      <div
        className={`bg-white rounded-2xl overflow-hidden border h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 ${
          isPast ? 'opacity-60' : ''
        }`}
        style={{ borderColor: '#ede9e1' }}
      >
        {/* Image / color banner */}
        <div
          className="h-32 flex items-end p-4 relative"
          style={{
            backgroundImage: event.imageUrl
              ? `url(${event.imageUrl})`
              : `linear-gradient(135deg, ${accentColor}dd, ${accentColor}99)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Date pill */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 text-center shadow-sm">
            <div className="text-xs font-semibold uppercase" style={{ color: '#4a7c59' }}>
              {format(dateObj, 'MMM')}
            </div>
            <div className="text-lg font-bold leading-tight" style={{ color: '#2c3e2d' }}>
              {format(dateObj, 'd')}
            </div>
          </div>

          {/* Status */}
          {event.status === 'ongoing' && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          )}
          {isPast && (
            <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              Past
            </span>
          )}

          {/* Online badge */}
          {event.isOnline && (
            <span
              className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <Wifi className="w-3 h-3" />
              Online
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <AudienceBadge audience={event.audience} />
            {event.isFree ? (
              <span className="text-xs font-semibold" style={{ color: '#4a7c59' }}>FREE</span>
            ) : event.price ? (
              <span className="text-xs font-semibold" style={{ color: '#4a7c59' }}>{event.price}</span>
            ) : null}
          </div>

          <h3
            className="font-semibold text-base mb-1 group-hover:underline line-clamp-2"
            style={{ color: '#2c3e2d' }}
          >
            {event.title}
          </h3>

          <p className="text-sm line-clamp-2 mb-3" style={{ color: '#5a6b5b' }}>
            {event.description}
          </p>

          <div className="mt-auto space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#5a6b5b' }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a7c59' }} />
              <span className="truncate">
                {event.isOnline ? 'Online Event' : `${event.city}, ${event.country}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#5a6b5b' }}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a7c59' }} />
              <span>
                {formattedDate} · {event.time}
                {event.endTime && ` – ${event.endTime}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#5a6b5b' }}>
              <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a7c59' }} />
              <span className="truncate">{event.organizer.name}</span>
            </div>
          </div>

          {event.ticketUrl && !isPast && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #ede9e1' }}>
              <span
                className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg w-full"
                style={{ backgroundColor: '#e8f0e9', color: '#4a7c59' }}
              >
                <Ticket className="w-3.5 h-3.5" />
                Get Tickets
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
