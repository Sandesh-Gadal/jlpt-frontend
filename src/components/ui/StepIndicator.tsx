'use client';

import React from 'react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 0-indexed
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="step-indicator fade-up">
      {steps.map((step, i) => {
        const isDone   = i < current;
        const isActive = i === current;
        return (
          <React.Fragment key={step.label}>
            <div
              className={`step-node ${
                isActive ? 'step-node-active' : isDone ? 'step-node-done' : 'step-node-idle'
              }`}
            >
              {isDone ? '✓' : i + 1}
            </div>
            <span
              className={`step-label ${isActive ? 'step-label-active' : 'step-label-idle'}`}
            >
              {step.label}
            </span>
            {i < steps.length - 1 && <div className="step-connector" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
