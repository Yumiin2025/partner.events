'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useEventStore } from '@/lib/store';
import { Audience } from '@/lib/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const AUDIENCES: { value: Audience; label: string; desc: string }[] = [
  { value: 'customers', label: 'Customers',   desc: 'For RINGANA customers' },
  { value: 'partners',  label: 'Partners',    desc: 'For business partners' },
  { value: 'team',      label: 'Team',        desc: 'Internal team only' },
  { value: 'all',       label: 'All Welcome', desc: 'Open to everyone' },
];

interface F {
  title: string; description: string; date: string; endDate: string;
  time: string; endTime: string; location: string; city: string; country: string;
  isOnline: boolean; audience: Audience; ticketUrl: string; isFree: boolean;
  price: string; organizerName: string; organizerEmail: string; organizerRole: string; tags: string;
}

const EMPTY: F = {
  title: '', description: '', date: '', endDate: '', time: '', endTime: '',
  location: '', city: '', country: 'Austria', isOnline: false, audience: 'partners',
  ticketUrl: '', isFree: true, price: '', organizerName: '', organizerEmail: '', organizerRole: '', tags: '',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-3)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>{children}</label>;
}

function Field({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg)', border: '1px solid var(--border-md)',
  color: 'var(--text)', borderRadius: '10px',
};

function Toggle({ on, onToggle, label, sub }: { on: boolean; onToggle: () => void; label: string; sub?: string }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all"
      style={{ background: on ? 'var(--green-50)' : 'var(--bg)', border: `1px solid ${on ? 'var(--green-400)' : 'var(--border-md)'}` }}
      onClick={onToggle}
    >
      <div>
        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{sub}</div>}
      </div>
      <div className="w-10 h-6 rounded-full relative flex-shrink-0 transition-colors"
        style={{ background: on ? 'var(--green-600)' : '#D1D5DB' }}>
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
          style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }} />
      </div>
    </div>
  );
}

function CreateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('edit');
  const { events, addEvent, updateEvent } = useEventStore();

  const [form, setForm] = useState<F>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});

  useEffect(() => {
    if (!editId) return;
    const e = events.find((x) => x.id === editId);
    if (!e) return;
    setForm({
      title: e.title, description: e.description, date: e.date,
      endDate: e.endDate ?? '', time: e.time, endTime: e.endTime ?? '',
      location: e.location, city: e.city, country: e.country, isOnline: e.isOnline,
      audience: e.audience, ticketUrl: e.ticketUrl ?? '', isFree: e.isFree,
      price: e.price ?? '', organizerName: e.organizer.name, organizerEmail: e.organizer.email,
      organizerRole: e.organizer.role ?? '', tags: e.tags.join(', '),
    });
  }, [editId, events]);

  const set = (k: keyof F) => (v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Partial<Record<keyof F, string>> = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    if (!form.location.trim()) e.location = 'Required';
    if (!form.isOnline && !form.city.trim()) e.city = 'Required for in-person events';
    if (!form.organizerName.trim()) e.organizerName = 'Required';
    if (!form.organizerEmail.trim()) e.organizerEmail = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));

    const data = {
      title: form.title.trim(), description: form.description.trim(),
      date: form.date, endDate: form.endDate || undefined,
      time: form.time, endTime: form.endTime || undefined,
      location: form.location.trim(),
      city: form.isOnline ? 'Online' : form.city.trim(),
      country: form.isOnline ? 'International' : form.country,
      isOnline: form.isOnline, audience: form.audience,
      ticketUrl: form.ticketUrl.trim() || undefined,
      isFree: form.isFree,
      price: form.isFree ? undefined : form.price.trim() || undefined,
      organizer: {
        name: form.organizerName.trim(), email: form.organizerEmail.trim(),
        role: form.organizerRole.trim() || undefined,
      },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      imageUrl: undefined,
    };

    if (editId) { updateEvent(editId, data); router.push(`/events/${editId}`); }
    else { addEvent(data); router.push('/'); }
    setSaving(false);
  };

  const inp = (extra?: object) => ({
    className: 'w-full px-3.5 py-2.5 text-sm outline-none rounded-[10px] transition-shadow focus:ring-2 focus:ring-green-200',
    style: { ...inputStyle, ...extra },
  });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />

      {/* Top */}
      <div style={{ background: 'linear-gradient(135deg, var(--green-900), var(--green-700))' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-4 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.65)' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {editId ? 'Edit Event' : 'Add New Event'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Share your event with the RINGANA community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <form onSubmit={submit} className="space-y-5">

          {/* Details */}
          <Section title="Event Details">
            <div className="space-y-4">
              <Field error={errors.title}>
                <Label>Title *</Label>
                <input {...inp()} value={form.title} onChange={(e) => set('title')(e.target.value)}
                  placeholder="e.g. RINGANA Partner Night Vienna" />
              </Field>
              <div>
                <Label>Description</Label>
                <textarea {...inp()} value={form.description}
                  onChange={(e) => set('description')(e.target.value)}
                  placeholder="What is this event about?"
                  rows={4} style={{ ...inputStyle, resize: 'none', display: 'block', width: '100%',
                    padding: '10px 14px', fontSize: '14px', outline: 'none', borderRadius: '10px' }} />
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <input {...inp()} value={form.tags} onChange={(e) => set('tags')(e.target.value)}
                  placeholder="wellness, launch, networking" />
              </div>
            </div>
          </Section>

          {/* Date & Time */}
          <Section title="Date & Time">
            <div className="grid grid-cols-2 gap-4">
              <Field error={errors.date}>
                <Label>Start Date *</Label>
                <input {...inp()} type="date" value={form.date} onChange={(e) => set('date')(e.target.value)} />
              </Field>
              <div>
                <Label>End Date</Label>
                <input {...inp()} type="date" value={form.endDate} onChange={(e) => set('endDate')(e.target.value)} />
              </div>
              <Field error={errors.time}>
                <Label>Start Time *</Label>
                <input {...inp()} type="time" value={form.time} onChange={(e) => set('time')(e.target.value)} />
              </Field>
              <div>
                <Label>End Time</Label>
                <input {...inp()} type="time" value={form.endTime} onChange={(e) => set('endTime')(e.target.value)} />
              </div>
            </div>
          </Section>

          {/* Location */}
          <Section title="Location">
            <div className="space-y-3">
              <Toggle on={form.isOnline} onToggle={() => set('isOnline')(!form.isOnline)}
                label="Online Event" sub="This event takes place virtually" />
              <Field error={errors.location}>
                <Label>{form.isOnline ? 'Platform' : 'Venue'} *</Label>
                <input {...inp()} value={form.location} onChange={(e) => set('location')(e.target.value)}
                  placeholder={form.isOnline ? 'Zoom, Teams, Google Meet…' : 'Hotel name or address'} />
              </Field>
              {!form.isOnline && (
                <div className="grid grid-cols-2 gap-4">
                  <Field error={errors.city}>
                    <Label>City *</Label>
                    <input {...inp()} value={form.city} onChange={(e) => set('city')(e.target.value)} placeholder="Vienna" />
                  </Field>
                  <div>
                    <Label>Country</Label>
                    <select value={form.country} onChange={(e) => set('country')(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm outline-none" style={{ ...inputStyle }}>
                      {['Austria','Germany','Switzerland','Italy','Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Audience */}
          <Section title="Audience">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AUDIENCES.map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => set('audience')(value)}
                  className="p-3.5 rounded-xl text-left transition-all"
                  style={form.audience === value
                    ? { background: 'var(--green-50)', border: '2px solid var(--green-600)' }
                    : { border: '2px solid var(--border-md)', background: 'var(--bg)' }
                  }>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{desc}</div>
                </button>
              ))}
            </div>
          </Section>

          {/* Tickets */}
          <Section title="Tickets & Registration">
            <div className="space-y-3">
              <div>
                <Label>Registration / Ticket URL</Label>
                <input {...inp()} type="url" value={form.ticketUrl}
                  onChange={(e) => set('ticketUrl')(e.target.value)} placeholder="https://..." />
              </div>
              <Toggle on={form.isFree} onToggle={() => set('isFree')(!form.isFree)} label="Free event" />
              {!form.isFree && (
                <div>
                  <Label>Price</Label>
                  <input {...inp()} value={form.price} onChange={(e) => set('price')(e.target.value)} placeholder="e.g. €25" />
                </div>
              )}
            </div>
          </Section>

          {/* Organizer */}
          <Section title="Organizer">
            <div className="space-y-4">
              <Field error={errors.organizerName}>
                <Label>Your Name *</Label>
                <input {...inp()} value={form.organizerName}
                  onChange={(e) => set('organizerName')(e.target.value)} placeholder="e.g. Maria Gruber" />
              </Field>
              <Field error={errors.organizerEmail}>
                <Label>Email *</Label>
                <input {...inp()} type="email" value={form.organizerEmail}
                  onChange={(e) => set('organizerEmail')(e.target.value)} placeholder="you@ringana.com" />
              </Field>
              <div>
                <Label>Role / Title</Label>
                <input {...inp()} value={form.organizerRole}
                  onChange={(e) => set('organizerRole')(e.target.value)} placeholder="e.g. Regional Partner AT" />
              </div>
            </div>
          </Section>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>Cancel</Link>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 card-shadow"
              style={{ background: 'var(--green-700)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', minHeight: '100vh' }} />}>
      <CreateForm />
    </Suspense>
  );
}
