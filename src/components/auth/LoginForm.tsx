'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';
import { Skeleton } from '@/components/ui/Skeleton';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { PasswordField } from '@/components/auth/PasswordField';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { getErrorMessage, safeRedirect } from '@/lib/utils';

const GOOGLE_ERRORS: Record<string, string> = {
  google_not_configured:
    'Google sign-in is not configured on this deployment. Use your email and password, or add the Google OAuth keys to the server environment.',
  google_state_mismatch: 'That Google sign-in link was interrupted. Please try again.',
  google_state_expired: 'That Google sign-in link expired. Please try again.',
  google_failed: 'Google could not complete the sign-in. Please try again with email and password.',
};

function AuthSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-11 w-3/4" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-8 h-11 w-full rounded-full" />
      <Skeleton className="mt-6 h-11 w-full rounded-xl" />
      <Skeleton className="mt-4 h-11 w-full rounded-xl" />
      <Skeleton className="mt-4 h-12 w-full rounded-full" />
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();

  const redirectParam = searchParams.get('redirect');
  const destination = useMemo(() => {
    const target = safeRedirect(redirectParam, '/dashboard');
    if (target.startsWith('/login') || target.startsWith('/register')) return '/dashboard';
    return target;
  }, [redirectParam]);

  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const shownError = useRef<string | null>(null);

  const errorParam = searchParams.get('error');
  useEffect(() => {
    if (!errorParam || shownError.current === errorParam) return;
    shownError.current = errorParam;
    const message =
      GOOGLE_ERRORS[errorParam] ?? 'That sign-in attempt did not complete. Please try again.';
    setNotice(message);
    toast.error('Google sign-in incomplete', { description: message });
  }, [errorParam]);

  useEffect(() => {
    if (!loading && user) router.replace(destination);
  }, [loading, user, destination, router]);

  if (loading) return <AuthSkeleton />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      const result = await login({ email: email.trim(), password });
      toast.success(result.message, {
        description: 'Your saved studios and bookings are ready.',
      });
      router.replace(destination);
      router.refresh();
    } catch (err) {
      const message = getErrorMessage(err, 'Could not sign you in.');
      setFormError(message);
      if (err instanceof ApiError && err.details) {
        setFieldErrors(
          Object.fromEntries(err.details.map((issue) => [issue.field, issue.message])),
        );
      }
      toast.error('Sign-in failed', { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail('examiner@studiosspace.com');
    setPassword('Studio123');
    setFormError('');
    setFieldErrors({});
    toast.info('Examiner credentials filled', {
      description: 'Press “Sign in” to enter the demo workspace.',
    });
  };

  return (
    <div className="w-full max-w-md py-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm italic text-accent">01</span>
        <span className="h-px w-8 bg-line" />
        <span className="eyebrow">Welcome back</span>
      </div>
      <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[2.9rem]">
        Back to <em className="italic text-accent">the work.</em>
      </h1>
      <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-muted">
        Sign in to request rooms, keep track of host replies and pick up where your saved spaces
        left off.
      </p>

      {notice && (
        <div className="relative mt-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 pr-9">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[0.78rem] leading-relaxed text-amber-800 dark:text-amber-200">
            {notice}
          </p>
          <button
            type="button"
            onClick={() => setNotice('')}
            aria-label="Dismiss notice"
            className="absolute right-3 top-3 text-amber-700/70 hover:text-amber-800 dark:text-amber-300/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-7">
        <GoogleButton redirectTo={destination} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted">
          or with email
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email address" htmlFor="login-email" required error={fieldErrors.email}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@studio.com"
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
        </Field>

        <PasswordField
          id="login-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
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
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[0.82rem] text-muted">
        New to StudioSpace?{' '}
        <Link
          href={`/register?redirect=${encodeURIComponent(destination)}`}
          className="font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-7 rounded-xl border border-dashed border-line bg-canvas p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">
            Examiner demo
          </p>
          <button
            type="button"
            onClick={fillDemo}
            className="text-[0.7rem] font-semibold text-accent underline-offset-4 hover:underline"
          >
            Fill credentials
          </button>
        </div>
        <div className="mt-2 space-y-1 text-[0.75rem] text-muted">
          <p>
            <span className="text-ink">Creator:</span> examiner@studiosspace.com · Studio123
          </p>
          <p>
            <span className="text-ink">Host:</span> host@studiosspace.com · Studio123
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-[0.68rem] leading-relaxed text-muted">
        By signing in you agree to the{' '}
        <Link href="/about#terms" className="text-ink underline-offset-4 hover:underline">
          terms & privacy notes
        </Link>
        .
      </p>
    </div>
  );
}
