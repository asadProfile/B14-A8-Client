'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

export function StarRating({
  rating,
  count,
  showValue = true,
  className,
  size = 'sm',
}: {
  rating: number;
  count?: number;
  showValue?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      aria-label={`Rated ${rating || 0} out of 5${count ? ` from ${count} reviews` : ''}`}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              sizeClass,
              value <= Math.round(rating)
                ? 'fill-star text-star'
                : 'fill-transparent text-line',
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        ))}
      </div>
      {showValue && (
        <span className="text-[0.78rem] font-semibold text-ink">
          {rating > 0 ? rating.toFixed(1) : 'New'}
          {typeof count === 'number' && (
            <span className="ml-1 font-normal text-muted">({formatNumber(count)})</span>
          )}
        </span>
      )}
    </div>
  );
}

export function RatingInput({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label="Your rating"
      className={cn('flex items-center gap-1.5', className)}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          className="rounded-full p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              star <= active ? 'fill-star text-star' : 'fill-transparent text-line',
            )}
            strokeWidth={1.5}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-muted">
        {value ? `${value}/5` : 'Tap to rate'}
      </span>
    </div>
  );
}
