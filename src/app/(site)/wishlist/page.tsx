import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { WishlistView } from '@/components/studio/WishlistView';

export const metadata: Metadata = {
  title: 'Saved studios',
  description: 'The StudioSpace rooms you have saved for later.',
};

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistView />
    </ProtectedRoute>
  );
}
