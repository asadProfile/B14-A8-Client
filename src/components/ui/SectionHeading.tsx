import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
  inverted = false,
}: {
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        {(eyebrow || index) && (
          <div className="flex items-center gap-3">
            {index && (
              <span
                className={cn(
                  'font-display text-sm italic',
                  inverted ? 'text-white/50' : 'text-accent',
                )}
              >
                {index}
              </span>
            )}
            <span className={cn('h-px w-8', inverted ? 'bg-white/25' : 'bg-line')} />
            {eyebrow && (
              <span className={cn('eyebrow', inverted && 'text-white/60')}>{eyebrow}</span>
            )}
          </div>
        )}
        <h2
          className={cn(
            'mt-4 font-display text-[2.15rem] leading-[1.02] tracking-[-0.03em] sm:text-[2.75rem] md:text-[3.1rem]',
            inverted ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-4 max-w-xl text-[0.95rem] leading-relaxed',
              inverted ? 'text-white/65' : 'text-muted',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            'group inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition',
            inverted ? 'text-white hover:text-white/80' : 'text-ink hover:text-accent',
          )}
        >
          {actionLabel}
          <span
            className={cn(
              'grid h-8 w-8 place-items-center rounded-full border transition group-hover:rotate-45',
              inverted ? 'border-white/25' : 'border-line',
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      )}
    </div>
  );
}
