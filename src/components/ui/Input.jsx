// No "use client" needed — props-driven, no internal hooks
const Input = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  className = '',
  labelClassName = '',
  inputClassName = '',
  rightElement,
  ...props
}) => {
  return (
    <div className={`group ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-xs font-semibold text-[var(--color-on-surface)] uppercase tracking-wider mb-2 px-1 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full bg-[var(--color-surface)] border border-[var(--color-surface-border)]
            focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] focus:outline-none
            text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]
            transition-all px-4 py-3 rounded-md
            font-body text-sm
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        
        {/* Right element (e.g., icon, button) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]">{rightElement}</div>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-[var(--color-error)] font-medium">{error}</p>}
    </div>
  );
};

export default Input;
