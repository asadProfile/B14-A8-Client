'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  CloudOff,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { cn, formatCurrency, getErrorMessage } from '@/lib/utils';
import type { Booking, Studio } from '@/lib/types';

export function MyListings() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listingData, bookingData] = await Promise.all([
        api.studios.mine(),
        api.bookings.host().catch(() => ({ bookings: [] as Booking[] })),
      ]);
      setStudios(listingData.studios);
      setBookings(bookingData.bookings);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  const pendingByStudio = useMemo(() => {
    const map = new Map<string, number>();
    bookings
      .filter((booking) => booking.status === 'Pending')
      .forEach((booking) => {
        map.set(booking.studioId, (map.get(booking.studioId) ?? 0) + 1);
      });
    return map;
  }, [bookings]);

  const pendingTotal = bookings.filter((booking) => booking.status === 'Pending').length;
  const averageRate = studios.length
    ? Math.round(studios.reduce((sum, studio) => sum + studio.hourlyRate, 0) / studios.length)
    : 0;
  const reviewTotal = studios.reduce((sum, studio) => sum + studio.reviewCount, 0);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.studios.remove(deleteTarget.id);
      toast.success('Listing removed.', {
        description: `${deleteTarget.title} is no longer discoverable. Pending requests were cancelled.`,
      });
      setStudios((current) => current.filter((studio) => studio.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error('Could not remove the listing', { description: getErrorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Hosting</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">Your rooms</span>
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.2rem]">
            My studio <em className="italic text-accent">listings.</em>
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            Keep rates and details current, review incoming requests from the dashboard, and take a
            room off the floor whenever you need to.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: 'outline' })}
          >
            Host dashboard
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/add-studio" className={buttonVariants({ variant: 'primary' })}>
            <Plus className="h-4 w-4" />
            Add new studio
          </Link>
        </div>
      </div>

      {!loading && !error && studios.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Live listings', value: studios.length },
            { label: 'Average rate', value: formatCurrency(averageRate) },
            { label: 'Pending requests', value: pendingTotal },
            { label: 'Total reviews', value: reviewTotal },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-surface px-4 py-4"
            >
              <dt className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-display text-2xl text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="flex gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <Skeleton className="h-24 w-32 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-3 py-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <EmptyState
            icon={CloudOff}
            eyebrow="Connection"
            title="Your listings did not load."
            description={error}
            action={
              <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </Button>
            }
          />
        )}

        {!loading && !error && studios.length === 0 && (
          <EmptyState
            icon={Building2}
            eyebrow="No listings yet"
            title="Your first room is waiting."
            description="Add the space you already have — a daylight corner, a treated booth, a whole stage. Set a rate, upload a few honest photos and publish."
            action={
              <Link href="/add-studio" className={buttonVariants({ variant: 'primary' })}>
                <Plus className="h-4 w-4" />
                Add your first studio
              </Link>
            }
          />
        )}

        {!loading && !error && studios.length > 0 && (
          <ul className="space-y-3">
            {studios.map((studio) => {
              const pending = pendingByStudio.get(studio.id) ?? 0;
              return (
                <li
                  key={studio.id}
                  className="group rounded-2xl border border-line bg-surface p-3.5 transition hover:border-ink/20 hover:shadow-soft sm:p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href={`/studios/${studio.id}`}
                      className="relative block h-40 shrink-0 overflow-hidden rounded-xl bg-canvas sm:h-24 sm:w-32"
                      aria-label={`View ${studio.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={studio.imageURL}
                        alt={studio.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="neutral">{studio.category}</Badge>
                        {pending > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-amber-700 dark:text-amber-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {pending} pending
                          </span>
                        )}
                      </div>
                      <h2 className="mt-2 truncate font-display text-lg tracking-[-0.015em] text-ink">
                        <Link href={`/studios/${studio.id}`} className="hover:text-accent">
                          {studio.title}
                        </Link>
                      </h2>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.74rem] text-muted">
                        <span>{studio.location}</span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {studio.capacity}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          {studio.rating > 0 ? studio.rating.toFixed(1) : 'New'}
                          <span className="text-muted/70">({studio.reviewCount})</span>
                        </span>
                        <span className="font-semibold text-ink">
                          {formatCurrency(studio.hourlyRate)}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <Link
                        href={`/studios/${studio.id}`}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <Link
                        href={`/studios/edit/${studio.id}`}
                        className={buttonVariants({ variant: 'soft', size: 'sm' })}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(studio)}
                        className={cn(
                          'inline-flex h-9 items-center gap-1.5 rounded-full border border-transparent px-3.5 text-[0.8rem] font-semibold text-rose-600 transition hover:border-rose-500/30 hover:bg-rose-500/10 dark:text-rose-400',
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {loading && studios.length > 0 && (
        <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Refreshing your listings…
        </p>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Remove this listing?"
        description={
          deleteTarget
            ? `${deleteTarget.title} will leave the directory immediately. Its reviews, wishlist saves and gallery are removed, and any pending requests are cancelled. This cannot be undone.`
            : ''
        }
        confirmLabel="Remove listing"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
        isLoading={deleting}
      />
    </section>
  );
}
