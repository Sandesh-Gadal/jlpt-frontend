'use client';

import React from 'react';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
}

const icons: Record<AlertVariant, string> = {
  error:   '⚠',
  success: '✓',
  info:    '💡',
};

export default function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`alert alert-${variant} fade-up`}>
      <span style={{ flexShrink: 0 }}>{icons[variant]}</span>
      <span>{children}</span>
    </div>
  );
}
