'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, LayoutGrid, Plus } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const nav = [
    { href: '/', label: 'Events', icon: LayoutGrid },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <header className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--green-700)" />
            <path d="M14 6C14 6 8 10 8 15.5C8 18.5 10.7 21 14 21C17.3 21 20 18.5 20 15.5C20 10 14 6 14 6Z" fill="white" opacity="0.9"/>
            <path d="M14 11C14 11 11 13.5 11 16C11 17.7 12.3 19 14 19" stroke="var(--green-400)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="leading-tight">
            <div className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--green-700)' }}>
              RINGANA
            </div>
            <div className="text-[10px] tracking-wider" style={{ color: 'var(--text-3)' }}>
              Events
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={active
                  ? { background: 'var(--green-50)', color: 'var(--green-700)' }
                  : { color: 'var(--text-2)' }
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/events/create"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all flex-shrink-0"
          style={{ background: 'var(--green-700)' }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Event</span>
        </Link>

      </div>
    </header>
  );
}
