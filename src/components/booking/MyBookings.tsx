'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  CloudOff,
  Download,
  Hourglass,
  Loader2,
  MapPin,
  MessageSquareQuote,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { downloadBookingInvoice, invoiceNumber } from '@/lib/invoice';
import {
  cn,
  formatCurrency,
  formatDate,
  formatTimeRange,
  getErrorMessage,
  todayISO,
} from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';

const FILTERS: Array<{ label: string; value: 'All' | BookingStatus }> = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

export function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState<'All' | BookingStatus>('All');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.bookings.mine();
      setBookings(data.bookings);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { All: bookings.length };
    bookings.forEach((booking) => {
      base[booking.status] = (base[booking.status] ?? 0) + 1;
    });
    return base;
  }, [bookings]);

  const visible = useMemo(
    () =>
      (filter === 'All'
        ? [...bookings]
        : bookings.filter((booking) => booking.status === filter)
      ).sort(
        (a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`),
      ),
    [bookings, filter],
  );

  const stats = useMemo(() => {
    const confirmed = bookings.filter((booking) => booking.status === 'Confirmed');
    return {
      upcoming: confirmed.filter((booking) => booking.date >= todayISO()).length,
      pending: bookings.filter((booking) => booking.status === 'Pending').length,
      completed: bookings.filter((booking) => booking.status === 'Completed').length,
      committed: confirmed.reduce((sum, booking) => sum + booking.total, 0),
    };
  }, [bookings]);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const data = await api.bookings.cancel(cancelTarget.id);
      setBookings((current) =>
        current.map((booking) => (booking.id === data.booking.id ? data.booking : booking)),
      );
      toast.success('Request cancelled.', {
        description: `${cancelTarget.studioSnapshot.title} · ${formatDate(cancelTarget.date)}. The host has been notified.`,
      });
      setCancelTarget(null);
    } catch (err) {
      toast.error('Could not cancel the request', { description: getErrorMessage(err) });
    } finally {
      setCancelling(false);
    }
  };

  const download = async (booking: Booking) => {
    setDownloading(booking.id);
    try {
      await downloadBookingInvoice(booking, {
        name: user?.name || booking.userName,
        email: user?.email || booking.userEmail,
      });
      toast.success('Invoice downloaded.', {
        description: `${invoiceNumber(booking.id)} saved as a PDF.`,
      });
    } catch (err) {
      toast.error('Could not create the invoice', { description: getErrorMessage(err) });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Your sessions</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">Requests & invoices</span>
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.2rem]">
            My <em className="italic text-accent">bookings.</em>
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            Every request you have sent, every confirmed session and a printable invoice for the
            ones that happened. Pending requests can be cancelled without a fee.
          </p>
        </div>
        <Link href="/studios" className={buttonVariants({ variant: 'primary' })}>
          Find another space
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {!loading && !error && bookings.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: CalendarCheck2, label: 'Upcoming confirmed', value: stats.upcoming },
            { icon: Hourglass, label: 'Awaiting host', value: stats.pending },
            { icon: CheckCircle2, label: 'Completed sessions', value: stats.completed },
            { icon: CalendarDays, label: 'Confirmed value', value: formatCurrency(stats.committed) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-surface px-4 py-4">
              <stat.icon className="h-4 w-4 text-accent" strokeWidth={1.7} />
              <dt className="mt-2.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-7 flex items-center gap-1.5 overflow-x-auto border-b border-line pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={active}
                className={cn(
                  'relative shrink-0 px-3.5 pb-3 pt-1 text-[0.8rem] font-semibold transition',
                  active ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {option.label}
                <span
                  className={cn(
                    'ml-1.5 rounded-full px-1.5 py-0.5 text-[0.6rem] tabular-nums',
                    active ? 'bg-accent-soft text-accent' : 'bg-elevated text-muted',
                  )}
                >
                  {counts[option.value] ?? 0}
                </span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
                <Skeleton className="h-28 w-40 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-9 w-40 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon={CloudOff}
            eyebrow="Connection"
            title="Your bookings did not load."
            description={error}
            action={
              <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && visible.length === 0 && (
          <EmptyState
            icon={CalendarX2}
            eyebrow={bookings.length === 0 ? 'No sessions yet' : `No ${filter.toLowerCase()} bookings`}
            title={bookings.length === 0 ? 'The calendar is wide open.' : 'Nothing in this view.'}
            description={
              bookings.length === 0
                ? 'Find a room that fits the work, request your hours and your host will confirm. Everything lands here with an invoice when it is done.'
                : 'Switch back to All to see your other requests, or book another session.'
            }
            action={
              <Link href="/studios" className={buttonVariants({ variant: 'primary' })}>
                Explore studios
              </Link>
            }
          />
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="space-y-3">
            {visible.map((booking) => {
              const canCancel = booking.status === 'Pending';
              const canInvoice = booking.status === 'Confirmed' || booking.status === 'Completed';
              const isDownloading = downloading === booking.id;

              return (
                <li
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-ink/15 hover:shadow-soft"
                >
                  <div className="flex flex-col sm:flex-row">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="relative block h-44 shrink-0 overflow-hidden bg-canvas sm:h-auto sm:w-48"
                      aria-label={`View ${booking.studioSnapshot.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.studioSnapshot.imageURL}
                        alt={booking.studioSnapshot.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted">
                            {booking.studioSnapshot.category}
                          </p>
                          <h2 className="mt-1 truncate font-display text-lg tracking-[-0.015em] text-ink">
                            <Link href={`/studios/${booking.studioId}`} className="hover:text-accent">
                              {booking.studioSnapshot.title}
                            </Link>
                          </h2>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-accent" />
                          {formatDate(booking.date)}
                        </span>
                        <span>{formatTimeRange(booking.startTime, booking.endTime)}</span>
                        <span>{booking.hours}h</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.studioSnapshot.location}
                        </span>
                      </div>

                      {booking.note && (
                        <p className="mt-2.5 line-clamp-2 rounded-lg bg-canvas px-3 py-2 text-[0.76rem] leading-relaxed text-muted">
                          “{booking.note}”
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-3.5">
                        <div>
                          <p className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted">
                            Total
                          </p>
                          <p className="font-display text-xl text-ink">
                            {formatCurrency(booking.total)}
                          </p>
                          <p className="mt-0.5 text-[0.66rem] text-muted">
                            incl. {formatCurrency(booking.serviceFee)} service fee
                            {booking.securityDeposit > 0 &&
                              ` · ${formatCurrency(booking.securityDeposit)} deposit held`}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {canInvoice && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => void download(booking)}
                              disabled={isDownloading}
                            >
                              {isDownloading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Download className="h-3.5 w-3.5" />
                              )}
                              {isDownloading ? 'Preparing…' : 'Invoice PDF'}
                            </Button>
                          )}
                          {booking.status === 'Completed' && (
                            <Link
                              href={`/studios/${booking.studioId}#reviews`}
                              className={buttonVariants({ variant: 'soft', size: 'sm' })}
                            >
                              <MessageSquareQuote className="h-3.5 w-3.5" />
                              Leave review
                            </Link>
                          )}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(booking)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-transparent px-3 text-[0.8rem] font-semibold text-rose-600 transition hover:border-rose-500/30 hover:bg-rose-500/10 dark:text-rose-400"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel request
                            </button>
                          )}
                          {!canCancel && !canInvoice && (
                            <Link
                              href={`/studios/${booking.studioId}`}
                              className={buttonVariants({ variant: 'outline', size: 'sm' })}
                            >
                              View studio
                            </Link>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-[0.62rem] text-muted">
                        Request {invoiceNumber(booking.id)} · sent{' '}
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelTarget(null);
        }}
        title="Cancel this request?"
        description={
          cancelTarget
            ? `${cancelTarget.studioSnapshot.title} on ${formatDate(cancelTarget.date)} (${formatTimeRange(
                cancelTarget.startTime,
                cancelTarget.endTime,
              )}) will be released. The host will no longer see the request. You can always send a new one.`
            : ''
        }
        confirmLabel="Cancel request"
        cancelLabel="Keep it"
        onConfirm={confirmCancel}
        isLoading={cancelling}
      />
    </section>
  );
}
