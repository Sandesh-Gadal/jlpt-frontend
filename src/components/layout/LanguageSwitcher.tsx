'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ja', flag: '🇯🇵', label: 'JA' },
  { code: 'ne', flag: '🇳🇵', label: 'NE' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger — matches icon-btn style */}
      <button
        className="icon-btn"
        title="Change language"
        onClick={() => setOpen((o) => !o)}
        style={{ fontSize: '13px', fontWeight: 600, gap: '2px', minWidth: 36 }}
      >
        <span>{current.flag}</span>
        <span style={{ fontSize: '11px' }}>{current.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
            onClick={() => setOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 20,
            background: 'var(--bg-card, #fff)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            minWidth: '130px',
            overflow: 'hidden',
          }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 14px',
                  background: locale === lang.code ? 'var(--bg-hover, #f3f4f6)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: locale === lang.code ? 600 : 400,
                  color: 'var(--text-primary, #111)',
                  textAlign: 'left',
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.code === 'en' ? 'English' : lang.code === 'ja' ? '日本語' : 'नेपाली'}</span>
                {locale === lang.code && (
                  <span style={{ marginLeft: 'auto', color: 'var(--accent, #6366f1)' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}