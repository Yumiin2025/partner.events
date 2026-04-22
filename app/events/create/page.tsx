'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useEventStore } from '@/lib/store';
import { Audience, Event } from '@/lib/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const AUDIENCES: { value: Audience; label: string; desc: string }[] = [
  { value: 'customers', label: 'Customers', desc: 'For existing RINGANA customers' },
  { value: 'partners', label: 'Partners', desc: 'For RINGANA business partners' },
  { value: 'team', label: 'Team', desc: 'Internal team only' },
  { value: 'all', label: 'All Welcome', desc: 'Open to everyone' },
];

interface FormData {
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  endTime: string;
  location: string;
  city: string;
  country: string;
  isOnline: boolean;
  audience: Audience;
  ticketUrl: string;
  isFree: boolean;
  price: string;
  organizerName: string;
  organizerEmail: string;
  organizerRole: string;
  tags: string;
}

const defaultForm: FormData = {
  title: '',
  description: '',
  date: '',
  endDate: '',
  time: '',
  endTime: '',
  location: '',
  city: '',
  country: 'Austria',
  isOnline: false,
  audience: 'partners',
  ticketUrl: '',
  isFree: true,
  price: '',
  organizerName: '',
  organizerEmail: '',
  organizerRole: '',
  tags: '',
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#5a6b5b' }}>
      {children}
    </label>
  );
}

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2"
      style={{
        backgroundColor: '#f7f5f0',
        border: '1px solid #ede9e1',
        color: '#2c3e2d',
      }}
    />
  );
}

function CreateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const { events, addEvent, updateEvent } = useEventStore();
  const [form, setForm] = useState<FormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (editId) {
      const existing = events.find((e) => e.id === editId);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          date: existing.date,
          endDate: existing.endDate ?? '',
          time: existing.time,
          endTime: existing.endTime ?? '',
          location: existing.location,
          city: existing.city,
          country: existing.country,
          isOnline: existing.isOnline,
          audience: existing.audience,
          ticketUrl: existing.ticketUrl ?? '',
          isFree: existing.isFree,
          price: existing.price ?? '',
          organizerName: existing.organizer.name,
          organizerEmail: existing.organizer.email,
          organizerRole: existing.organizer.role ?? '',
          tags: existing.tags.join(', '),
        });
      }
    }
  }, [editId, events]);

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.time) errs.time = 'Time is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.isOnline && !form.city.trim()) errs.city = 'City is required for in-person events';
    if (!form.organizerName.trim()) errs.organizerName = 'Organizer name is required';
    if (!form.organizerEmail.trim()) errs.organizerEmail = 'Organizer email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    const eventData = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      endDate: form.endDate || undefined,
      time: form.time,
      endTime: form.endTime || undefined,
      location: form.location.trim(),
      city: form.isOnline ? 'Online' : form.city.trim(),
      country: form.isOnline ? 'International' : form.country,
      isOnline: form.isOnline,
      audience: form.audience,
      ticketUrl: form.ticketUrl.trim() || undefined,
      isFree: form.isFree,
      price: form.isFree ? undefined : form.price.trim() || undefined,
      organizer: {
        name: form.organizerName.trim(),
        email: form.organizerEmail.trim(),
        role: form.organizerRole.trim() || undefined,
      },
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: undefined,
    };

    if (editId) {
      updateEvent(editId, eventData);
      router.push(`/events/${editId}`);
    } else {
      addEvent(eventData);
      router.push('/');
    }
    setSaving(false);
  };

  const fieldClass = (field: keyof FormData) =>
    errors[field] ? 'ring-2 ring-red-400' : '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Header />

      <div
        className="py-8"
        style={{ background: 'linear-gradient(135deg, #2d5438, #4a7c59)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {editId ? 'Edit Event' : 'Add New Event'}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Share your event with the RINGANA community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Event Details
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Event Title *</Label>
                <div className={fieldClass('title')}>
                  <Input
                    value={form.title}
                    onChange={set('title')}
                    placeholder="e.g. Ringana Partner Night Vienna"
                    required
                  />
                </div>
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description')(e.target.value)}
                  placeholder="Tell people what this event is about…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
                  style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1', color: '#2c3e2d' }}
                />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={form.tags}
                  onChange={set('tags')}
                  placeholder="e.g. networking, wellness, launch"
                />
              </div>
            </div>
          </div>

          {/* Date & time */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Date & Time
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <div className={fieldClass('date')}>
                  <Input type="date" value={form.date} onChange={set('date')} required />
                </div>
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={set('endDate')} />
              </div>
              <div>
                <Label>Start Time *</Label>
                <div className={fieldClass('time')}>
                  <Input type="time" value={form.time} onChange={set('time')} required />
                </div>
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={form.endTime} onChange={set('endTime')} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Location
            </h2>

            {/* Online toggle */}
            <div
              className="flex items-center justify-between p-3 rounded-xl mb-4 cursor-pointer"
              style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1' }}
              onClick={() => set('isOnline')(!form.isOnline)}
            >
              <div>
                <div className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                  Online Event
                </div>
                <div className="text-xs" style={{ color: '#5a6b5b' }}>
                  This event takes place virtually
                </div>
              </div>
              <div
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ backgroundColor: form.isOnline ? '#4a7c59' : '#ded9d0' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: form.isOnline ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>{form.isOnline ? 'Platform / Link' : 'Venue Name'} *</Label>
                <div className={fieldClass('location')}>
                  <Input
                    value={form.location}
                    onChange={set('location')}
                    placeholder={form.isOnline ? 'e.g. Zoom, Google Meet, Teams' : 'e.g. Grand Hotel Wien, Kärntner Ring 9'}
                    required
                  />
                </div>
                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
              </div>

              {!form.isOnline && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City *</Label>
                    <div className={fieldClass('city')}>
                      <Input
                        value={form.city}
                        onChange={set('city')}
                        placeholder="e.g. Vienna"
                        required
                      />
                    </div>
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label>Country</Label>
                    <select
                      value={form.country}
                      onChange={(e) => set('country')(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1', color: '#2c3e2d' }}
                    >
                      {['Austria', 'Germany', 'Switzerland', 'Italy', 'Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audience */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Audience
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AUDIENCES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('audience')(value)}
                  className="p-3 rounded-xl text-left transition-all"
                  style={
                    form.audience === value
                      ? { backgroundColor: '#e8f0e9', border: '2px solid #4a7c59' }
                      : { border: '2px solid #ede9e1' }
                  }
                >
                  <div className="text-sm font-semibold mb-0.5" style={{ color: '#2c3e2d' }}>
                    {label}
                  </div>
                  <div className="text-xs" style={{ color: '#5a6b5b' }}>
                    {desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Tickets & Registration
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Ticket / Registration URL</Label>
                <Input
                  type="url"
                  value={form.ticketUrl}
                  onChange={set('ticketUrl')}
                  placeholder="https://..."
                />
              </div>

              <div
                className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
                style={{ backgroundColor: '#f7f5f0', border: '1px solid #ede9e1' }}
                onClick={() => set('isFree')(!form.isFree)}
              >
                <span className="text-sm font-medium" style={{ color: '#2c3e2d' }}>
                  Free event
                </span>
                <div
                  className="w-10 h-6 rounded-full relative transition-colors"
                  style={{ backgroundColor: form.isFree ? '#4a7c59' : '#ded9d0' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ transform: form.isFree ? 'translateX(18px)' : 'translateX(2px)' }}
                  />
                </div>
              </div>

              {!form.isFree && (
                <div>
                  <Label>Price</Label>
                  <Input
                    value={form.price}
                    onChange={set('price')}
                    placeholder="e.g. €25"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Organizer */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid #ede9e1' }}>
            <h2 className="text-base font-semibold mb-5" style={{ color: '#2c3e2d' }}>
              Organizer
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Your Name *</Label>
                <div className={fieldClass('organizerName')}>
                  <Input
                    value={form.organizerName}
                    onChange={set('organizerName')}
                    placeholder="e.g. Maria Gruber"
                    required
                  />
                </div>
                {errors.organizerName && <p className="text-xs text-red-500 mt-1">{errors.organizerName}</p>}
              </div>
              <div>
                <Label>Email *</Label>
                <div className={fieldClass('organizerEmail')}>
                  <Input
                    type="email"
                    value={form.organizerEmail}
                    onChange={set('organizerEmail')}
                    placeholder="you@ringana.com"
                    required
                  />
                </div>
                {errors.organizerEmail && <p className="text-xs text-red-500 mt-1">{errors.organizerEmail}</p>}
              </div>
              <div>
                <Label>Role / Title</Label>
                <Input
                  value={form.organizerRole}
                  onChange={set('organizerRole')}
                  placeholder="e.g. Regional Partner AT"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm font-medium"
              style={{ color: '#5a6b5b' }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#4a7c59' }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
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
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }} />}>
      <CreateEventForm />
    </Suspense>
  );
}
