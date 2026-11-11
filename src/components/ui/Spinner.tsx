import { Aperture, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-accent', className)} aria-hidden />;
}

export function PageLoader({
  label = 'Setting the stage…',
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-5',
        compact ? 'py-16' : 'min-h-[62vh] py-24',
      )}
    >
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-ink">
        <Aperture className="h-8 w-8 animate-spin-slow" strokeWidth={1.3} />
        <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
      </span>
      <div className="text-center">
        <p className="font-display text-lg tracking-tight text-ink">Framing the shot</p>
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent [animation-delay:300ms]" />
      </div>
    </div>
  );
}
