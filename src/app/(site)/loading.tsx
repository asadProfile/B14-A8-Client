import { Skeleton } from '@/components/ui/Skeleton';

export default function SiteLoading() {
  return (
    <div className="container py-14" role="status" aria-live="polite">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-5 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-4 w-full max-w-md" />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="overflow-hidden rounded-[1.4rem] border border-line bg-surface">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading StudioSpace…</span>
    </div>
  );
}
