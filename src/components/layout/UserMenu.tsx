'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { getErrorMessage } from '@/lib/utils';

const MENU_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-studio', label: 'Add New Studio', icon: PlusCircle },
  { href: '/my-listings', label: 'My Studio Listings', icon: Building2 },
  { href: '/my-bookings', label: 'My Bookings', icon: CalendarCheck },
];

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!user) return null;

  const clearClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
      toast.success('You have been signed out.');
      setOpen(false);
      router.push('/');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not sign you out. Please try again.'));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => {
            clearClose();
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
          className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 text-left transition hover:border-accent/40"
          aria-label="Open account menu"
        >
          <Avatar src={user.photoURL} name={user.name} size="sm" />
          <span className="hidden max-w-[7.5rem] truncate text-[0.82rem] font-semibold text-ink xl:block">
            {user.name.split(' ')[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseEnter={clearClose}
        onMouseLeave={scheduleClose}
        className="w-[17rem]"
      >
        <div className="flex items-center gap-3 rounded-xl bg-elevated/60 px-3 py-3">
          <Avatar src={user.photoURL} name={user.name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} onClick={() => setOpen(false)}>
                <Icon className="h-4 w-4 text-muted" strokeWidth={1.8} />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            if (!signingOut) void handleLogout();
          }}
          className="text-rose-600 focus:text-rose-600 dark:text-rose-400 dark:focus:text-rose-400"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          {signingOut ? 'Signing out…' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
