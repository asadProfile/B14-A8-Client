'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Heart,
  Loader2,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { StarRating } from '@/components/ui/StarRating';
import { BookingDialog } from '@/components/studio/BookingDialog';
import { ReviewSection } from '@/components/studio/ReviewSection';
import { StudioGallery } from '@/components/studio/StudioGallery';
import { StudioCard } from '@/components/studio/StudioCard';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';
import {
  cn,
  formatCurrency,
  getErrorMessage,
} from '@/lib/utils';
import type { Studio } from '@/lib/types';

type DetailState = {
  studio: Studio;
  related: Studio[];
};

function DetailsSkeleton() {
  return (
    <div className="container py-10">
      <Skeleton className="h-3 w-52" />
      <Skeleton className="mt-5 h-11 w-3/4 max-w-xl" />
      <Skeleton className="mt-4 h-4 w-64" />
      <div className="mt-7 grid gap-2 lg:h-[30rem] lg:grid-cols-3 lg:grid-rows-2">
        <Skeleton className="h-64 rounded-[1.25rem] sm:col-span-2 lg:row-span-2 lg:h-full" />
        <Skeleton className="hidden h-full rounded-[1.25rem] lg:block" />
        <Skeleton className="hidden h-full rounded-[1.25rem] lg:block" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-80 rounded-[1.5rem]" />
      </div>
    </div>
  );
}

