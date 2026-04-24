// Pure layout component — no hooks, no "use client" needed
const AuthLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-[var(--color-background)]">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative px-6 py-20 z-10">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="w-full flex justify-between items-center px-12 py-8 bg-[var(--color-surface)] border-t border-[var(--color-surface-border)] z-20">
          <div className="flex items-center gap-6">
            <span className="text-lg font-headline font-bold text-[var(--color-on-surface)]">DevBill.</span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="font-body text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                Privacy
              </a>
              <a href="#" className="font-body text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                Terms
              </a>
              <a href="#" className="font-body text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="font-body text-xs md:text-sm text-[var(--color-on-surface-variant)]">
            © 2024 DevBill. The Digital Atelier.
          </div>
        </footer>
      )}
    </div>
  );
};

export default AuthLayout;
