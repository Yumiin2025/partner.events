'use client';

import { useEventStore } from '@/lib/store';
import { CalendarDays, Users, Globe, TrendingUp } from 'lucide-react';

export default function StatsBar() {
  const { events } = useEventStore();

  const upcoming = events.filter((e) => e.status !== 'past').length;
  const countries = new Set(events.filter((e) => !e.isOnline).map((e) => e.country)).size;
  const online = events.filter((e) => e.isOnline).length;
  const organizers = new Set(events.map((e) => e.organizer.email)).size;

  const stats = [
    { icon: CalendarDays, label: 'Upcoming Events', value: upcoming, color: '#4a7c59' },
    { icon: Globe, label: 'Countries', value: countries, color: '#1565c0' },
    { icon: TrendingUp, label: 'Online Events', value: online, color: '#6a1b9a' },
    { icon: Users, label: 'Organizers', value: organizers, color: '#e65100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm"
          style={{ border: '1px solid #ede9e1' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '18' }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color: '#2c3e2d' }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: '#5a6b5b' }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
