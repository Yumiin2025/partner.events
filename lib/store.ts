'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event, FilterState } from './types';
import { seedEvents } from './seed-data';

interface EventStore {
  events: Event[];
  filters: FilterState;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  getFilteredEvents: () => Event[];
}

const defaultFilters: FilterState = {
  audience: 'all',
  search: '',
  country: '',
  dateFrom: '',
  dateTo: '',
  view: 'grid',
};

function computeStatus(date: string, endDate?: string): Event['status'] {
  const now = new Date();
  const start = new Date(date);
  const end = endDate ? new Date(endDate) : start;
  if (end < now) return 'past';
  if (start <= now && end >= now) return 'ongoing';
  return 'upcoming';
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: seedEvents,
      filters: defaultFilters,

      addEvent: (eventData) => {
        const now = new Date().toISOString();
        const newEvent: Event = {
          ...eventData,
          id: crypto.randomUUID(),
          status: computeStatus(eventData.date, eventData.endDate),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ events: [newEvent, ...state.events] }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...updates,
                  status: computeStatus(updates.date ?? e.date, updates.endDate ?? e.endDate),
                  updatedAt: new Date().toISOString(),
                }
              : e
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
      },

      setFilters: (newFilters) => {
        set((state) => ({ filters: { ...state.filters, ...newFilters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getFilteredEvents: () => {
        const { events, filters } = get();
        return events.filter((event) => {
          if (filters.audience !== 'all' && event.audience !== 'all' && event.audience !== filters.audience) {
            return false;
          }
          if (filters.search) {
            const query = filters.search.toLowerCase();
            const searchable = `${event.title} ${event.description} ${event.city} ${event.organizer.name} ${event.tags.join(' ')}`.toLowerCase();
            if (!searchable.includes(query)) return false;
          }
          if (filters.country && event.country !== filters.country) return false;
          if (filters.dateFrom && event.date < filters.dateFrom) return false;
          if (filters.dateTo && event.date > filters.dateTo) return false;
          return true;
        });
      },
    }),
    {
      name: 'ringana-events',
    }
  )
);
