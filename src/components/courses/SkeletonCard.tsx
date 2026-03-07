// src/components/courses/SkeletonCard.tsx

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '38%' }} />
        <div className="skeleton skeleton-line" style={{ width: '92%' }} />
        <div className="skeleton skeleton-line" style={{ width: '75%' }} />
        <div className="skeleton skeleton-line" style={{ width: '52%', marginTop: 4 }} />
      </div>
      <div className="skeleton skeleton-footer" />
    </div>
  );
}