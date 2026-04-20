import Link from 'next/link';

export const metadata = {
  title: 'Forgot Password - DevBill',
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[460px] glass-card rounded-[20px] p-10 md:p-14 z-10 shadow-2xl">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined">lock_reset</span>
        </div>
        <div>
          <h1 className="font-headline font-light text-4xl text-on-surface tracking-tight mb-3">
            Password Reset
          </h1>
          <p className="font-body text-on-surface-variant text-sm leading-relaxed">
            Password reset is not wired up yet in this build. Use an existing account or create a new one while the recovery flow is being implemented.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-label font-semibold tracking-wide text-sm"
          >
            Back to Login
          </Link>
          <Link
            href="/signup"
            className="w-full px-6 py-3 rounded-xl border border-outline-variant text-on-surface font-label font-semibold tracking-wide text-sm"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
