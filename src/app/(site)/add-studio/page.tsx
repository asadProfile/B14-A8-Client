import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { StudioForm } from '@/components/studio/StudioForm';

export const metadata: Metadata = {
  title: 'Add a studio',
  description: 'List your photo studio, stage, podcast room or workshop on StudioSpace.',
};

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <section className="container py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm italic text-accent">Hosting</span>
            <span className="h-px w-8 bg-line" />
            <span className="eyebrow">List your space</span>
          </div>
          <h1 className="mt-4 font-display text-[2.5rem] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[3.2rem]">
            Put your room <em className="italic text-accent">to work.</em>
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            Describe the space honestly, set your rate and publish. Requests land in your dashboard
            — you decide which ones become bookings.
          </p>
        </div>

        <div className="mt-9">
          <StudioForm mode="create" />
        </div>
      </section>
    </ProtectedRoute>
  );
}
