'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { useEventStore } from '@/lib/store';
import { Audience } from '@/lib/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const ZIELGRUPPEN: { value: Audience; label: string; desc: string }[] = [
  { value: 'customers', label: 'Kunden',          desc: 'Für RINGANA Kunden' },
  { value: 'partners',  label: 'Partner',          desc: 'Für Geschäftspartner' },
  { value: 'team',      label: 'Team',             desc: 'Nur internes Team' },
  { value: 'all',       label: 'Alle willkommen',  desc: 'Offen für alle' },
];

const LAENDER = ['Österreich', 'Deutschland', 'Schweiz', 'Italien', 'Sonstiges'];

interface F {
  title: string; description: string; date: string; endDate: string;
  time: string; endTime: string; location: string; city: string; country: string;
  isOnline: boolean; audience: Audience; ticketUrl: string; isFree: boolean;
  price: string; organizerName: string; organizerEmail: string; organizerRole: string; tags: string;
}

const LEER: F = {
  title: '', description: '', date: '', endDate: '', time: '', endTime: '',
  location: '', city: '', country: 'Österreich', isOnline: false, audience: 'partners',
  ticketUrl: '', isFree: true, price: '', organizerName: '', organizerEmail: '',
  organizerRole: '', tags: '',
};

function Abschnitt({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow">
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-3)' }}>{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>{children}</label>;
}

