import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { EditStudioView } from '@/components/studio/EditStudioView';

export const metadata: Metadata = {
  title: 'Edit studio',
  description: 'Update your StudioSpace listing details, rate and photos.',
};

export default async function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProtectedRoute>
      <EditStudioView studioId={id} />
    </ProtectedRoute>
  );
}
