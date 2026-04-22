'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEventStore } from '@/lib/store';
import Header from '@/components/Header';
import AudienceBadge from '@/components/AudienceBadge';
import { format } from 'date-fns';
import {
  MapPin,
  Clock,
  User,
  Mail,
  Ticket,
  Wifi,
  Globe,
  Tag,
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { events, deleteEvent } = useEventStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2c3e2d' }}>
            Event not found
          </h2>
          <Link href="/" className="text-sm" style={{ color: '#4a7c59' }}>
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  const dateObj = new Date(event.date);

  const handleDelete = () => {
    deleteEvent(event.id);
    router.push('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Header />

      {/* Hero banner */}
      <div
        className="relative h-48 sm:h-64"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : `linear-gradient(135deg, #2d5438, #4a7c59, #6fa882)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-6">
          <Link
            href="/"
            className="absolute top-4 left-4 sm:left-6 flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Events
          </Link>
          <AudienceBadge audience={event.audience} size="md" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{event.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
              <h2 className="text-base font-semibold mb-3" style={{ color: '#2c3e2d' }}>
                About this Event
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5a6b5b' }}>
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4" style={{ color: '#4a7c59' }} />
                  <h2 className="text-base font-semibold" style={{ color: '#2c3e2d' }}>
                    Tags
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#e8f0e9', color: '#4a7c59' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/events/create?edit=${event.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#e8f0e9', color: '#4a7c59' }}
              >
                <Pencil className="w-4 h-4" />
                Edit Event
              </Link>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#c0392b' }}>
                    Are you sure?
                  </span>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: '#c0392b' }}
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: '#f0f0f0', color: '#555' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4" style={{ border: '1px solid #ede9e1' }}>
              {/* Date */}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e8f0e9' }}
                >
                  <Clock className="w-4 h-4" style={{ color: '#4a7c59' }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#5a6b5b' }}>
                    Date & Time
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                    {format(dateObj, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-sm" style={{ color: '#5a6b5b' }}>
                    {event.time}
                    {event.endTime && ` – ${event.endTime}`}
                  </div>
                  {event.endDate && (
                    <div className="text-xs mt-0.5" style={{ color: '#5a6b5b' }}>
                      Until {format(new Date(event.endDate), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ede9e1' }} />

              {/* Location */}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e8f0e9' }}
                >
                  {event.isOnline ? (
                    <Wifi className="w-4 h-4" style={{ color: '#4a7c59' }} />
                  ) : (
                    <MapPin className="w-4 h-4" style={{ color: '#4a7c59' }} />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#5a6b5b' }}>
                    {event.isOnline ? 'Online Event' : 'Location'}
                  </div>
                  {event.isOnline ? (
                    <div className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                      {event.location}
                    </div>
                  ) : (
                    <>
                      <div className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                        {event.location}
                      </div>
                      <div className="text-sm" style={{ color: '#5a6b5b' }}>
                        {event.city}, {event.country}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ede9e1' }} />

              {/* Organizer */}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e8f0e9' }}
                >
                  <User className="w-4 h-4" style={{ color: '#4a7c59' }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#5a6b5b' }}>
                    Organizer
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                    {event.organizer.name}
                  </div>
                  {event.organizer.role && (
                    <div className="text-xs" style={{ color: '#5a6b5b' }}>
                      {event.organizer.role}
                    </div>
                  )}
                  <a
                    href={`mailto:${event.organizer.email}`}
                    className="flex items-center gap-1 text-xs mt-1 hover:underline"
                    style={{ color: '#4a7c59' }}
                  >
                    <Mail className="w-3 h-3" />
                    {event.organizer.email}
                  </a>
                </div>
              </div>

              {/* Price */}
              {(event.isFree || event.price) && (
                <>
                  <div style={{ borderTop: '1px solid #ede9e1' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#5a6b5b' }}>Price</span>
                    <span className="text-sm font-bold" style={{ color: '#4a7c59' }}>
                      {event.isFree ? 'FREE' : event.price}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Ticket CTA */}
            {event.ticketUrl && event.status !== 'past' && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: '#4a7c59' }}
              >
                <Ticket className="w-5 h-5" />
                Get Tickets
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            )}

            {/* Audience */}
            <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#5a6b5b' }}>
                This event is for
              </div>
              <AudienceBadge audience={event.audience} size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
