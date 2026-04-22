import Header from '@/components/Header';
import EventsClient from '@/components/EventsClient';
import StatsBar from '@/components/StatsBar';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f5f0' }}>
      <Header />

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2d5438 0%, #4a7c59 60%, #6fa882 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white/70 uppercase tracking-widest">
                  RINGANA Partner Platform
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Events Overview
              </h1>
              <p className="text-white/80 text-lg max-w-xl">
                All RINGANA events in one place — find events near you, get tickets, and connect with your community.
              </p>
            </div>
            <Link
              href="/events/create"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all shadow-lg hover:opacity-90"
              style={{ backgroundColor: '#fff', color: '#2d5438' }}
            >
              + Add Your Event
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <StatsBar />
        <EventsClient />
      </div>

      {/* Footer */}
      <footer
        className="mt-16 py-8 text-center text-sm"
        style={{ color: '#5a6b5b', borderTop: '1px solid #ede9e1' }}
      >
        <span className="font-semibold" style={{ color: '#4a7c59' }}>RINGANA Events</span>
        {' '}&middot; Made with care for the RINGANA community
      </footer>
    </div>
  );
}
