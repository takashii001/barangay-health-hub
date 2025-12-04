import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const statusStyles: Record<StatusType, string> = {
  success: 'status-success',
  warning: 'status-warning',
  danger: 'status-danger',
  info: 'status-info',
  pending: 'status-pending',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={cn('status-badge', statusStyles[status])}>
      {label}
    </span>
  );
}
