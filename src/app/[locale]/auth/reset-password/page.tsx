'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import PasswordStrength from '@/components/ui/PasswordStrength';
import Alert from '@/components/ui/Alert';
import StepIndicator from '@/components/ui/StepIndicator';
import { api } from '@/lib/api';

const FEATURES = [
  { icon: '🔐', title: 'Secure reset',     desc: 'Tokens expire in 60 minutes for security'    },
  { icon: '📨', title: 'Check your email', desc: "Look in spam if you don't see it in 2 minutes" },
  { icon: '✓',  title: 'All sessions end', desc: 'All devices are signed out after reset'       },
];

const STEPS = [{ label: 'Request' }, { label: 'Reset' }, { label: 'Done' }];

type ResetStep = 'reset' | 'done';

export default function ResetPasswordPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep]       = useState<ResetStep>('reset');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    email:                 '',
    token:                 '',
    password:              '',
    password_confirmation: '',
  });

  // Pre-fill email + token from URL or sessionStorage
  useEffect(() => {
    const urlToken = searchParams.get('token') ?? '';
    const urlEmail = searchParams.get('email') ?? '';
    const storedEmail = sessionStorage.getItem('reset_email') ?? '';
    setForm((prev) => ({
      ...prev,
      token: urlToken || prev.token,
      email: urlEmail || storedEmail || prev.email,
    }));
  }, [searchParams]);

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleReset = async () => {
    setError('');
    if (!form.token)    { setError('Please paste the reset token from your email.'); return; }
    if (!form.password) { setError('Please enter a new password.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.password_confirmation) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: err } = await api.resetPassword(form);
    setLoading(false);

    if (err) { setError(err); return; }
    setStep('done');
  };

  const currentStepIndex = step === 'reset' ? 1 : 2;

  return (
    <AuthLayout
      headline={<>Recover access to your<br /><span>account safely</span></>}
      subtext="We'll send you a secure one-time link to reset your password. Your progress and data are always safe."
      features={FEATURES}
    >
      {/* Step indicator — steps 2 and 3 */}
      <StepIndicator steps={STEPS} current={currentStepIndex} />

      {/* ── Step: Reset ── */}
      {step === 'reset' && (
        <>
          <div className="auth-card-header fade-up">
            <p className="auth-eyebrow">New Password</p>
            <h1 className="auth-title">Set a new password</h1>
            <p className="auth-subtitle">
              {form.email
                ? <>Check <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong> for the reset token.</>
                : 'Paste the reset token from your email below.'}
            </p>
          </div>

          <Alert variant="success">
            Reset email sent! Copy the token from the link in your email.
          </Alert>

          {error && <Alert variant="error">{error}</Alert>}

          {/* Token field */}
          <div className="fade-up delay-1">
            <div className="form-group">
              <div className="form-label">
                <span>Reset Token</span>
              </div>
              <div className="form-input-wrap">
                <span className="input-icon-left">🔑</span>
                <input
                  className="form-input with-icon mono"
                  type="text"
                  placeholder="Paste the token from your email link"
                  value={form.token}
                  onChange={(e) => set('token', e.target.value.trim())}
                />
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 5,
                  lineHeight: 1.5,
                }}
              >
                From the link:{' '}
                <span style={{ color: 'var(--text-secondary)' }}>…/reset-password?token=</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>THIS_VALUE</span>
                <span style={{ color: 'var(--text-secondary)' }}>&email=…</span>
              </p>
            </div>
          </div>

          {/* New password */}
          <div className="fade-up delay-2">
            <FormInput
              label="New Password"
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              iconLeft="🔒"
              iconRight={
                <button
                  type="button"
                  className="input-btn-right"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              }
            />
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm password */}
          <div className="fade-up delay-3">
            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={(e) => set('password_confirmation', e.target.value)}
              iconLeft="🔒"
            />
          </div>

          <button
            className="btn-primary fade-up delay-4"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Resetting…</> : 'Reset Password →'}
          </button>

          <p className="auth-footer fade-up">
            Remembered it?{' '}
            <Link href="/auth/login" className="auth-link">Back to login</Link>
          </p>
        </>
      )}

      {/* ── Step: Done ── */}
      {step === 'done' && (
        <div className="fade-up" style={{ textAlign: 'center', padding: '16px 0' }}>
          <div className="success-circle">✓</div>

          <p className="auth-eyebrow" style={{ marginBottom: 8 }}>Success</p>
          <h1 className="auth-title">Password reset!</h1>
          <p
            className="auth-subtitle"
            style={{ marginBottom: 32, marginTop: 6 }}
          >
            Your password has been updated. All existing sessions have been
            signed out for your security.
          </p>

          <button
            className="btn-primary"
            onClick={() => router.push('/auth/login')}
          >
            Sign In with New Password →
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
