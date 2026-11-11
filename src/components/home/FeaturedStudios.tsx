'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StudioCard } from '@/components/studio/StudioCard';
import { StudioGridSkeleton } from '@/components/ui/Skeleton';
import { buttonVariants } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Studio } from '@/lib/types';
import { getErrorMessage } from '@/lib/utils';

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.studios.featured();
      setStudios(data.studios);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="container py-16 sm:py-20" aria-labelledby="featured-heading">
      <SectionHeading
        index="01"
        eyebrow="The shortlist"
        title={
          <span id="featured-heading">
            Six rooms <em className="italic text-accent">worth booking.</em>
          </span>
        }
        description="A rotating edit of the highest-rated spaces on StudioSpace — reviewed by the people who actually shot, recorded and rehearsed in them."
        actionLabel="Explore all studios"
        actionHref="/studios"
      />

      <div className="mt-10">
        {loading && <StudioGridSkeleton count={6} />}

        {!loading && error && (
          <div className="rounded-3xl border border-line bg-surface p-10 text-center">
            <p className="font-display text-2xl text-ink">The shortlist is hiding.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className={buttonVariants({ variant: 'outline', className: 'mt-6' })}
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && studios.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-display text-2xl text-ink">No studios are featured yet.</p>
            <p className="mt-2 text-sm text-muted">
              New spaces go live every week. Browse everything while you wait.
            </p>
            <Link
              href="/studios"
              className={buttonVariants({ variant: 'primary', className: 'mt-6' })}
            >
              Explore studios
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {studios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
