'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowUpRight, Heart, MapPin, Star, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, getErrorMessage } from '@/lib/utils';
import type { Studio } from '@/lib/types';
import { cn } from '@/lib/utils';

export function StudioCard({
  studio,
  className,
  showWishlist = true,
}: {
  studio: Studio;
  className?: string;
  showWishlist?: boolean;
}) {
  const { toggleWishlist, isSaved } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const saved = isSaved(studio.id);

  const handleSave = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      try {
        const result = await toggleWishlist(studio.id);
        if (result.requiresAuth) {
          toast.info('Sign in to save studios', {
            description: 'Your wishlist follows you across devices.',
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
      } catch (error) {
        toast.error('Could not update your wishlist', {
          description: getErrorMessage(error),
        });
      }
    });
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <Link
        href={`/studios/${studio.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-canvas"
        aria-label={`View ${studio.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.imageURL}
          alt={`${studio.title} in ${studio.location}`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <span className="absolute left-3.5 top-3.5 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          {studio.category}
        </span>
        <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[0.68rem] font-medium text-white/90 backdrop-blur-md">
          <MapPin className="h-3 w-3" />
          {studio.location}
        </span>
      </Link>

      {showWishlist && (
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          aria-label={saved ? `Remove ${studio.title} from wishlist` : `Save ${studio.title} to wishlist`}
          aria-pressed={saved}
          className={cn(
            'absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md transition',
            saved
              ? 'border-accent/50 bg-accent text-white'
              : 'border-white/25 bg-black/30 text-white hover:bg-black/50',
            pending && 'opacity-60',
          )}
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {studio.rating > 0 ? studio.rating.toFixed(1) : 'New'}
            {studio.reviewCount > 0 && (
              <span className="font-normal text-muted">({studio.reviewCount})</span>
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {studio.capacity} people
          </span>
        </div>

        <h3 className="mt-3 font-display text-[1.35rem] leading-snug tracking-[-0.02em] text-ink">
          <Link href={`/studios/${studio.id}`} className="transition hover:text-accent">
            {studio.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.83rem] leading-relaxed text-muted">
          {studio.overview}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-sm text-muted">
            <span className="font-display text-xl text-ink">{formatCurrency(studio.hourlyRate)}</span>
            <span className="text-xs"> / hour</span>
          </p>
          <Link
            href={`/studios/${studio.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-accent/50 hover:text-accent"
          >
            View space
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
