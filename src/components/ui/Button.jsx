import { motion } from 'framer-motion';

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
  const baseStyles = 'font-label rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border border-[var(--color-surface-border)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]',
    ghost: 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5',
    lg: 'px-6 py-3',
    full: 'w-full py-2.5',
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
