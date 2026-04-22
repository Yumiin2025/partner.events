export type Audience = 'customers' | 'partners' | 'team' | 'all';
export type EventStatus = 'upcoming' | 'ongoing' | 'past';

export interface Organizer {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  location: string;
  city: string;
  country: string;
  isOnline: boolean;
  audience: Audience;
  ticketUrl?: string;
  isFree: boolean;
  price?: string;
  organizer: Organizer;
  imageUrl?: string;
  tags: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  audience: Audience | 'all';
  search: string;
  country: string;
  dateFrom: string;
  dateTo: string;
  view: 'grid' | 'list' | 'calendar';
}
