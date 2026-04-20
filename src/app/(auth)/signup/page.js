'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

/**
 * Signup page
 * "use client" required: useState, useEffect, useRouter, useAuth.
 * useNavigate → useRouter, Link to → Link href.
 * AuthLayout wrapping comes from (auth)/layout.js.
 */
export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, user, isAuthReady } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await signup(formData.fullName, formData.email, formData.password);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => router.push('/login'), 3000);
      // PUT A TOAST HERE!! SAYING! registeration done.. rediretcting to login page in 3 seconds
    } else {
      setServerError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[480px] glass-card rounded-3xl p-8 md:p-12 z-10 shadow-[0_24px_48px_-12px_rgba(196,192,255,0.04)]">
      {/* Progress Hint */}
      <div className="flex justify-center mb-8">
        <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant bg-surface-container-high/40 px-3 py-1 rounded-full border border-outline-variant/20">
          Step 1 of 1
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-light text-on-surface tracking-tight mb-3">
          Create your account
        </h1>
        <p className="text-on-surface-variant font-body font-light text-sm md:text-base">
          Start sending professional invoices today.
        </p>
      </div>

      {/* Status Messages */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-body text-center">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-body text-center">
          {successMessage} Redirecting to login...
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input label="Full Name" name="fullName" type="text" placeholder="John Doe"
          value={formData.fullName} onChange={handleChange} error={errors.fullName}
          disabled={loading || !!successMessage} />

        <Input label="Email Address" name="email" type="email" placeholder="name@company.com"
          value={formData.email} onChange={handleChange} error={errors.email}
          disabled={loading || !!successMessage} />

        <Input label="Password" name="password" type="password" placeholder="••••••••"
          value={formData.password} onChange={handleChange} error={errors.password}
          disabled={loading || !!successMessage} />

        <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••"
          value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
          disabled={loading || !!successMessage} />

        <div className="pt-4">
          <Button type="submit" size="full" disabled={loading || !!successMessage}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-sm font-body text-on-surface-variant/80">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:text-on-surface transition-colors duration-200 ml-1">
            Sign in.
          </Link>
        </p>
      </div>
    </div>
  );
}
