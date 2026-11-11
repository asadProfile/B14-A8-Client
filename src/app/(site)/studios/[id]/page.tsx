import type { Metadata } from 'next';
import { StudioDetails } from '@/components/studio/StudioDetails';

export const metadata: Metadata = {
  title: 'Studio details',
  description:
    'View photos, amenities, host details and book this creative space by the hour on StudioSpace.',
};

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudioDetails studioId={id} />;
}
