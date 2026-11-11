import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { BookingStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value);

export const pad = (value: number) => String(value).padStart(2, '0');

export const toLocalISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = () => toLocalISO(new Date());

export const addDaysISO = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalISO(date);
};

export const formatDate = (iso: string) => {
  if (!iso) return '—';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateShort = (iso: string) => {
  if (!iso) return '—';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTimestamp = (iso: string) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (value: string) => {
  if (!value) return '';
  const [hour, minute] = value.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${pad(minute || 0)} ${suffix}`;
};

export const formatTimeRange = (start: string, end: string) =>
  `${formatTime(start)} – ${formatTime(end)}`;

export const timeToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const calculateBookingTotals = (
  hourlyRate: number,
  startTime: string,
  endTime: string,
) => {
  const minutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  const hours = minutes > 0 ? minutes / 60 : 0;
  const subtotal = Math.round(hourlyRate * hours * 100) / 100;
  const serviceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  return { hours, subtotal, serviceFee, total };
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SS';

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${formatNumber(count)} ${count === 1 ? singular : plural}`;

export const statusStyles: Record<BookingStatus, string> = {
  Pending:
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  Confirmed:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  Completed: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
  Cancelled: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
};

export const statusDot: Record<BookingStatus, string> = {
  Pending: 'bg-amber-500',
  Confirmed: 'bg-emerald-500',
  Completed: 'bg-sky-500',
  Cancelled: 'bg-rose-500',
};

export const safeRedirect = (value: string | null | undefined, fallback = '/') => {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
};

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong.') => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return fallback;
};

export const isExternalImage = (url: string) =>
  Boolean(url) && !url.startsWith('/') && !url.startsWith('data:');
