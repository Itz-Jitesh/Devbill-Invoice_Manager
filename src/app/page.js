import { redirect } from 'next/navigation';

/**
 * Root page — redirect visitors to the dashboard.
 * Server Component: can use redirect() directly.
 * Equivalent to: <Route path="/" element={<Navigate to="/dashboard" replace />} />
 */
export default function RootPage() {
  redirect('/dashboard');
}
