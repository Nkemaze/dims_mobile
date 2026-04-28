import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { TASK_STATUS_LABELS } from '@/constants/taskStatus';

// ─── Date Formatters ─────────────────────────────────────────────────────────
export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'hh:mm a');
  } catch {
    return dateStr;
  }
};

export const formatRelativeDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

// ─── Task Status Label ───────────────────────────────────────────────────────
export const formatTaskStatus = (status: string): string => {
  return TASK_STATUS_LABELS[status] ?? status;
};

// ─── Name Formatter ──────────────────────────────────────────────────────────
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// ─── Initials ────────────────────────────────────────────────────────────────
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};
