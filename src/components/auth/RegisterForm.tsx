'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';
import { Skeleton } from '@/components/ui/Skeleton';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { PasswordField } from '@/components/auth/PasswordField';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { getErrorMessage, safeRedirect } from '@/lib/utils';

function AuthSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-11 w-3/4" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-8 h-11 w-full rounded-full" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, register, login } = useAuth();

  const redirectParam = searchParams.get('redirect');
  const destination = useMemo(() => {
    const target = safeRedirect(redirectParam, '/dashboard');
    if (target.startsWith('/login') || target.startsWith('/register')) return '/dashboard';
    return target;
  }, [redirectParam]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && user) router.replace(destination);
  }, [loading, user, destination, router]);

  if (loading) return <AuthSkeleton />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setFieldErrors({});

    const localErrors: Record<string, string> = {};
    if (name.trim().length < 2) localErrors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      localErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 6) localErrors.password = 'Use at least 6 characters.';
    else if (!/[A-Z]/.test(password)) localErrors.password = 'Include an uppercase letter.';
    else if (!/[a-z]/.test(password)) localErrors.password = 'Include a lowercase letter.';
    if (confirmPassword !== password) localErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setFormError('Check the highlighted fields and try again.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        photoURL: photoURL.trim() || undefined,
        password,
      });

      try {
        const session = await login({ email: email.trim(), password });
        toast.success('Your StudioSpace account is ready.', {
          description: `Welcome, ${session.user.name.split(' ')[0]}. Start with a space or list your own.`,
        });
        router.replace(destination);
        router.refresh();
      } catch {
        toast.success('Account created.', {
          description: 'Sign in with your new email and password to continue.',
        });
        router.replace(
          `/login?email=${encodeURIComponent(email.trim())}&redirect=${encodeURIComponent(destination)}`,
        );
      }
    } catch (err) {
      const message = getErrorMessage(err, 'Could not create your account.');
      setFormError(message);
      if (err instanceof ApiError && err.details) {
        setFieldErrors(
          Object.fromEntries(err.details.map((issue) => [issue.field, issue.message])),
        );
      }
      toast.error('Account not created', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md py-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm italic text-accent">02</span>
        <span className="h-px w-8 bg-line" />
        <span className="eyebrow">Join the studio floor</span>
      </div>
      <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[2.9rem]">
        Make room for <em className="italic text-accent">the work.</em>
      </h1>
      <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-muted">
        One account for booking spaces, saving the shortlist and managing the rooms you host.
      </p>

      <div className="mt-7">
        <GoogleButton redirectTo={destination} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted">
          or create one with email
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" htmlFor="register-name" required error={fieldErrors.name}>
          <Input
            id="register-name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(fieldErrors.name)}
            required
          />
        </Field>

        <Field label="Email address" htmlFor="register-email" required error={fieldErrors.email}>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@studio.com"
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
        </Field>

        <Field
          label="Profile photo URL"
          htmlFor="register-photo"
          error={fieldErrors.photoURL}
          hint="Optional. Leave blank and we will use your initials."
        >
          <Input
            id="register-photo"
            type="url"
            autoComplete="photo"
            value={photoURL}
            onChange={(event) => setPhotoURL(event.target.value)}
            placeholder="https://…"
            aria-invalid={Boolean(fieldErrors.photoURL)}
          />
        </Field>

        <PasswordField
          id="register-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
          showChecklist
        />

        <PasswordField
          id="register-confirm"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        {formError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300"
          >
            {formError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Creating your account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[0.82rem] text-muted">
        Already have an account?{' '}
        <Link
          href={`/login?redirect=${encodeURIComponent(destination)}`}
          className="font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-6 text-center text-[0.68rem] leading-relaxed text-muted">
        By creating an account you agree to the{' '}
        <Link href="/about#terms" className="text-ink underline-offset-4 hover:underline">
          terms & privacy notes
        </Link>
        . We never post or book anything without you.
      </p>
    </div>
  );
}
