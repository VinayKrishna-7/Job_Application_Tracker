import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Option[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700 dark:focus:border-indigo-400',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-3 text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {!error && helperText && <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
