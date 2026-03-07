'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';

const FEATURES = [
  { icon: '🔥', title: 'Your streak',     desc: "Don't break your daily study streak"       },
  { icon: '📈', title: 'Progress saved',  desc: 'All your progress is synced and waiting'   },
  { icon: '🎯', title: 'Daily goals',     desc: 'New daily practice challenges await you'   },
];

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { data, error: err } = await api.login({
      email:    form.email,
      password: form.password,
    });
    setLoading(false);

    if (err) { setError(err); return; }
    if (data?.token) {
      localStorage.setItem('jlpt_token', data.token);
      localStorage.setItem('jlpt_user',  JSON.stringify(data.user));
      router.push('/dashboard');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <AuthLayout
      headline={<>Welcome back to your<br /><span>learning path</span></>}
      subtext="Your vocabulary cards, grammar progress, and streak are waiting. Let's continue from where you left off."
      features={FEATURES}
    >
      {/* Header */}
      <div className="auth-card-header fade-up">
        <p className="auth-eyebrow">Welcome Back</p>
        <h1 className="auth-title">Sign in to your account</h1>
        <p className="auth-subtitle">Continue your JLPT preparation journey.</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Email */}
      <div className="fade-up delay-1">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          onKeyDown={handleKeyDown}
          iconLeft="✉"
        />
      </div>

      {/* Password */}
      <div className="fade-up delay-2">
        <FormInput
          label="Password"
          labelRight={
            <Link href="/auth/forgot-password" className="auth-link" style={{ fontWeight: 400 }}>
              Forgot password?
            </Link>
          }
          type={showPw ? 'text' : 'password'}
          placeholder="Your password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          onKeyDown={handleKeyDown}
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
      </div>

      {/* Remember me */}
      <div className="form-group fade-up delay-3">
        <label className="form-checkbox-wrap">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => set('remember', e.target.checked)}
          />
          <span className="checkbox-text">Keep me signed in for 30 days</span>
        </label>
      </div>

      {/* Submit */}
      <button
        className="btn-primary fade-up delay-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In →'}
      </button>

      {/* Divider */}
      <div className="auth-divider fade-up">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">or continue with</span>
        <div className="auth-divider-line" />
      </div>

      {/* OAuth placeholders */}
      <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
        <button className="btn-oauth" disabled>🔑 Google</button>
        <button className="btn-oauth" disabled>🐙 GitHub</button>
      </div>

      {/* Footer */}
      <p className="auth-footer fade-up">
        Don't have an account?{' '}
        <Link href="/auth/register" className="auth-link">Sign up free</Link>
      </p>
    </AuthLayout>
  );
}
