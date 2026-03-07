'use client';

import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score: s, label: labels[s] };
}

const barClass = ['', 'weak', 'fair', 'good', 'strong'];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label } = getStrength(password);
  if (!password) return null;

  return (
    <div style={{ marginTop: 6 }}>
      <div className="pw-strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`pw-bar ${i <= score ? barClass[score] : ''}`}
          />
        ))}
      </div>
      <p className="pw-strength-label">{label}</p>
    </div>
  );
}
