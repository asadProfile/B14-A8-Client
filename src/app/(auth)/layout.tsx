import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-2 text-[0.84rem] font-semibold text-muted transition hover:text-ink sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the studio floor
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main id="main-content" className="flex flex-1">
        {children}
      </main>
    </div>
  );
}
