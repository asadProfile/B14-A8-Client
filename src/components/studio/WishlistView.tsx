'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CloudOff, Heart, Search } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StudioGridSkeleton } from '@/components/ui/Skeleton';
import { StudioCard } from '@/components/studio/StudioCard';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import type { Studio } from '@/lib/types';

export function WishlistView() {
  const { wishlist } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.wishlist
      .list()
      .then((data) => {
        if (active) setStudios(data.studios);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const visible = useMemo(
    () => studios.filter((studio) => wishlist.includes(studio.id)),
    [studios, wishlist],
  );

  return (
    <section className="container py-10 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Your shortlist</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">Saved spaces</span>
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.2rem]">
            Rooms worth <em className="italic text-accent">coming back to.</em>
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            Your wishlist is private to your account. Tap the heart on any listing to add it here,
            then request the hours when the idea is ready.
          </p>
        </div>
        <Link href="/studios" className={buttonVariants({ variant: 'outline' })}>
          <Search className="h-4 w-4" />
          Browse the directory
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <StudioGridSkeleton count={3} />
        ) : error ? (
          <EmptyState
            icon={CloudOff}
            eyebrow="Connection"
            title="Your wishlist did not load."
            description={error}
            action={
              <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                Try again
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Heart}
            eyebrow={studios.length > 0 ? 'All clear' : 'Nothing saved yet'}
            title={studios.length > 0 ? 'Your shortlist is empty.' : 'Start a shortlist.'}
            description="When a room catches your eye, tap the heart on its card. It stays here while you compare rates, light and locations."
            action={
              <Link href="/studios" className={buttonVariants({ variant: 'primary' })}>
                Find your first space
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <>
            <div className="mb-5 flex items-center gap-2 text-sm text-muted">
              <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
              <span>
                <span className="font-semibold text-ink">{visible.length}</span>{' '}
                {visible.length === 1 ? 'space' : 'spaces'} saved
              </span>
              <span className="text-xs">Tap a heart to remove one.</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visible.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
