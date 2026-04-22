'use client';

import { useEventStore } from '@/lib/store';

export default function StatsBar() {
  const { events } = useEventStore();

  const upcoming   = events.filter((e) => e.status !== 'past').length;
  const countries  = new Set(events.filter((e) => !e.isOnline).map((e) => e.country)).size;
  const online     = events.filter((e) => e.isOnline).length;
  const organizers = new Set(events.map((e) => e.organizer.email)).size;

  const stats = [
    { label: 'Bevorstehend', value: upcoming,   unit: 'Events' },
    { label: 'Länder',       value: countries,  unit: 'Regionen' },
    { label: 'Online',       value: online,     unit: 'Virtuell' },
    { label: 'Veranstalter', value: organizers, unit: 'Hosts' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, unit }) => (
        <div key={label} className="bg-white rounded-2xl px-5 py-4 card-shadow">
          <div className="text-3xl font-bold tracking-tight mb-0.5" style={{ color: 'var(--green-700)' }}>
            {value}
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}
