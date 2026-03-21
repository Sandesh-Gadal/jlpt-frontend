'use client';

// src/components/ui/ContentLoader.tsx
// Fills the main content area only — sidebar + topbar stay visible.

import React, { useEffect, useState } from 'react';

const KANJI_SEQ  = ['日', '語', '力', '学', 'N'];
const KANJI_SIZE = ['54px', '54px', '54px', '54px', '44px'];

export default function ContentLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % KANJI_SEQ.length), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      width:          '100%',
      height:         '100%',
      minHeight:      '60vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'var(--bg-base)',
      position:       'relative',
      overflow:       'hidden',
    }}>

      {/* Ambient glow */}
      <div style={{
        position:      'absolute',
        width:          320,
        height:         320,
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(110,170,84,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* Torii gate */}
        <div style={{ marginBottom: 32, animation: 'loaderFadeIn .7s ease both' }}>
          <svg width="60" height="46" viewBox="0 0 72 56" fill="none">
            <rect x="4"  y="12" width="64" height="5"   rx="2.5" fill="#6EAA54" opacity=".9"/>
            <rect x="10" y="6"  width="52" height="4"   rx="2"   fill="#6EAA54" opacity=".55"/>
            <rect x="14" y="17" width="5"  height="36"  rx="2.5" fill="#6EAA54" opacity=".7"/>
            <rect x="53" y="17" width="5"  height="36"  rx="2.5" fill="#6EAA54" opacity=".7"/>
            <rect x="18" y="24" width="36" height="2.5" rx="1.25" fill="#6EAA54" opacity=".25"/>
            <circle cx="36" cy="10" r="3" fill="#6EAA54" opacity=".6"/>
          </svg>
        </div>

        {/* Spinning rings + kanji */}
        <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(110,170,84,0.12)', animation: 'loaderSpin 8s linear infinite' }}>
            <div style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: '#6EAA54', top: 2, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 6px #6EAA54' }} />
          </div>
          <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px dashed rgba(110,170,84,0.09)', animation: 'loaderSpin 5s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', border: '1px solid rgba(110,170,84,0.15)', animation: 'loaderSpin 12s linear infinite' }} />

          <div
            key={step}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize:   KANJI_SIZE[step],
              fontWeight: 700,
              color:      '#6EAA54',
              textShadow: '0 0 24px rgba(110,170,84,0.4)',
              animation:  'loaderKanjiIn .4s cubic-bezier(.16,1,.3,1)',
              lineHeight: 1,
              zIndex:     2,
            }}
          >
            {KANJI_SEQ[step]}
          </div>
        </div>

        {/* Waveform bars */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
          {[14,22,30,22,14,8,14,22,30,22,14,8].map((h, i) => (
            <div key={i} style={{
              width: 2, height: h, borderRadius: 1,
              background: '#6EAA54',
              boxShadow:  '0 0 4px rgba(110,170,84,0.4)',
              animation:  'loaderBar 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>

        {/* Level dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(110,170,84,0.18)',
              animation: 'loaderDot 1.5s ease infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes loaderFadeIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes loaderSpin    { to{transform:rotate(360deg)} }
        @keyframes loaderKanjiIn { from{opacity:0;transform:scale(.7) rotate(-8deg)} to{opacity:1;transform:scale(1) rotate(0)} }
        @keyframes loaderBar     { 0%,100%{opacity:.25;transform:scaleY(.6)} 50%{opacity:1;transform:scaleY(1)} }
        @keyframes loaderDot     { 0%,100%{background:rgba(110,170,84,0.15)} 50%{background:#6EAA54;box-shadow:0 0 6px rgba(110,170,84,.5)} }
      `}</style>
    </div>
  );
}