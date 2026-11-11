import Link from 'next/link';
import { ArrowUpRight, MoveUpRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function ClosingCta() {
  return (
    <section className="container pt-16 sm:pt-20" aria-labelledby="closing-cta-heading">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-canvas px-6 py-14 text-center sm:rounded-[2.25rem] sm:px-10 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgb(var(--ink))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--ink))_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow">Your next session</p>
          <h2
            id="closing-cta-heading"
            className="mt-5 font-display text-[2.4rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.6rem]"
          >
            The room is out there.
            <br />
            <em className="italic text-accent">Go make the work.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[0.93rem] leading-relaxed text-muted">
            Book by the hour, host on your terms, and keep every confirmation, invoice and review
            in one calm place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/studios" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              Find a studio
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
            <Link
              href="/add-studio"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              List your space
              <MoveUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Free to browse · No listing fees · Cancel pending requests anytime
          </p>
        </div>
      </div>
    </section>
  );
}
