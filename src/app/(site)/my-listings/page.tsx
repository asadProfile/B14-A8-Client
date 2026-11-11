import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { MyListings } from '@/components/studio/MyListings';

export const metadata: Metadata = {
  title: 'My studio listings',
  description: 'Manage the creative spaces you host on StudioSpace.',
};

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListings />
    </ProtectedRoute>
  );
}
