'use client';

import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: string;
  mono?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, labelRight, iconLeft, iconRight, error, mono, className = '', ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <div className="form-label">
            <span>{label}</span>
            {labelRight && <span>{labelRight}</span>}
          </div>
        )}
        <div className="form-input-wrap">
          {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
          <input
            ref={ref}
            className={[
              'form-input',
              iconLeft  ? 'with-icon'   : '',
              iconRight ? 'with-suffix' : '',
              mono      ? 'mono'        : '',
              className,
            ].join(' ')}
            {...props}
          />
          {iconRight && <span className="input-btn-right">{iconRight}</span>}
        </div>
        {error && (
          <p style={{ fontSize: 11, color: 'var(--error)', marginTop: 5 }}>{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
export default FormInput;
