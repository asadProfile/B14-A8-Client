import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
      />
      <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-line bg-canvas text-accent">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      {eyebrow && <p className="eyebrow relative mt-6">{eyebrow}</p>}
      <h3 className="relative mt-2 font-display text-2xl tracking-tight text-ink">{title}</h3>
      <p className="relative mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action && <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">{action}</div>}
    </div>
  );
}
