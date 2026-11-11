import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { MyBookings } from '@/components/booking/MyBookings';

export const metadata: Metadata = {
  title: 'My bookings',
  description: 'Track your StudioSpace requests, confirmed sessions and invoices.',
};

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  );
}
