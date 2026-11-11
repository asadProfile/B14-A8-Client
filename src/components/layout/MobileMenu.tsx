'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ArrowUpRight,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/brand/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { Button, buttonVariants } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { cn, getErrorMessage } from '@/lib/utils';

const ACCOUNT_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-studio', label: 'Add a studio', icon: PlusCircle },
  { href: '/my-bookings', label: 'My bookings', icon: CalendarCheck },
];

export function MobileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      toast.success('You have been signed out.');
      close();
      router.push('/');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not sign you out.'));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-accent/50 lg:hidden"
        >
          <Menu className="h-[1.15rem] w-[1.15rem]" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[85] bg-[#0b0906]/65 backdrop-blur-sm data-[state=open]:animate-fade-in lg:hidden" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-[86] flex w-[min(92vw,26rem)] flex-col overflow-y-auto border-l border-line bg-canvas px-6 pb-8 pt-5 shadow-2xl data-[state=open]:animate-slide-in lg:hidden"
        >
          <DialogPrimitive.Title className="sr-only">StudioSpace navigation</DialogPrimitive.Title>
          <div className="flex items-center justify-between">
            <div onClick={close}>
              <Logo />
            </div>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <nav className="mt-10 flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="group flex items-center justify-between border-b border-line/70 py-4"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[0.62rem] font-bold tracking-[0.18em] text-muted">
                    0{index + 1}
                  </span>
                  <span className="font-display text-[1.65rem] tracking-tight text-ink transition group-hover:text-accent">
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                  <Avatar src={user.photoURL} name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-1.5">
                  {ACCOUNT_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-elevated"
                      >
                        <Icon className="h-4 w-4 text-muted" strokeWidth={1.8} />
                        {item.label}
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-elevated disabled:opacity-50 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    {signingOut ? 'Signing out…' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <div className="grid gap-2.5">
                <Link href="/register" onClick={close} className={cn(buttonVariants({ size: 'lg' }))}>
                  Create an account
                </Link>
                <Link
                  href="/login"
                  onClick={close}
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>

          <p className="mt-auto pt-10 text-xs leading-relaxed text-muted">
            Studios, stages and rooms by the hour.
            <br />
            Brooklyn · Manhattan · Queens · Jersey City
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
