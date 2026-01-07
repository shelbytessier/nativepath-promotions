import type { PromotionStatus, CalendarEventStatus } from '@/types';

type Status = PromotionStatus | CalendarEventStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-[#2a2a2a] text-[#b3b3b3] border border-[#3a3a3a]',
  },
  pending: {
    label: 'Pending Approval',
    className: 'bg-[#ffa41c] bg-opacity-20 text-[#ffa41c] border border-[#ffa41c] border-opacity-30',
  },
  approved: {
    label: 'Approved',
    className: 'bg-np-blue-600 bg-opacity-20 text-np-blue-400 border border-np-blue-600 border-opacity-30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-[#e22134] bg-opacity-20 text-[#e22134] border border-[#e22134] border-opacity-30',
  },
  active: {
    label: 'Active',
    className: 'bg-np-blue-600 text-white',
  },
  expired: {
    label: 'Expired',
    className: 'bg-[#2a2a2a] text-[#6b6b6b] border border-[#3a3a3a]',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

