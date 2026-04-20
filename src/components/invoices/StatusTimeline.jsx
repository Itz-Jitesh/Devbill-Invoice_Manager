// Pure presentational — no hooks
const StatusTimeline = ({ history = [] }) => {
  // Default history if none provided
  const steps = [
    { label: 'Draft', date: 'Oct 20, 09:42 AM', icon: 'check', active: true, completed: true },
    { label: 'Sent', date: 'Oct 24, 02:15 PM', icon: 'mail', active: true, completed: true },
    { label: 'Paid', date: 'Awaiting Payment', icon: 'payments', active: false, completed: false },
  ];

  return (
    <section className="max-w-4xl">
      <h4 className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-label mb-10 font-bold px-4">
        Status History
      </h4>

      <div className="flex items-center gap-12 glass-card p-10 rounded-[24px] shadow-xl border-white/5 relative overflow-hidden backdrop-blur-2xl">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-12 flex-1">
            {/* Step Item */}
            <div className={`flex items-center gap-5 transition-all duration-500 ${step.active ? 'opacity-100' : 'opacity-30'}`}>
              <div className="relative group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                  step.completed
                    ? 'bg-primary text-on-primary-container shadow-[0_0_25px_rgba(196,192,255,0.4)] border-transparent'
                    : 'border-white/20 text-white/40'
                }`}>
                  <span className="material-symbols-outlined text-xl">{step.icon}</span>
                </div>
                {step.completed && (
                  <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />
                )}
              </div>

              <div>
                <p className={`font-bold text-base font-body tracking-tight ${step.completed ? 'text-white' : 'text-white/40'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mt-1 opacity-60">
                  {step.date}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`h-[1.5px] flex-1 transition-all duration-1000 ${
                steps[index + 1].completed
                  ? 'bg-primary/50 shadow-[0_0_10px_rgba(196,192,255,0.2)]'
                  : 'bg-white/5'
              }`} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatusTimeline;
