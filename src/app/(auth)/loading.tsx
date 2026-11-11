import { Skeleton } from '@/components/ui/Skeleton';

export default function AuthLoading() {
  return (
    <div className="container grid w-full flex-1 items-stretch gap-6 py-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-8">
      <Skeleton className="hidden min-h-[36rem] rounded-[1.75rem] lg:block" />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-4" role="status" aria-live="polite">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-11 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-4 h-11 w-full rounded-full" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-full" />
          <span className="sr-only">Loading sign-in…</span>
        </div>
      </div>
    </div>
  );
}
