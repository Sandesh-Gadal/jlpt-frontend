'use client';

import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

const FEATURES = [
  { icon: '✅', title: 'Verified', desc: 'Your email address has been confirmed successfully' },
  { icon: '🔐', title: 'Secure access', desc: 'You can now log in and use protected features' },
  { icon: '🚀', title: 'Ready to go', desc: 'Continue your JLPT Master journey now' },
];

export default function VerifyEmailSuccessPage() {
  return (
    <AuthLayout
      headline={
        <>
          Email verified<br />
          <span>successfully</span>
        </>
      }
      subtext="Your account is now verified. You can log in and start using JLPT Master."
      features={FEATURES}
    >
      <div className="fade-up" style={{ textAlign: 'center', padding: '16px 0' }}>
        <div className="success-circle">✓</div>

        <p className="auth-eyebrow" style={{ marginBottom: 8 }}>Success</p>
        <h1 className="auth-title">Verification complete</h1>
        <p
          className="auth-subtitle"
          style={{ marginBottom: 32, marginTop: 6 }}
        >
          Your email has been verified successfully. You can now sign in to your account.
        </p>

        <Link href="/auth/login" className="btn-primary" style={{ display: 'inline-block' }}>
          Go to Login →
        </Link>
      </div>
    </AuthLayout>
  );
}