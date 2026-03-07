'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import FormInput from '@/components/ui/FormInput';
import PasswordStrength from '@/components/ui/PasswordStrength';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';

const FEATURES = [
  { icon: '🎴', title: 'Flashcard SRS',      desc: 'Smart review based on your memory curve' },
  { icon: '📝', title: 'Mock Exams',          desc: 'Timed practice with real exam structure'  },
  { icon: '📊', title: 'Progress Tracking',   desc: 'Detailed analytics across all 5 levels'   },
  { icon: '🏆', title: 'XP & Streaks',        desc: 'Stay motivated with gamified milestones'  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name:             '',
    email:                 '',
    password:              '',
    password_confirmation: '',
    agree:                 false,
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.full_name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (!form.agree) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    const { error: err } = await api.register({
      full_name:             form.full_name,
      email:                 form.email,
      password:              form.password,
      password_confirmation: form.password_confirmation,
    });
    setLoading(false);

    if (err) { setError(err); return; }

    // Store email for the verify screen
    sessionStorage.setItem('pending_email', form.email);
    router.push('/auth/verify-email');
  };

  return (
    <AuthLayout
      badge="Free to start — no credit card"
      headline={<>Start your journey to<br /><span>JLPT success</span></>}
      subtext="Join thousands of learners using structured lessons, spaced repetition, and mock exams to pass JLPT."
      features={FEATURES}
    >
      {/* Header */}
      <div className="auth-card-header fade-up">
        <p className="auth-eyebrow">Create Account</p>
        <h1 className="auth-title">Sign up for free</h1>
        <p className="auth-subtitle">Begin with N5 — upgrade anytime for full access.</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Full name */}
      <div className="fade-up delay-1">
        <FormInput
          label="Full Name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          value={form.full_name}
          onChange={(e) => set('full_name', e.target.value)}
          iconLeft="👤"
        />
      </div>

      {/* Email */}
      <div className="fade-up delay-2">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          iconLeft="✉"
        />
      </div>

      {/* Password */}
      <div className="fade-up delay-3">
        <FormInput
          label="Password"
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

      {/* Confirm */}
      <div className="fade-up delay-4">
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          autoComplete="new-password"
          value={form.password_confirmation}
          onChange={(e) => set('password_confirmation', e.target.value)}
          iconLeft="🔒"
        />
      </div>

      {/* Terms */}
      <div className="form-group fade-up delay-5">
        <label className="form-checkbox-wrap">
          <input
            type="checkbox"
            checked={form.agree}
            onChange={(e) => set('agree', e.target.checked)}
          />
          <span className="checkbox-text">
            I agree to the{' '}
            <Link href="/terms" className="auth-link">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="auth-link">Privacy Policy</Link>
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        className="btn-primary fade-up"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <><span className="spinner" /> Creating account…</> : 'Create Free Account →'}
      </button>

      {/* Footer */}
      <p className="auth-footer fade-up">
        Already have an account?{' '}
        <Link href="/auth/login" className="auth-link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
