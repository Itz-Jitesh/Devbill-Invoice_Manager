// Pure layout component — no hooks, no "use client" needed
const AuthLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] orb-indigo rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] orb-teal rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Ambient Background Decoration */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative px-6 py-20 z-10">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="fixed bottom-0 w-full flex justify-between items-center px-12 py-8 bg-transparent z-20">
          <div className="flex items-center gap-6">
            <span className="text-lg font-headline text-on-surface-variant">DevBill.</span>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="font-body text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="font-body text-xs md:text-sm font-medium text-primary">
            © 2024 DevBill. The Digital Atelier.
          </div>
        </footer>
      )}
    </div>
  );
};

export default AuthLayout;
