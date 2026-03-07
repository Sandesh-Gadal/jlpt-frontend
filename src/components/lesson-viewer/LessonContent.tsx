'use client';

// src/components/lesson-viewer/LessonContent.tsx
// Renders all content block types for a lesson

import React from 'react';
import FuriganaText from './FuriganaText';
import type { ContentBlock } from '@/types/lesson';

export default function LessonContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {

    case 'heading':
      return (
        <div className="lv-block">
          <div className="lv-h2">{block.text}</div>
        </div>
      );

    case 'paragraph':
      return (
        <div className="lv-block">
          <p className="lv-paragraph">{block.text}</p>
        </div>
      );

    case 'divider':
      return <div className="lv-block"><div className="lv-divider" /></div>;

    case 'furigana':
      return block.segments
        ? <FuriganaText segments={block.segments} />
        : null;

    case 'grammar':
      if (!block.grammar) return null;
      return (
        <div className="lv-block">
          <div className="lv-grammar-box">
            <div className="lv-grammar-header">
              <span className="lv-grammar-pattern">{block.grammar.pattern}</span>
              <span className="lv-grammar-meaning">— {block.grammar.meaning}</span>
            </div>
            <div className="lv-grammar-body">
              <div className="lv-grammar-structure">{block.grammar.structure}</div>
              <div className="lv-grammar-examples">
                {block.grammar.examples.map((ex, i) => (
                  <div key={i} className="lv-example">
                    <div className="lv-example-jp">{ex.jp}</div>
                    <div className="lv-example-en">{ex.en}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'vocabulary':
      if (!block.vocab) return null;
      return (
        <div className="lv-block">
          <div className="lv-vocab-wrap">
            <table className="lv-vocab-table">
              <thead>
                <tr>
                  <th>Word</th>
                  <th>Meaning</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                {block.vocab.map((v, i) => (
                  <tr key={i}>
                    <td>
                      <div className="lv-vocab-word">{v.word}</div>
                      <div className="lv-vocab-reading">{v.reading}</div>
                    </td>
                    <td className="lv-vocab-meaning">{v.meaning}</td>
                    <td>
                      <div className="lv-vocab-example">{v.example}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'tip': {
      const isWarning = block.label?.includes('⚠️');
      return (
        <div className="lv-block">
          <div className={`lv-tip-box ${isWarning ? 'warning' : 'tip'}`}>
            <div>
              {block.label && <div className="lv-tip-label">{block.label}</div>}
              <div className="lv-tip-text">{block.tip}</div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}