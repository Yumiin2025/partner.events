import { Audience } from '@/lib/types';

const cfg: Record<Audience, { label: string; bg: string; color: string; dot: string }> = {
  customers: { label: 'Customers',   bg: '#ECFDF5', color: '#065F46', dot: '#10B981' },
  partners:  { label: 'Partners',    bg: '#EFF6FF', color: '#1E40AF', dot: '#3B82F6' },
  team:      { label: 'Team',        bg: '#FFF7ED', color: '#92400E', dot: '#F59E0B' },
  all:       { label: 'All Welcome', bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6' },
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
      className="inline-flex items-center gap-1.5 font-medium rounded-full"
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
