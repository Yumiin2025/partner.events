'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEventStore } from '@/lib/store';
import Header from '@/components/Header';
import AudienceBadge from '@/components/AudienceBadge';
import { format } from 'date-fns';
import {
  MapPin, Clock, User, Mail, Ticket,
  Wifi, Tag, ArrowLeft, Pencil, Trash2, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ACCENT = ['#2D6A4F','#1B4332','#40916C','#52B788','#2D6A4F'];
const accent = (id: string) => ACCENT[id.charCodeAt(0) % ACCENT.length];

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--green-50)' }}>
        <Icon className="w-4 h-4" style={{ color: 'var(--green-700)' }} />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-3)' }}>{label}</div>
        <div className="text-sm" style={{ color: 'var(--text)' }}>{children}</div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { events, deleteEvent } = useEventStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Header />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <p className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Event not found</p>
          <Link href="/" className="text-sm font-medium" style={{ color: 'var(--green-600)' }}>← Back to events</Link>
        </div>
      </div>
    );
  }

  const color = accent(event.id);
  const d = new Date(event.date);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />

      {/* Hero band */}
      <div className="h-56 sm:h-64 relative" style={{
        backgroundImage: event.imageUrl
          ? `url(${event.imageUrl})`
          : `linear-gradient(135deg, var(--green-900), ${color})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-between py-5">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium transition-colors self-start"
            style={{ color: 'rgba(255,255,255,0.7)' }}>
            <ArrowLeft className="w-4 h-4" />
            All Events
          </Link>
          <div>
            <AudienceBadge audience={event.audience} size="md" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: description + tags + actions */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-6 card-shadow">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-3)' }}>
                About
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {event.description || 'No description provided.'}
              </p>
            </div>

            {event.tags.length > 0 && (
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4" style={{ color: 'var(--green-600)' }} />
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((t) => (
                    <span key={t} className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/events/create?edit=${event.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}>
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Link>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: '#DC2626' }}>Sure?</span>
                  <button onClick={() => { deleteEvent(event.id); router.push('/'); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
                    style={{ background: '#DC2626' }}>Yes</button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ background: 'var(--bg)', color: 'var(--text-2)' }}>Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Right: meta sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 card-shadow space-y-4">
              <Row icon={Clock} label="Date & Time">
                <span className="font-medium">{format(d, 'EEEE, MMMM d, yyyy')}</span>
                <br />
                <span style={{ color: 'var(--text-2)' }}>
                  {event.time}{event.endTime ? ` – ${event.endTime}` : ''}
                </span>
              </Row>

              <div style={{ borderTop: '1px solid var(--border)' }} />

              <Row icon={event.isOnline ? Wifi : MapPin} label={event.isOnline ? 'Online Event' : 'Location'}>
                <span className="font-medium">{event.location}</span>
                {!event.isOnline && (
                  <><br /><span style={{ color: 'var(--text-2)' }}>{event.city}, {event.country}</span></>
                )}
              </Row>

              <div style={{ borderTop: '1px solid var(--border)' }} />

              <Row icon={User} label="Organizer">
                <span className="font-medium">{event.organizer.name}</span>
                {event.organizer.role && (
                  <><br /><span style={{ color: 'var(--text-2)' }}>{event.organizer.role}</span></>
                )}
                <br />
                <a href={`mailto:${event.organizer.email}`}
                  className="flex items-center gap-1 text-xs mt-1 hover:underline"
                  style={{ color: 'var(--green-600)' }}>
                  <Mail className="w-3 h-3" />{event.organizer.email}
                </a>
              </Row>

              {(event.isFree || event.price) && (
                <>
                  <div style={{ borderTop: '1px solid var(--border)' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>Price</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--green-700)' }}>
                      {event.isFree ? 'FREE' : event.price}
                    </span>
                  </div>
                </>
              )}
            </div>

            {event.ticketUrl && event.status !== 'past' && (
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all card-shadow"
                style={{ background: 'var(--green-700)' }}>
                <Ticket className="w-4 h-4" />
                Get Tickets
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

            <div className="bg-white rounded-2xl p-4 card-shadow">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>
                For
              </p>
              <AudienceBadge audience={event.audience} size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
