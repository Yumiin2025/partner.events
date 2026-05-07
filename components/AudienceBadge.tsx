import { Audience } from '@/lib/types';

const cfg: Record<Audience, { label: string; bg: string; color: string; dot: string }> = {
  customers: { label: 'Kunden',          bg: '#EBF5F3', color: '#2A5E56', dot: '#7AAF9F' },
  partners:  { label: 'Partner',         bg: '#E6F2EF', color: '#345C55', dot: '#5E9186' },
  team:      { label: 'Team',            bg: '#FDF6EC', color: '#7C4A1A', dot: '#D4891A' },
  all:       { label: 'Alle willkommen', bg: '#EBF5F3', color: '#2A4A44', dot: '#9EC9BE' },
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
