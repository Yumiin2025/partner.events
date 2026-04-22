'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, LayoutGrid, Plus } from 'lucide-react';

function RinganaPartnerLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="30" height="30" rx="4" stroke="var(--green-700)" strokeWidth="1.5" fill="none"/>
      {/* Stem */}
      <line x1="16" y1="26" x2="16" y2="14" stroke="var(--green-700)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Left leaf */}
      <path d="M16 18 C13 16 10 13 11 9 C14 10 17 13 16 18Z" fill="var(--green-600)" opacity="0.85"/>
      {/* Right leaf */}
      <path d="M16 15 C19 13 22 10 21 6 C18 7 15 10 16 15Z" fill="var(--green-500)" opacity="0.85"/>
      {/* Small blossom top */}
      <circle cx="16" cy="8" r="2" fill="var(--green-700)"/>
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();

  const nav = [
    { href: '/', label: 'Events', icon: LayoutGrid },
    { href: '/calendar', label: 'Kalender', icon: CalendarDays },
  ];

  return (
    <header className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <RinganaPartnerLogo />
          <div className="leading-tight">
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--green-700)' }}>
              RINGANA
            </div>
            <div className="text-[10px] tracking-wider font-medium" style={{ color: 'var(--text-3)' }}>
              Partner Events
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
          <span className="hidden sm:inline">Event erstellen</span>
        </Link>

      </div>
    </header>
  );
}
