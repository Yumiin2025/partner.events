'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, LayoutGrid, Plus, Leaf } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Events', icon: LayoutGrid },
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <header
      style={{ backgroundColor: '#2d5438' }}
      className="sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#6fa882' }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm tracking-widest uppercase">
                RINGANA
              </span>
              <span
                className="text-xs tracking-wider"
                style={{ color: '#a8c9b4' }}
              >
                Events
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow"
            style={{ backgroundColor: '#4a7c59' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6fa882')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a7c59')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
