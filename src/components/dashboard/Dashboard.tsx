'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CloudOff,
  Heart,
  Inbox,
  Loader2,
  MapPin,
  Plus,
  Star,
  Users,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';
import {
  cn,
  formatCurrency,
  formatDate,
  formatTimeRange,
  getErrorMessage,
  todayISO,
} from '@/lib/utils';
import type { Booking, Studio } from '@/lib/types';

type DashboardData = {
  listings: Studio[];
  hostBookings: Booking[];
  myBookings: Booking[];
  savedCount: number;
};

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listings, host, mine, saved] = await Promise.all([
        api.studios.mine(),
        api.bookings.host(),
        api.bookings.mine(),
        api.wishlist.list().catch(() => ({ studios: [], studioIds: [] as string[] })),
      ]);
      setData({
        listings: listings.studios,
        hostBookings: host.bookings,
        myBookings: mine.bookings,
        savedCount: saved.studioIds.length,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const stats = useMemo(() => {
    if (!data) {
      return { listings: 0, pending: 0, upcoming: 0, completed: 0, earned: 0 };
    }
    const pending = data.hostBookings.filter((booking) => booking.status === 'Pending');
    const upcoming = data.myBookings.filter(
      (booking) => booking.status === 'Confirmed' && booking.date >= todayISO(),
    );
    const completed = data.hostBookings.filter((booking) => booking.status === 'Completed');
    return {
      listings: data.listings.length,
      pending: pending.length,
      upcoming: upcoming.length,
      completed: completed.length,
      earned: completed.reduce((sum, booking) => sum + booking.total, 0),
    };
  }, [data]);

  const requests = useMemo(() => {
    if (!data) return [];
    return [...data.hostBookings]
      .filter((booking) => ['Pending', 'Confirmed'].includes(booking.status))
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
      .slice(0, 5);
  }, [data]);

  const updateBooking = (updated: Booking) => {
    setData((current) =>
      current
        ? {
            ...current,
            hostBookings: current.hostBookings.map((booking) =>
              booking.id === updated.id ? updated : booking,
            ),
          }
        : current,
    );
  };

  const confirmRequest = async (booking: Booking) => {
    setBusyId(booking.id);
    try {
      const result = await api.bookings.confirm(booking.id);
      updateBooking(result.booking);
      toast.success('Booking confirmed.', {
        description: `${booking.studioSnapshot.title} is now locked for ${formatDate(booking.date)}.`,
      });
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? err.message
          : getErrorMessage(err, 'Could not confirm this request.');
      toast.error('Request not confirmed', { description: message });
    } finally {
      setBusyId(null);
    }
  };

  const completeBooking = async (booking: Booking) => {
    setBusyId(booking.id);
    try {
      const result = await api.bookings.complete(booking.id);
      updateBooking(result.booking);
      toast.success('Session marked complete.', {
        description: 'The creator can now leave a review from My bookings.',
      });
    } catch (err) {
      toast.error('Could not update the booking', { description: getErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <section className="container py-10 sm:py-14">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-12 w-2/3 max-w-lg" />
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Skeleton className="h-[26rem] rounded-3xl" />
          <Skeleton className="h-[26rem] rounded-3xl" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={CloudOff}
          eyebrow="Connection"
          title="The dashboard did not load."
          description={error || 'Something interrupted the request.'}
          action={
            <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const firstName = user?.name.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Control room</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">{today}</span>
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.2rem]">
            Good to see you, <em className="italic text-accent">{firstName}.</em>
          </h1>
          <p className="mt-3 max-w-xl text-[0.93rem] leading-relaxed text-muted">
            {stats.pending > 0
              ? `${stats.pending} ${stats.pending === 1 ? 'request is' : 'requests are'} waiting on you. Confirm carefully — overlapping hours are blocked by the calendar.`
              : 'No requests waiting. Your rooms are on the floor and the calendar is clear.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/add-studio" className={buttonVariants({ variant: 'primary' })}>
            <Plus className="h-4 w-4" />
            Add studio
          </Link>
          <Link href="/my-listings" className={buttonVariants({ variant: 'outline' })}>
            Manage listings
          </Link>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Building2, label: 'Live listings', value: stats.listings, href: '/my-listings' },
          { icon: Inbox, label: 'Requests waiting', value: stats.pending, href: '/my-listings' },
          { icon: CalendarDays, label: 'Upcoming sessions', value: stats.upcoming, href: '/my-bookings' },
          { icon: Wallet, label: 'Completed value', value: formatCurrency(stats.earned), href: '/my-bookings' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-line bg-surface px-4 py-4 transition hover:border-accent/30 hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <stat.icon className="h-4 w-4 text-accent" strokeWidth={1.7} />
              <ArrowUpRight className="h-3.5 w-3.5 text-muted/50 transition group-hover:text-accent" />
            </div>
            <dt className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted">
              {stat.label}
            </dt>
            <dd className="mt-1 font-display text-2xl text-ink">{stat.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[1.5rem] border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                Host inbox
              </p>
              <h2 className="mt-1.5 font-display text-xl tracking-[-0.02em] text-ink">
                Requests & confirmed sessions
              </h2>
            </div>
            <span className="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-accent">
              {stats.pending} pending
            </span>
          </div>

          {requests.length === 0 ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-canvas text-accent">
                <Inbox className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <p className="mt-3 font-display text-lg text-ink">The inbox is quiet.</p>
              <p className="mx-auto mt-1 max-w-sm text-[0.82rem] leading-relaxed text-muted">
                New requests will appear here for you to confirm. Share your listing to get the
                first one.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {requests.map((booking) => {
                const isPending = booking.status === 'Pending';
                const canComplete =
                  booking.status === 'Confirmed' && booking.date <= todayISO();
                const busy = busyId === booking.id;

                return (
                  <li
                    key={booking.id}
                    className="rounded-xl border border-line bg-canvas p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-muted">
                          {booking.userName} · {booking.userEmail}
                        </p>
                        <h3 className="mt-1 truncate font-display text-[1.05rem] text-ink">
                          {booking.studioSnapshot.title}
                        </h3>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.74rem] text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-accent" />
                        {formatDate(booking.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatTimeRange(booking.startTime, booking.endTime)}
                      </span>
                      <span>{formatCurrency(booking.total)} total</span>
                      {booking.securityDeposit > 0 && (
                        <span>{formatCurrency(booking.securityDeposit)} deposit</span>
                      )}
                    </div>

                    {booking.note && (
                      <p className="mt-2 line-clamp-2 rounded-lg bg-surface px-3 py-2 text-[0.74rem] leading-relaxed text-muted">
                        “{booking.note}”
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {isPending && (
                        <Button
                          size="sm"
                          onClick={() => void confirmRequest(booking)}
                          disabled={busy}
                        >
                          {busy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          {busy ? 'Confirming…' : 'Confirm booking'}
                        </Button>
                      )}
                      {canComplete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void completeBooking(booking)}
                          disabled={busy}
                        >
                          {busy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Mark complete
                        </Button>
                      )}
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                      >
                        View listing
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-line bg-surface p-5">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
              Short cuts
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { href: '/my-listings', icon: Building2, label: 'My listings', meta: `${stats.listings} live` },
                { href: '/my-bookings', icon: CalendarDays, label: 'My bookings', meta: `${stats.upcoming} upcoming` },
                { href: '/wishlist', icon: Heart, label: 'Saved spaces', meta: `${data.savedCount} saved` },
                { href: '/add-studio', icon: Plus, label: 'Add a studio', meta: 'New listing' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-xl border border-line bg-canvas p-3 transition hover:border-accent/30 hover:bg-surface"
                >
                  <action.icon className="h-4 w-4 text-accent" strokeWidth={1.7} />
                  <p className="mt-2 text-[0.78rem] font-semibold text-ink">{action.label}</p>
                  <p className="mt-0.5 text-[0.64rem] text-muted">{action.meta}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                Recent bookings
              </p>
              <Link href="/my-bookings" className="text-[0.68rem] font-semibold text-accent hover:underline">
                View all
              </Link>
            </div>
            {data.myBookings.length === 0 ? (
              <p className="mt-3 text-[0.78rem] leading-relaxed text-muted">
                You have not requested a space yet.{' '}
                <Link href="/studios" className="font-semibold text-ink hover:text-accent">
                  Find a room
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {data.myBookings.slice(0, 3).map((booking) => (
                  <li key={booking.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-canvas">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.studioSnapshot.imageURL}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8rem] font-semibold text-ink">
                        {booking.studioSnapshot.title}
                      </p>
                      <p className="text-[0.66rem] text-muted">
                        {formatDate(booking.date)} · {formatTimeRange(booking.startTime, booking.endTime)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} className="shrink-0 scale-90" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {data.listings.length > 0 && (
            <div className="rounded-[1.5rem] border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                  Your rooms
                </p>
                <Link href="/my-listings" className="text-[0.68rem] font-semibold text-accent hover:underline">
                  Manage
                </Link>
              </div>
              <ul className="mt-3 space-y-2.5">
                {data.listings.slice(0, 3).map((studio) => (
                  <li key={studio.id}>
                    <Link
                      href={`/studios/${studio.id}`}
                      className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-2.5 transition hover:border-accent/30"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={studio.imageURL} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.78rem] font-semibold text-ink">{studio.title}</p>
                        <p className="flex items-center gap-2 text-[0.64rem] text-muted">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                            {studio.rating > 0 ? studio.rating.toFixed(1) : 'New'}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <Users className="h-2.5 w-2.5" />
                            {studio.capacity}
                          </span>
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {studio.location}
                          </span>
                        </p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted/50" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {stats.completed === 0 && data.hostBookings.length > 0 && (
        <p className="mt-5 text-center text-[0.7rem] text-muted">
          <CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-600" />
          Mark a confirmed session complete after it happens so the creator can review it.
        </p>
      )}

      {data.listings.length === 0 && (
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-line p-5 text-center sm:p-7">
          <p className="font-display text-lg text-ink">No rooms listed yet.</p>
          <p className="mx-auto mt-1 max-w-md text-[0.82rem] text-muted">
            The dashboard fills up once you publish a space. Your first listing takes about five
            minutes.
          </p>
          <Link href="/add-studio" className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'mt-4')}>
            <Plus className="h-3.5 w-3.5" />
            Add your first studio
          </Link>
        </div>
      )}
    </section>
  );
}
