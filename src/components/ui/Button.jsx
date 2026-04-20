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
    'font-label font-semibold tracking-wide rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-br from-primary to-primary-container text-on-primary-container hover:shadow-[0_0_25px_rgba(196,192,255,0.3)]',
    secondary:
      'bg-surface-container-high text-on-surface hover:bg-surface-container-high/80',
    outline:
      'border border-outline-variant text-on-surface hover:bg-surface-container-high/30',
    ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    full: 'w-full py-4 text-sm',
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
