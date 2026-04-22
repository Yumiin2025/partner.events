import { Audience } from '@/lib/types';

const cfg: Record<Audience, { label: string; bg: string; color: string; dot: string }> = {
  customers: { label: 'Kunden',          bg: '#EAF4EF', color: '#1B5E3B', dot: '#52A87B' },
  partners:  { label: 'Partner',         bg: '#E6F0EB', color: '#2D5C44', dot: '#3D7A5A' },
  team:      { label: 'Team',            bg: '#FDF6EC', color: '#7C4A1A', dot: '#D4891A' },
  all:       { label: 'Alle willkommen', bg: '#EEF7F5', color: '#1A5750', dot: '#8ECFC4' },
};

export default function AudienceBadge({
  audience,
  size = 'sm',
}: {
  audience: Audience;
  size?: 'sm' | 'md';
}) {
  const { label, bg, color, dot } = cfg[audience];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap"
      style={{
        background: bg,
        color,
        padding: size === 'md' ? '4px 10px' : '2px 8px',
        fontSize: size === 'md' ? '13px' : '11px',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
      {label}
    </span>
  );
}
