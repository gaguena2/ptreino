import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, className = '', ...props }, ref) {
    return (
      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          ref={ref}
          className={`border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
            error ? 'border-red-400' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);