export function StudioDetails({ studioId }: { studioId: string }) {
  const router = useRouter();
  const { user, loading: authLoading, toggleWishlist, isSaved } = useAuth();
  const [data, setData] = useState<DetailState | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setMissing(false);

    api.studios
      .detail(studioId)
      .then((response) => {
        if (!active) return;
        setData({ studio: response.studio, related: response.related });
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 404) setMissing(true);
        else setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studioId, reloadKey]);

  const studio = data?.studio;
  const images = useMemo(() => {
    if (!studio) return [];
    return Array.from(new Set([studio.imageURL, ...studio.images].filter(Boolean))).slice(0, 8);
  }, [studio]);

  const isOwner = Boolean(user && studio && user.email === studio.ownerEmail);
  const saved = studio ? isSaved(studio.id) : false;

  const saveStudio = useCallback(async () => {
    if (!studio) return;
    setSaving(true);
    try {
      const result = await toggleWishlist(studio.id);
      if (result.requiresAuth) {
        toast.info('Sign in to save this space', {
          action: {
            label: 'Sign in',
            onClick: () =>
              router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio.id}`)}`),
          },
        });
        return;
      }
      toast.success(result.saved ? 'Saved to your wishlist' : 'Removed from your wishlist', {
        description: result.saved ? studio.title : undefined,
      });
    } catch (err) {
      toast.error('Could not update your wishlist', { description: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  }, [studio, toggleWishlist, router]);

  const share = async () => {
    if (!studio) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: studio.title, text: studio.overview, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Link copied', { description: 'Share the room with your crew.' });
    } catch {
      toast.info('Copy this page URL to share it.', { description: url });
    }
  };

  const startBooking = () => {
    if (!studio || authLoading) return;
    if (isOwner) {
      toast.info('This is your listing.', {
        description: 'Manage the room and its requests from your dashboard.',
      });
      router.push('/dashboard');
      return;
    }
    if (!user) {
      toast.info('Sign in to request this space', {
        description: 'Your request and confirmation live in My bookings.',
      });
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${studio.id}`)}`);
      return;
    }
    setBookingOpen(true);
  };

  if (loading) return <DetailsSkeleton />;

  if (missing) {
    return (
      <div className="container py-16 sm:py-24">
        <EmptyState
          icon={Compass}
          eyebrow="Lost the room"
          title="This studio is not on the map."
          description="The listing may have been removed by its host, or the link is incomplete. Browse the directory — there is a room with your name on it."
          action={
            <>
              <Link href="/studios" className={buttonVariants({ variant: 'primary' })}>
                Explore studios
              </Link>
              <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            </>
          }
        />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="container py-16 sm:py-24">
        <EmptyState
          icon={Compass}
          eyebrow="Connection"
          title="We could not load this studio."
          description={error || 'The studio details did not arrive. Check your connection and try again.'}
          action={
            <Button onClick={() => setReloadKey((key) => key + 1)}>
              <Loader2 className="h-4 w-4" />
              Try again
            </Button>
          }
        />
      </div>
    );
  }

  const related = data.related.filter((item) => item.id !== studio.id).slice(0, 3);

  return (
    <>
      <div className="container pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-muted">
          <Link href="/" className="transition hover:text-ink">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/studios" className="transition hover:text-ink">
            Studios
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/studios?category=${encodeURIComponent(studio.category)}`}
            className="transition hover:text-ink"
          >
            {studio.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-ink">{studio.title}</span>
        </nav>
      </div>

      <section className="container pt-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{studio.category}</Badge>
              <Badge variant="neutral">
                <BadgeCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                Host-verified listing
              </Badge>
            </div>
            <h1 className="mt-3.5 font-display text-[2.35rem] leading-[1.02] tracking-[-0.03em] text-ink sm:text-[3.1rem]">
              {studio.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <StarRating rating={studio.rating} count={studio.reviewCount} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-accent" />
                {studio.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-accent" />
                Up to {studio.capacity} people
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void share()}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              variant={saved ? 'soft' : 'outline'}
              size="sm"
              onClick={() => void saveStudio()}
              disabled={saving}
              aria-pressed={saved}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Heart className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
              )}
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <StudioGallery images={images} title={studio.title} />
        </div>
      </section>

      <section className="container py-10 sm:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1.6fr_0.85fr] lg:gap-12">
          <div className="min-w-0 space-y-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="eyebrow">The space</span>
                <span className="h-px w-8 bg-line" />
              </div>
              <h2 className="mt-3 font-display text-[1.9rem] tracking-[-0.025em] text-ink">
                About this room
              </h2>
              <p className="mt-4 whitespace-pre-line text-[0.92rem] leading-[1.8] text-muted">
                {studio.overview}
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  { icon: Users, label: 'Capacity', value: `${studio.capacity} people` },
                  { icon: Clock3, label: 'Minimum', value: '1 hour' },
                  {
                    icon: ShieldCheck,
                    label: 'Deposit',
                    value:
                      studio.securityDeposit > 0
                        ? formatCurrency(studio.securityDeposit)
                        : 'None',
                  },
                  { icon: CalendarDays, label: 'Booking', value: 'Host approval' },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-xl border border-line bg-surface px-4 py-3.5"
                  >
                    <fact.icon className="h-4 w-4 text-accent" strokeWidth={1.7} />
                    <dt className="mt-2.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-[0.82rem] font-semibold text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-line pt-9">
              <div className="flex items-center gap-3">
                <span className="eyebrow">In the room</span>
                <span className="h-px w-8 bg-line" />
              </div>
              <h2 className="mt-3 font-display text-[1.9rem] tracking-[-0.025em] text-ink">
                What&apos;s included
              </h2>
              {studio.amenities.length > 0 ? (
                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {studio.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2.5 border-b border-line/70 py-2 text-[0.88rem] text-ink"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  The host has not listed amenities yet — ask about gear when you request a
                  session.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar src={studio.ownerPhoto} name={studio.ownerName} size="xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl text-ink">Hosted by {studio.ownerName}</h2>
                    <Badge variant="outline">Host</Badge>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Every request is read and approved by the host. Contact details and arrival
                    notes arrive with your confirmation.
                  </p>
                </div>
                <div className="shrink-0 rounded-xl border border-line bg-canvas px-4 py-3 text-center">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-muted">
                    Listed
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {new Date(studio.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            <ReviewSection studio={studio} />
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-line bg-surface p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <p>
                  <span className="font-display text-[2.1rem] leading-none text-ink">
                    {formatCurrency(studio.hourlyRate)}
                  </span>
                  <span className="text-sm text-muted"> / hour</span>
                </p>
                <StarRating rating={studio.rating} count={studio.reviewCount} />
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-line text-[0.8rem]">
                {[
                  { label: 'Capacity', value: `${studio.capacity} people` },
                  { label: 'Category', value: studio.category },
                  { label: 'Location', value: studio.location },
                  {
                    label: 'Security deposit',
                    value:
                      studio.securityDeposit > 0
                        ? formatCurrency(studio.securityDeposit)
                        : 'Not required',
                  },
                ].map((row, index) => (
                  <div
                    key={row.label}
                    className={cn(
                      'flex items-center justify-between gap-4 px-4 py-3',
                      index !== 0 && 'border-t border-line',
                    )}
                  >
                    <span className="text-muted">{row.label}</span>
                    <span className="truncate text-right font-medium text-ink">{row.value}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-5 w-full" size="lg" onClick={startBooking} disabled={authLoading}>
                {authLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isOwner ? (
                  'Manage your listing'
                ) : user ? (
                  'Request to book'
                ) : (
                  'Sign in to book'
                )}
              </Button>
              <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-muted">
                You won&apos;t be charged yet. The host confirms before anything is locked in.
              </p>

              {isOwner && (
                <Link
                  href={`/studios/edit/${studio.id}`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'mt-2 w-full',
                  })}
                >
                  Edit this listing
                </Link>
              )}

              <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-[0.72rem] leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Confirmed bookings lock the calendar. A second crew cannot book the same hours.
              </div>
            </div>

            <div className="mt-3 rounded-[1.25rem] border border-dashed border-line p-4 text-[0.72rem] leading-relaxed text-muted">
              <p className="font-semibold text-ink">Good to know</p>
              <p className="mt-1">
                A 5% service fee is added at checkout. Cancel a pending request at any time from My
                bookings.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface/50">
          <div className="container py-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Keep looking</span>
                <h2 className="mt-3 font-display text-[2rem] tracking-[-0.025em] text-ink">
                  More {studio.category.toLowerCase()}s nearby
                </h2>
              </div>
              <Link
                href={`/studios?category=${encodeURIComponent(studio.category)}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                See all
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StudioCard key={item.id} studio={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BookingDialog studio={studio} open={bookingOpen} onOpenChange={setBookingOpen} />
    </>
  );
}
