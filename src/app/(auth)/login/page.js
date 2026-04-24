'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

/**
 * Login page
 * "use client" required: useState, useEffect, useRouter, useAuth.
 * useNavigate → useRouter
 * Link from react-router-dom → Link from next/link (href instead of to)
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, loading, user, isAuthReady } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthReady && user) {
      router.replace('/dashboard');
    }
  }, [user, isAuthReady, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Store flag to show welcome toast on dashboard after redirect
      sessionStorage.setItem('showWelcomeToast', 'true');
      router.push('/dashboard');
    } else {
      setServerError(result.message || 'Unable to connect to the server. Please check if the backend is running.');
    }
  };

  return (
    <div className="w-full max-w-[460px] surface-card rounded-[20px] p-10 md:p-14 z-10 shadow-2xl">
      {/* App Logo */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-surface-border)]">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-on-surface font-body font-medium tracking-wide text-sm">DevBill</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-[var(--color-on-surface-variant)]enter mb-10">
        <h1 className="font-headline font-light text-[var(--color-on-surface-variant)]xl md:text-5xl text-on-surface tracking-tight mb-4">
          Welcome back
        </h1>
        <p className="font-body text-on-surface-variant font-medium text-sm md:text-base">
          Manage your invoices like a pro.
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-[var(--color-on-surface)]rror text-sm font-body text-[var(--color-on-surface-variant)]enter">
          {serverError}
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <label className="block text-xs font-label font-medium text-on-surface-variant/70 uppercase tracking-widest mb-2 px-1">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-primary hover:text-on-surface transition-colors uppercase tracking-wider font-semibold mb-2"
            >
              Forgot?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            labelClassName="hidden"
            disabled={loading}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" size="full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-10 text-[var(--color-on-surface-variant)]enter">
        <p className="font-body text-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-on-surface transition-colors font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
