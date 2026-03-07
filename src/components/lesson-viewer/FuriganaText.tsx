'use client';

// src/components/lesson-viewer/FuriganaText.tsx
// Renders furigana segments as proper HTML <ruby> elements
// Toggle button hides/shows readings

import React, { useState } from 'react';
import type { FuriganaSegment } from '@/types/lesson';

interface FuriganaTextProps {
  segments: FuriganaSegment[];
}

export default function FuriganaText({ segments }: FuriganaTextProps) {
  const [show, setShow] = useState(true);

  return (
    <div className="lv-block">
      <button
        className={`lv-reading-toggle${show ? ' active' : ''}`}
        onClick={() => setShow((p) => !p)}
      >
        {show ? '👁 Hide readings' : '👁 Show readings'}
      </button>

      <div className={`lv-furigana-wrap${show ? '' : ' furigana-hidden'}`}>
        {segments.map((seg, i) =>
          seg.reading ? (
            <ruby key={i}>
              {seg.text}
              <rt>{seg.reading}</rt>
            </ruby>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
    </div>
  );
}