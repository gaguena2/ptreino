import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, ...props }, ref) {
    return (
      <div className="mb-3">
        <label className="form-label fw-medium small">{label}</label>
        <input
          ref={ref}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...props}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  },
);
