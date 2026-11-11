import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthAside } from '@/components/auth/AuthAside';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Join StudioSpace to book creative spaces and host your own.',
};

export default function RegisterPage() {
  return (
    <div className="container grid w-full flex-1 items-stretch gap-6 py-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-8">
      <AuthAside />
      <div className="flex items-center justify-center">
        <Suspense fallback={<div className="h-[32rem] w-full max-w-md animate-pulse rounded-3xl bg-elevated/60" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
