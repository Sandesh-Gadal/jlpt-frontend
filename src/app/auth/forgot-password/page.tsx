'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';

const FEATURES = [
  { icon: '🔐', title: 'Secure reset',      desc: 'Tokens expire in 60 minutes for security' },
  { icon: '📨', title: 'Check your email',  desc: "Look in spam if you don't see it in 2 minutes" },
  { icon: '✓',  title: 'All sessions end',  desc: 'All devices are signed out after reset' },
];

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }

    setLoading(true);
    await api.forgotPassword(email);
    setLoading(false);

    // Always show success — API never reveals if email exists
    setSent(true);
    sessionStorage.setItem('reset_email', email);
    setTimeout(() => router.push('/auth/reset-password'), 1800);
  };

  return (
    <AuthLayout
      headline={<>Recover access to your<br /><span>account safely</span></>}
      subtext="We'll send you a secure one-time link to reset your password. Your progress and data are always safe."
      features={FEATURES}
    >
      {/* Header */}
      <div className="auth-card-header fade-up">
        <p className="auth-eyebrow">Reset Password</p>
        <h1 className="auth-title">Forgot your password?</h1>
        <p className="auth-subtitle">
          No worries — enter your email and we'll send you a reset link.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {sent && (
        <Alert variant="success">
          Reset link sent! Redirecting you to set a new password…
        </Alert>
      )}

      <div className="fade-up delay-1">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          iconLeft="✉"
        />
      </div>

      <button
        className="btn-primary fade-up delay-2"
        onClick={handleSubmit}
        disabled={loading || sent}
      >
        {loading ? <><span className="spinner" /> Sending…</> : 'Send Reset Link →'}
      </button>

      <button className="btn-ghost fade-up" onClick={() => router.push('/auth/login')}>
        ← Back to Login
      </button>

      <p className="auth-footer fade-up">
        Remembered it?{' '}
        <Link href="/auth/login" className="auth-link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