function Fehler({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

const inputStyle = {
  background: 'var(--bg)',
  border: '1px solid var(--border-md)',
  color: 'var(--text)',
  borderRadius: '10px',
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

function EventFormular() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get('edit');
  const { events, addEvent, updateEvent } = useEventStore();

  const [form, setForm] = useState<F>(LEER);
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
    if (!form.title.trim())          e.title = 'Pflichtfeld';
    if (!form.date)                   e.date = 'Pflichtfeld';
    if (!form.time)                   e.time = 'Pflichtfeld';
    if (!form.location.trim())        e.location = 'Pflichtfeld';
    if (!form.isOnline && !form.city.trim()) e.city = 'Pflichtfeld bei Präsenz-Events';
    if (!form.organizerName.trim())   e.organizerName = 'Pflichtfeld';
    if (!form.organizerEmail.trim())  e.organizerEmail = 'Pflichtfeld';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
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
        name: form.organizerName.trim(),
        email: form.organizerEmail.trim(),
        role: form.organizerRole.trim() || undefined,
      },
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      imageUrl: undefined,
    };

    if (editId) { updateEvent(editId, data); router.push(`/events/${editId}`); }
    else { addEvent(data); router.push('/'); }
    setSaving(false);
  };

  const inp = {
    className: 'w-full px-3.5 py-2.5 text-sm outline-none rounded-[10px] transition-shadow',
    style: inputStyle,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />

      <div style={{ background: 'linear-gradient(135deg, var(--green-900), var(--green-700))' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <Link href="/" className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.65)' }}>
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {editId ? 'Event bearbeiten' : 'Neues Event erstellen'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Teile dein Event mit der RINGANA Partner Community
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <form onSubmit={submit} className="space-y-5">

          {/* Event Details */}
          <Abschnitt title="Event Details">
            <div className="space-y-4">
              <div>
                <Label>Titel *</Label>
                <input {...inp} value={form.title} onChange={(e) => set('title')(e.target.value)}
                  placeholder="z.B. RINGANA Partner Abend Wien" />
                <Fehler msg={errors.title} />
              </div>
              <div>
                <Label>Beschreibung</Label>
                <textarea value={form.description} onChange={(e) => set('description')(e.target.value)}
                  placeholder="Was erwartet die Teilnehmer?" rows={4}
                  className="w-full px-3.5 py-2.5 text-sm outline-none resize-none rounded-[10px]"
                  style={inputStyle} />
              </div>
              <div>
                <Label>Tags (kommagetrennt)</Label>
                <input {...inp} value={form.tags} onChange={(e) => set('tags')(e.target.value)}
                  placeholder="wellness, launch, netzwerken" />
              </div>
            </div>
          </Abschnitt>

          {/* Datum & Uhrzeit */}
          <Abschnitt title="Datum & Uhrzeit">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Startdatum *</Label>
                <input {...inp} type="date" value={form.date} onChange={(e) => set('date')(e.target.value)} />
                <Fehler msg={errors.date} />
              </div>
              <div>
                <Label>Enddatum</Label>
                <input {...inp} type="date" value={form.endDate} onChange={(e) => set('endDate')(e.target.value)} />
              </div>
              <div>
                <Label>Startzeit *</Label>
                <input {...inp} type="time" value={form.time} onChange={(e) => set('time')(e.target.value)} />
                <Fehler msg={errors.time} />
              </div>
              <div>
                <Label>Endzeit</Label>
                <input {...inp} type="time" value={form.endTime} onChange={(e) => set('endTime')(e.target.value)} />
              </div>
            </div>
          </Abschnitt>

          {/* Ort */}
          <Abschnitt title="Veranstaltungsort">
            <div className="space-y-3">
              <Toggle on={form.isOnline} onToggle={() => set('isOnline')(!form.isOnline)}
                label="Online Event" sub="Dieses Event findet virtuell statt" />
              <div>
                <Label>{form.isOnline ? 'Plattform' : 'Veranstaltungsort'} *</Label>
                <input {...inp} value={form.location} onChange={(e) => set('location')(e.target.value)}
                  placeholder={form.isOnline ? 'Zoom, Teams, Google Meet…' : 'Hotelname oder Adresse'} />
                <Fehler msg={errors.location} />
              </div>
              {!form.isOnline && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stadt *</Label>
                    <input {...inp} value={form.city} onChange={(e) => set('city')(e.target.value)} placeholder="Wien" />
                    <Fehler msg={errors.city} />
                  </div>
                  <div>
                    <Label>Land</Label>
                    <select value={form.country} onChange={(e) => set('country')(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm outline-none rounded-[10px]" style={inputStyle}>
                      {LAENDER.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </Abschnitt>

          {/* Zielgruppe */}
          <Abschnitt title="Zielgruppe">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ZIELGRUPPEN.map(({ value, label, desc }) => (
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
          </Abschnitt>

          {/* Tickets */}
          <Abschnitt title="Tickets & Anmeldung">
            <div className="space-y-3">
              <div>
                <Label>Anmelde- / Ticket-Link</Label>
                <input {...inp} type="url" value={form.ticketUrl}
                  onChange={(e) => set('ticketUrl')(e.target.value)} placeholder="https://..." />
              </div>
              <Toggle on={form.isFree} onToggle={() => set('isFree')(!form.isFree)} label="Kostenloses Event" />
              {!form.isFree && (
                <div>
                  <Label>Preis</Label>
                  <input {...inp} value={form.price} onChange={(e) => set('price')(e.target.value)} placeholder="z.B. €25" />
                </div>
              )}
            </div>
          </Abschnitt>

          {/* Veranstalter */}
          <Abschnitt title="Veranstalter">
            <div className="space-y-4">
              <div>
                <Label>Dein Name *</Label>
                <input {...inp} value={form.organizerName} onChange={(e) => set('organizerName')(e.target.value)}
                  placeholder="z.B. Maria Gruber" />
                <Fehler msg={errors.organizerName} />
              </div>
              <div>
                <Label>E-Mail *</Label>
                <input {...inp} type="email" value={form.organizerEmail}
                  onChange={(e) => set('organizerEmail')(e.target.value)} placeholder="du@partner.ringana.com" />
                <Fehler msg={errors.organizerEmail} />
              </div>
              <div>
                <Label>Rolle / Titel</Label>
                <input {...inp} value={form.organizerRole} onChange={(e) => set('organizerRole')(e.target.value)}
                  placeholder="z.B. Regionalpartnerin AT" />
              </div>
            </div>
          </Abschnitt>

          {/* Absenden */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/" className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>Abbrechen</Link>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50 card-shadow"
              style={{ background: 'var(--green-700)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editId ? 'Änderungen speichern' : 'Event veröffentlichen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventErstellenPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', minHeight: '100vh' }} />}>
      <EventFormular />
    </Suspense>
  );
}
