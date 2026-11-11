import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthAside } from '@/components/auth/AuthAside';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to StudioSpace to book creative spaces and manage your listings.',
};

export default function LoginPage() {
  return (
    <div className="container grid w-full flex-1 items-stretch gap-6 py-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-8">
      <AuthAside />
      <div className="flex items-center justify-center">
        <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-elevated/60" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
