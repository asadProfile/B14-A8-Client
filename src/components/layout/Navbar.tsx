'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { buttonVariants } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/85 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/70">
      <div className="container flex h-[4.6rem] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-[0.84rem] font-semibold transition-colors',
                  active ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300',
                    active ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-[0.84rem] font-semibold text-ink transition hover:text-accent"
              >
                Log in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: 'sm' }), 'px-5')}>
                Get started
              </Link>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
