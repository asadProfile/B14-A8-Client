import Link from 'next/link';
import { Aperture } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  markOnly = false,
  href = '/',
}: {
  className?: string;
  markOnly?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="StudioSpace home"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span className="grid h-10 w-10 place-items-center rounded-[0.85rem] bg-accent text-accent-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-transform duration-500 group-hover:rotate-45">
        <Aperture className="h-5 w-5" strokeWidth={1.7} />
      </span>
      {!markOnly && (
        <span className="font-display text-[1.38rem] leading-none tracking-[-0.03em] text-ink">
          Studio<span className="italic text-accent">Space</span>
        </span>
      )}
    </Link>
  );
}
