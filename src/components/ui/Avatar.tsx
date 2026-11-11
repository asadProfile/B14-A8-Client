'use client';

import { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';

const sizeMap = {
  sm: 'h-8 w-8 text-[0.65rem]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-sm',
  xl: 'h-20 w-20 text-lg',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
}: {
  src?: string;
  name: string;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          'grid shrink-0 place-items-center rounded-full border border-line bg-elevated font-bold tracking-wide text-ink',
          sizeMap[size],
          className,
        )}
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full border border-line object-cover', sizeMap[size], className)}
      loading="lazy"
    />
  );
}
