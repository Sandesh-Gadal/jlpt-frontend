'use client';

import React from 'react';
import Link from 'next/link';

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  badge?: string;
  headline: React.ReactNode;
  subtext: string;
  features: Feature[];
}

export default function AuthLayout({
  children,
  badge,
  headline,
  subtext,
  features,
}: AuthLayoutProps) {
  return (
    <div className="auth-root">
      {/* Background effects */}
      <div className="auth-bg-grid" />
      <div className="auth-blob auth-blob-blue" />
      <div className="auth-blob auth-blob-pink" />
      <div className="auth-blob auth-blob-amber" />

      {/* ── Left panel ── */}
      <aside className="auth-left">
        <Link href="/" className="auth-brand">
          <div className="auth-brand-icon">語</div>
          <div>
            <div className="auth-brand-name">JLPT Master</div>
            <div className="auth-brand-tagline">Japanese Proficiency</div>
          </div>
        </Link>

        <div className="auth-panel-body">
          {badge && <div className="auth-panel-badge">✦ {badge}</div>}

          <h2 className="auth-panel-headline">{headline}</h2>
          <p className="auth-panel-sub">{subtext}</p>

          <div className="auth-features">
            {features.map((f) => (
              <div className="auth-feature" key={f.title}>
                <div className="auth-feature-icon">{f.icon}</div>
                <div>
                  <span className="auth-feature-title">{f.title}</span>
                  <span className="auth-feature-desc">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-stats">
          {[
            { num: '50K+', label: 'Learners' },
            { num: 'N5–N1', label: 'All Levels' },
            { num: '92%',  label: 'Pass Rate' },
          ].map((s) => (
            <div key={s.label}>
              <div className="auth-stat-num">{s.num}</div>
              <div className="auth-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right panel ── */}
      <main className="auth-right">
        <div className="auth-form-card">{children}</div>
      </main>
    </div>
  );
}
