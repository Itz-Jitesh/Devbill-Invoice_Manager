import Icon from '@/components/ui/Icon';

/**
 * StatusTimeline
 * @description Renders a dynamic status lifecycle for an invoice based on its current status.
 */
const StatusTimeline = ({ status = 'sent', date }) => {
  const normalizedStatus = status?.toLowerCase();
  
  // Define steps
  // Note: According to user logic, "pending" is visually treated as "Sent".
  const steps = [
    { 
      label: 'Sent', 
      date: date || 'Date not set', 
      icon: 'mail', 
      isCompleted: true,
      isActive: true 
    },
    { 
      label: 'Paid', 
      date: normalizedStatus === 'paid' ? 'Transaction Complete' : 'Awaiting Payment', 
      icon: 'payments', 
      isCompleted: normalizedStatus === 'paid',
      isActive: normalizedStatus === 'paid'
    },
  ];

  return (
    <section className="max-w-4xl">
      <h4 className="text-[10px] uppercase tracking-[0.4em] text-on-surface-variant font-label mb-10 font-bold px-4 ">
        Document Lifecycle
      </h4>

      <div className="flex items-center gap-12 surface-card p-10 rounded-[32px] shadow-2xl border-[var(--color-surface-border)] relative overflow-hidden ">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5  rounded-full pointer-events-none" />

        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-12 flex-1 last:flex-none">
            {/* Step Item */}
            <div className={`flex items-center gap-6 transition-all duration-700 ${step.isActive ? 'opacity-100' : 'opacity-20'}`}>
              <div className="relative group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
                  step.isCompleted
                    ? 'bg-primary/20 text-primary shadow-[0_0_30px_rgba(196,192,255,0.3)] border-primary/40'
                    : 'bg-[var(--color-surface)] border-[var(--color-surface-border)] text-on-surface-variant'
                }`}>
                  <Icon name={step.icon} size="lg" />
                </div>
                {step.isCompleted && (
                  <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10 " />
                )}
              </div>

              <div>
                <p className={`font-bold text-lg font-headline tracking-tight ${step.isActive ? 'text-[var(--color-on-surface)]' : 'text-on-surface-variant'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-on-surface-variant/60 font-label uppercase tracking-[0.2em] mt-1.5 font-medium">
                  {step.date}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`h-[1px] flex-1 transition-all duration-1000 ${
                steps[index + 1].isCompleted
                  ? 'bg-gradient-to-r from-primary/60 to-primary/20'
                  : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatusTimeline;

