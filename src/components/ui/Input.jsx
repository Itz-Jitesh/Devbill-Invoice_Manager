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
          className={`block text-xs font-label font-medium text-on-surface-variant/70 uppercase tracking-widest mb-2 px-1 ${labelClassName}`}
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
            w-full bg-surface-container-high/40
            border-b border-outline-variant
            focus:border-primary focus:ring-0 focus:outline-none
            text-on-surface placeholder:text-outline/50
            transition-all px-4 py-4 rounded-xl input-glow
            font-body text-sm
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-error' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {/* Animated underline */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-focus-within:w-full rounded-full" />

        {/* Right element (e.g., icon, button) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-error font-label">{error}</p>}
    </div>
  );
};

export default Input;
