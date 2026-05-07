import { Audience } from '@/lib/types';

const cfg: Record<Audience, { label: string; bg: string; color: string; dot: string }> = {
  customers: { label: 'Kunden',          bg: '#E5F6F4', color: '#265650', dot: '#5BB5A8' },
  partners:  { label: 'Partner',         bg: '#DFF3F1', color: '#1B3E3A', dot: '#4A9E94' },
  team:      { label: 'Team',            bg: '#EEEDF8', color: '#5248A0', dot: '#7870C0' },
  all:       { label: 'Alle willkommen', bg: '#FDF3DC', color: '#9A6C10', dot: '#E8B84B' },
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
