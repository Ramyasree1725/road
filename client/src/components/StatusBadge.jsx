import React from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  Wrench,
  Activity,
  CheckCheck,
  RotateCcw,
  XCircle,
  ShieldCheck,
} from 'lucide-react';

export const StatusBadge = ({ status = 'SUBMITTED', size = 'md' }) => {
  const config = {
    SUBMITTED: {
      bg: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
      icon: Clock,
      label: 'Submitted',
    },
    UNDER_REVIEW: {
      bg: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
      icon: Search,
      label: 'Under Review',
    },
    VERIFIED: {
      bg: 'bg-teal-950/80 text-teal-300 border-teal-800/80',
      icon: CheckCircle2,
      label: 'Verified',
    },
    ASSIGNED: {
      bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      icon: Wrench,
      label: 'Assigned',
    },
    IN_PROGRESS: {
      bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 font-bold',
      icon: Activity,
      label: 'In Progress',
    },
    RESOLVED: {
      bg: 'bg-emerald-950 text-emerald-300 border border-emerald-600 font-extrabold shadow-sm',
      icon: CheckCheck,
      label: 'Resolved',
    },
    REOPENED: {
      bg: 'bg-rose-950/80 text-rose-300 border-rose-800/80 font-bold',
      icon: RotateCcw,
      label: 'Reopened',
    },
    REJECTED: {
      bg: 'bg-slate-900 text-slate-400 border-slate-800',
      icon: XCircle,
      label: 'Rejected',
    },
    CLOSED: {
      bg: 'bg-slate-900 text-slate-400 border-slate-800',
      icon: ShieldCheck,
      label: 'Closed',
    },
  };

  const item = config[status] || config.SUBMITTED;
  const Icon = item.icon;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border ${
        item.bg
      } ${sizeClasses[size] || sizeClasses.md}`}
    >
      <Icon className={iconSizes[size] || iconSizes.md} />
      <span>{item.label}</span>
    </span>
  );
};

export default StatusBadge;
