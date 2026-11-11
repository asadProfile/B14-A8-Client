'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CloudOff, LockKeyhole, Loader2, SearchX } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { StudioForm } from '@/components/studio/StudioForm';
import { useAuth } from '@/context/AuthContext';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { Studio } from '@/lib/types';

export function EditStudioView({ studioId }: { studioId: string }) {
  const { user, loading: authLoading } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    setMissing(false);
    try {
      const data = await api.studios.detail(studioId);
      setStudio(data.studio);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setMissing(true);
      else setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [studioId]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  if (authLoading || loading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-11 w-2/3 max-w-xl" />
        <Skeleton className="mt-8 h-[32rem] w-full rounded-[1.4rem]" />
      </div>
    );
  }

  if (missing) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={SearchX}
          eyebrow="Not found"
          title="That listing has left the building."
          description="It may have been removed by its host. Head back to your listings to manage the rooms you still have."
          action={
            <Link href="/my-listings" className={buttonVariants({ variant: 'primary' })}>
              <ArrowLeft className="h-4 w-4" />
              Back to my listings
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={CloudOff}
          eyebrow="Connection"
          title="We could not load this listing."
          description={error || 'The listing details did not arrive.'}
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

  if (user && studio.ownerEmail !== user.email) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={LockKeyhole}
          eyebrow="Hosts only"
          title="This listing belongs to another host."
          description="You can view the space and request it, but only its owner can edit the details, rate or photos."
          action={
            <>
              <Link href={`/studios/${studio.id}`} className={buttonVariants({ variant: 'primary' })}>
                View the listing
              </Link>
              <Link href="/my-listings" className={buttonVariants({ variant: 'outline' })}>
                My listings
              </Link>
            </>
          }
        />
      </div>
    );
  }

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            My listings
          </Link>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Editing</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">{studio.category}</span>
          </div>
          <h1 className="mt-4 font-display text-[2.2rem] leading-[1.01] tracking-[-0.03em] text-ink sm:text-[2.8rem]">
            Fine-tune <em className="italic text-accent">{studio.title}.</em>
          </h1>
          <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">
            Changes go live as soon as you save. Confirmed bookings keep the rate and details they
            were agreed at.
          </p>
        </div>
        <Link
          href={`/studios/${studio.id}`}
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'shrink-0' })}
        >
          View public page
        </Link>
      </div>

      <div className="mt-8">
        <StudioForm mode="edit" studio={studio} />
      </div>
    </section>
  );
}
