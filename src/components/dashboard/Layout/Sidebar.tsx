'use client';

// ─────────────────────────────────────────────────────────────────
// src/components/dashboard/Layout/Sidebar.tsx
// Fixed 260px left sidebar: logo, nav items, user footer
// ─────────────────────────────────────────────────────────────────

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/dashboard';

interface SidebarProps {
  navItems:    NavItem[];
  userName:    string;
  userInitial: string;
  userLevel:   string;
}

export default function Sidebar({
  navItems,
  userName,
  userInitial,
  userLevel,
}: SidebarProps) {
  const pathname = usePathname();

  const mainNav     = navItems.slice(0, 5);
  const accountNav  = navItems.slice(5);

  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="logo-icon">🍵</div>
        <div>
          <div className="logo-text">JLPT Master</div>
          <div className="logo-sub">Matcha Garden</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>

        {mainNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: 6 }}>Account</div>

        {accountNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── User Footer ── */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar-sm">{userInitial}</div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-level-badge">✦ {userLevel} Level</div>
          </div>
          <Link href="/settings" className="settings-icon-btn" title="Settings">
            ⚙
          </Link>
        </div>
      </div>
    </aside>
  );
}
