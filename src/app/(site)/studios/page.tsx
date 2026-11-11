import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExploreStudios } from '@/components/studio/ExploreStudios';
import { StudioGridSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Explore studios',
  description:
    'Browse peer-to-peer photo studios, sound stages, podcast rooms, music suites and workshops by the hour.',
};

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-16">
          <div className="h-8 w-52 animate-pulse rounded-full bg-elevated" />
          <div className="mt-8">
            <StudioGridSkeleton count={9} />
          </div>
        </div>
      }
    >
      <ExploreStudios />
    </Suspense>
  );
}
