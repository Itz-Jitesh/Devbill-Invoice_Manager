import AuthLayout from '@/components/layout/AuthLayout';

/**
 * (auth) route group layout
 * All auth pages (login, signup) are wrapped in AuthLayout.
 * Server Component — AuthLayout is purely presentational.
 */
export default function AuthGroupLayout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
