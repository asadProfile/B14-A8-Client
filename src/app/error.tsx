'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button, buttonVariants } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[studiosspace]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <ThemeToggle />
      </header>

      <main id="main-content" className="container flex flex-1 items-center py-12">
        <div className="mx-auto w-full max-w-xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface text-accent">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="font-display text-sm italic text-accent">Take two</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">Something went sideways</span>
          </div>
          <h1 className="mt-4 font-display text-[2.3rem] leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3rem]">
            The shot didn’t <em className="italic text-accent">land.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-muted">
            An unexpected error interrupted this page. Your account and bookings are safe — try the
            scene again, or head back to the studio floor.
          </p>
          {error.digest && (
            <p className="mt-3 text-[0.68rem] text-muted">
              Reference: <span className="font-mono text-ink">{error.digest}</span>
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Button size="lg" onClick={reset}>
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
            <Link href="/" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
          <p className="mt-6 text-[0.72rem] text-muted">
            Still stuck? Email{' '}
            <a href="mailto:hello@studiosspace.com" className="font-semibold text-ink underline-offset-4 hover:underline">
              hello@studiosspace.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
