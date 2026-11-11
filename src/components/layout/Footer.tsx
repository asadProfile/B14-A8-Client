'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/Logo';
import { InstagramLogo, XLogo, YoutubeLogo } from '@/components/brand/SocialIcons';
import { CATEGORY_CARDS, SITE } from '@/lib/constants';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const EXPLORE_LINKS = [
  { href: '/studios', label: 'Explore studios' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About StudioSpace' },
  { href: '/add-studio', label: 'Host your space' },
  { href: '/my-bookings', label: 'My bookings' },
];

const HOSTING_LINKS = [
  { href: '/add-studio', label: 'Add a listing' },
  { href: '/my-listings', label: 'Manage listings' },
  { href: '/dashboard', label: 'Host dashboard' },
  { href: '/wishlist', label: 'Saved studios' },
  { href: '/register', label: 'Create an account' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error('Add your email so we know where to send the good stuff.');
      return;
    }
    setSubscribing(true);
    // Demo newsletter: validates locally and confirms with a toast.
    window.setTimeout(() => {
      setSubscribing(false);
      setEmail('');
      toast.success("You're on the list.", {
        description: 'New spaces and host tips, once a month. No noise.',
      });
    }, 500);
  };

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Space to make. Time to create. StudioSpace connects creators with the rooms, stages
              and quiet corners that turn an idea into the work.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={SITE.x}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on X"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <XLogo className="h-3.5 w-3.5" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <InstagramLogo className="h-4 w-4" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="StudioSpace on YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-accent/40 hover:text-accent"
              >
                <YoutubeLogo className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Spaces</p>
            <ul className="mt-4 space-y-2.5">
              {CATEGORY_CARDS.map((category) => (
                <li key={category.name}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category.name)}`}
                    className="text-sm text-muted transition hover:text-ink"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">The dispatch</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Fresh spaces, host stories and booking tips — one considered email a month.
            </p>
            <form onSubmit={subscribe} className="mt-4">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-2 rounded-full border border-line bg-canvas p-1 pl-4 transition focus-within:border-accent/60">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted/70"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  aria-label="Subscribe to the newsletter"
                  className={cn(buttonVariants({ size: 'icon', variant: 'primary' }), 'h-9 w-9 shrink-0')}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
            <p className="mt-4 text-xs text-muted">
              Questions? <a href={`mailto:${SITE.email}`} className="link-underline text-ink">{SITE.email}</a>
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/about#terms" className="transition hover:text-ink">
                Terms & privacy
              </Link>
              <Link href="/about" className="transition hover:text-ink">
                Our mission
              </Link>
              <span className="hidden sm:inline">Made for creators, by creators.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
