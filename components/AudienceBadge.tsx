import { Audience } from '@/lib/types';
import { Users, Briefcase, HeartHandshake, Globe } from 'lucide-react';

const config: Record<Audience, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  customers: { label: 'Customers', bg: '#e8f5e9', text: '#2e7d32', icon: HeartHandshake },
  partners: { label: 'Partners', bg: '#e3f2fd', text: '#1565c0', icon: Briefcase },
  team: { label: 'Team', bg: '#fff3e0', text: '#e65100', icon: Users },
  all: { label: 'All Welcome', bg: '#f3e5f5', text: '#6a1b9a', icon: Globe },
};

export default function AudienceBadge({ audience, size = 'sm' }: { audience: Audience; size?: 'sm' | 'md' }) {
  const { label, bg, text, icon: Icon } = config[audience];
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${padding}`}
      style={{ backgroundColor: bg, color: text }}
    >
      <Icon className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      {label}
    </span>
  );
}
