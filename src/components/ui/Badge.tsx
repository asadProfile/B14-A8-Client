import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';
import { statusDot, statusStyles } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]',
  {
    variants: {
      variant: {
        neutral: 'border-line bg-surface/80 text-muted',
        accent: 'border-accent/20 bg-accent-soft text-accent',
        outline: 'border-line bg-transparent text-ink',
        glass: 'border-white/25 bg-black/25 text-white backdrop-blur-md',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export function Badge({
  className,
  variant,
  children,
}: VariantProps<typeof badgeVariants> & { className?: string; children: React.ReactNode }) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em]',
        statusStyles[status],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', statusDot[status])} aria-hidden />
      {status}
    </span>
  );
}
