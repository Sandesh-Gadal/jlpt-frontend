'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';

const FEATURES = [
  { icon: '📧', title: 'Check your inbox',  desc: 'We sent a link to your email address' },
  { icon: '🔗', title: 'Click the link',    desc: 'Tap the verification link in the email' },
  { icon: '🚀', title: 'Start learning',    desc: "You'll be redirected back automatically" },
];

export default function VerifyEmailPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail]         = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle');
  const [token, setToken]         = useState('');

  // Read pending email from sessionStorage
  useEffect(() => {
    const e = sessionStorage.getItem('pending_email') ?? '';
    setEmail(e);
    const t = localStorage.getItem('jlpt_token') ?? '';
    setToken(t);
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // Auto-handle ?verified=1 redirect from API link
  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      setStatus('success');
      setTimeout(() => router.push('/auth/login'), 2500);
    }
  }, [searchParams, router]);

  const handleResend = async () => {
    if (!token) { setStatus('error'); return; }
    setResending(true);
    await api.resendVerification(token);
    setResending(false);
    setCountdown(60);
  };

  return (
    <AuthLayout
      headline={<>One step away from your<br /><span>Japanese journey</span></>}
      subtext="Email verification keeps your account secure and lets us send you important updates."
      features={FEATURES}
    >
      {/* Envelope icon */}
      <div className="verify-icon-box fade-up">✉️</div>

      {/* Header */}
      <div className="auth-card-header fade-up delay-1">
        <p className="auth-eyebrow">Verify Email</p>
        <h1 className="auth-title">Check your inbox</h1>
        <p className="auth-subtitle">
          We sent a verification link to{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{email || 'your email address'}</strong>
        </p>
      </div>

      {status === 'success' && (
        <Alert variant="success">
          Email verified! Redirecting you to login…
        </Alert>
      )}
      {status === 'error' && (
        <Alert variant="error">
          Unable to resend. Please try logging in again to get a fresh link.
        </Alert>
      )}

      <Alert variant="info">
        The link expires in <strong>60 minutes</strong>. Check your spam folder if you don't see it.
      </Alert>

      {/* Dev helper — visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="fade-up delay-2"
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Dev mode</strong> — Copy the link from
            Mailtrap, change port 8000 → 8001, and hit it as a GET in Postman:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--primary)',
              background: 'rgba(59,111,232,0.06)',
              border: '1px solid rgba(59,111,232,0.15)',
              borderRadius: 6,
              padding: '7px 10px',
              wordBreak: 'break-all',
            }}
          >
            GET /api/v1/auth/verify-email/&#123;id&#125;/&#123;hash&#125;?expires=…&signature=…
          </p>
        </div>
      )}

      {/* Resend button */}
      <button
        className="btn-primary fade-up delay-3"
        onClick={handleResend}
        disabled={resending || countdown > 0}
      >
        {resending
          ? <><span className="spinner" /> Sending…</>
          : countdown > 0
            ? `↺ Resend in ${countdown}s`
            : '↺ Resend Verification Email'}
      </button>

      <button className="btn-ghost fade-up" onClick={() => router.push('/auth/login')}>
        ← Back to Login
      </button>

      <p className="auth-footer fade-up">
        Wrong email?{' '}
        <Link href="/auth/register" className="auth-link">Start over</Link>
      </p>
    </AuthLayout>
  );
}
