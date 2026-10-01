import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700 dark:focus:border-indigo-400',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-gray-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {!error && helperText && <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
