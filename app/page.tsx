import Header from '@/components/Header';
import EventsClient from '@/components/EventsClient';
import StatsBar from '@/components/StatsBar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(160deg, var(--green-900) 0%, var(--green-800) 50%, var(--green-700) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--green-400)' }}>
                RINGANA Partner Platform
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
                All events.<br />One place.
              </h1>
              <p className="text-base max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Find events near you, get tickets, and stay connected with the RINGANA community — partners, customers, and team.
              </p>
            </div>
            <Link
              href="/events/create"
              className="self-start sm:self-auto flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'var(--green-500)', color: '#fff' }}
            >
              + Add Your Event
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-8">
        <StatsBar />
        <EventsClient />
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-xs" style={{ color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
        <span className="font-semibold" style={{ color: 'var(--green-600)' }}>RINGANA Events</span>
        {' '}· Built for the RINGANA community
      </footer>
    </div>
  );
}
