'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/Spinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (loading || user) return;
    setRedirecting(true);
    const target = `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`;
    router.replace(`/login?redirect=${encodeURIComponent(target)}`);
  }, [loading, user, pathname, router]);

  // Crucial for reloads on private routes: never redirect while the session
  // cookie is still being checked.
  if (loading) return <PageLoader label="Checking your studio access…" />;
  if (!user || redirecting) return <PageLoader label="Taking you to sign in…" />;

  return <>{children}</>;
}
