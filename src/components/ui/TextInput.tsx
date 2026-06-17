import { forwardRef, type InputHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  icon?: LucideIcon;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  type = 'text',
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);
  const hasIcon = Boolean(Icon);

  const inputClasses = [
    'w-full px-4 py-3 bg-dark-bg/75 border rounded-lg text-dark-text-primary placeholder:text-dark-muted transition min-h-[46px]',
    'focus:outline-none focus:border-dark-accent focus:bg-dark-card/90',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    hasError
      ? 'border-red-500/50 focus:border-red-500/70'
      : 'border-dark-border hover:border-dark-border-strong',
    hasIcon ? 'pl-10' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold text-dark-secondary uppercase tracking-[0.22em]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {hasError && (
        <p id={`${inputId}-error`} className="text-red-300 text-xs mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
