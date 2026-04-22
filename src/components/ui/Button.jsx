// No "use client" needed — pure presentational component, no hooks or events
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'font-label font-semibold tracking-wider rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[10px] sm:text-xs premium-button';

  const variants = {
    primary:
      'bg-gradient-to-br from-primary to-primary-container text-on-primary-container shadow-[0_8px_20px_rgba(196,192,255,0.15)] hover:shadow-primary/30',
    secondary:
      'glass-card text-on-surface hover:bg-white/10',
    outline:
      'border border-white/10 text-on-surface hover:bg-white/5 hover:border-white/20',
    ghost: 
      'text-on-surface-variant hover:text-on-surface hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-6 py-2.5',
    md: 'px-8 py-3.5',
    lg: 'px-10 py-4.5',
    full: 'w-full py-4',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
