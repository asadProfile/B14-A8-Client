import Link from 'next/link';
import { Aperture, ArrowLeft, ArrowUpRight, Compass, Search } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { buttonVariants } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const quickLinks = [
  { href: '/studios', label: 'Explore studios' },
  { href: '/how-it-works', label: 'How booking works' },
  { href: '/my-bookings', label: 'My bookings' },
  { href: '/about', label: 'About StudioSpace' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="hidden items-center gap-2 text-[0.82rem] font-semibold text-muted transition hover:text-ink sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </header>

      <main id="main-content" className="container flex flex-1 items-center py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="font-display text-sm italic text-accent">Error 404</span>
              <span className="h-px w-8 bg-line" />
              <span className="eyebrow">Off the floor plan</span>
            </div>
            <p className="mt-5 font-display text-[5.5rem] leading-[0.8] tracking-[-0.06em] text-ink sm:text-[7rem]">
              4<span className="italic text-accent">0</span>4
            </p>
            <h1 className="mt-5 font-display text-[2rem] leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              This room isn’t on the floor plan.
            </h1>
            <p className="mt-3 max-w-md text-[0.92rem] leading-relaxed text-muted">
              The page you were looking for may have moved, or the link was never quite right. The
              studio directory is still open — and the light is good.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                <ArrowLeft className="h-4 w-4" />
                Back to the studio floor
              </Link>
              <Link href="/studios" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                <Search className="h-4 w-4" />
                Browse studios
              </Link>
            </div>

            <div className="mt-9 border-t border-line pt-5">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
                Popular doors
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-[0.8rem] font-medium text-muted transition hover:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block" aria-hidden>
            <div className="absolute inset-0 rounded-full border border-line" />
            <div className="absolute inset-[9%] rounded-full border border-line/80" />
            <div className="absolute inset-[20%] rounded-full border border-line/60" />
            <div className="absolute inset-[31%] rounded-full border border-dashed border-accent/30" />
            <div className="absolute inset-[40%] grid place-items-center rounded-full bg-accent text-accent-ink shadow-lift">
              <Aperture className="h-12 w-12 animate-spin-slow" strokeWidth={1.1} />
            </div>
            <span className="absolute left-[6%] top-[26%] grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-muted">
              <Compass className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div className="absolute bottom-[7%] right-[4%] rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted">
                Directory status
              </p>
              <p className="mt-1 flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                14 rooms still live
              </p>
            </div>
            <span className="absolute right-[12%] top-[8%] font-display text-sm italic text-accent">
              no. 404
            </span>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="container flex flex-col gap-2 py-5 text-[0.7rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>Space to make. Time to create.</p>
        </div>
      </footer>
    </div>
  );
}
