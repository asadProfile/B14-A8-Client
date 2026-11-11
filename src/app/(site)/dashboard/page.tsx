import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Dashboard } from '@/components/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your StudioSpace host inbox, listings and upcoming sessions.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
