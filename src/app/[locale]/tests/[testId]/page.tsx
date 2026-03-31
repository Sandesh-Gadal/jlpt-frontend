'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { testsApi, type ApiQuestion, type ApiTestSet } from '@/lib/api/tests';

const SECTION_ICONS: Record<string, string> = {
  vocabulary: '📖',
  grammar: '✏️',
  reading: '📄',
  listening: '🔊',
};

type LocalAnswerState = {
  questionId: string;
  selectedOption: string | null;
  isFlagged: boolean;
  timeSpentSeconds: number;
};

export default function TestInterfacePage({ params }: { params: Promise<{ testId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { testId } = React.use(params);

  const [attemptId, setAttemptId] = useState<string | null>(searchParams.get('attemptId'));
  const [test, setTest] = useState<ApiTestSet | null>(null);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, LocalAnswerState>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerSecs, setTimerSecs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const current = questions[currentIdx];
  const answered = useMemo(
    () => Object.values(answers).filter((a) => a.selectedOption !== null).length,
    [answers]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await testsApi.start(testId);

        if (!mounted) return;

        setAttemptId(res.attempt.id);
        setTest(res.test_set);
        setQuestions(res.questions);

        const mappedAnswers: Record<string, LocalAnswerState> = {};
        for (const item of res.saved_answers) {
          mappedAnswers[item.question_id] = {
            questionId: item.question_id,
            selectedOption: item.selected_answer,
            isFlagged: item.is_flagged,
            timeSpentSeconds: item.time_spent_seconds,
          };
        }
        setAnswers(mappedAnswers);

        const startedAt = new Date(res.attempt.started_at).getTime();
        const now = Date.now();
        const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
        const remaining = Math.max(0, res.test_set.time_limit_seconds - elapsed);

        setTimerSecs(remaining);

        const queryAttemptId = searchParams.get('attemptId');
        if (queryAttemptId !== res.attempt.id) {
          router.replace(`/tests/${testId}?attemptId=${res.attempt.id}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [testId]);

  useEffect(() => {
    if (!test || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimerSecs((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          void handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test, questions.length]);

  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIdx]);

  const flushCurrentQuestionTime = useCallback(async () => {
    if (!attemptId || !current) return;

    const elapsed = Math.max(0, Math.floor((Date.now() - questionStartRef.current) / 1000));
    const previous = answers[current.id]?.timeSpentSeconds ?? 0;
    const nextTime = previous + elapsed;

    const payload: LocalAnswerState = {
      questionId: current.id,
      selectedOption: answers[current.id]?.selectedOption ?? null,
      isFlagged: answers[current.id]?.isFlagged ?? false,
      timeSpentSeconds: nextTime,
    };

    setAnswers((prev) => ({
      ...prev,
      [current.id]: payload,
    }));

    await testsApi.answer(attemptId, {
      question_id: current.id,
      selected_answer: payload.selectedOption,
      is_flagged: payload.isFlagged,
      time_spent_seconds: payload.timeSpentSeconds,
    });

    questionStartRef.current = Date.now();
  }, [attemptId, current, answers]);

  const selectAnswer = async (questionId: string, optionId: string) => {
    if (!attemptId) return;

    const elapsed = Math.max(0, Math.floor((Date.now() - questionStartRef.current) / 1000));
    const previous = answers[questionId]?.timeSpentSeconds ?? 0;

    const nextState: LocalAnswerState = {
      questionId,
      selectedOption: optionId,
      isFlagged: answers[questionId]?.isFlagged ?? false,
      timeSpentSeconds: previous + elapsed,
    };

    setAnswers((prev) => ({
      ...prev,
      [questionId]: nextState,
    }));

    await testsApi.answer(attemptId, {
      question_id: questionId,
      selected_answer: optionId,
      is_flagged: nextState.isFlagged,
      time_spent_seconds: nextState.timeSpentSeconds,
    });

    questionStartRef.current = Date.now();

    if (currentIdx < questions.length - 1) {
      setTimeout(() => setCurrentIdx((p) => p + 1), 250);
    }
  };

  const toggleFlag = async () => {
    if (!attemptId || !current) return;

    const elapsed = Math.max(0, Math.floor((Date.now() - questionStartRef.current) / 1000));
    const previous = answers[current.id]?.timeSpentSeconds ?? 0;
    const nextFlag = !(answers[current.id]?.isFlagged ?? false);

    const nextState: LocalAnswerState = {
      questionId: current.id,
      selectedOption: answers[current.id]?.selectedOption ?? null,
      isFlagged: nextFlag,
      timeSpentSeconds: previous + elapsed,
    };

    setAnswers((prev) => ({
      ...prev,
      [current.id]: nextState,
    }));

    await testsApi.answer(attemptId, {
      question_id: current.id,
      selected_answer: nextState.selectedOption,
      is_flagged: nextState.isFlagged,
      time_spent_seconds: nextState.timeSpentSeconds,
    });

    questionStartRef.current = Date.now();
  };

  const goToQuestion = async (index: number) => {
    await flushCurrentQuestionTime();
    setCurrentIdx(index);
  };

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;

    try {
      setSubmitting(true);
      await flushCurrentQuestionTime();
      const result = await testsApi.submit(attemptId);
      router.push(`/tests/results/${result.attempt.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, flushCurrentQuestionTime, router, submitting]);

  const sectionGroups = useMemo(() => {
    if (!test) return [];
    return test.sections.map((section) => ({
      section,
      indices: questions
        .map((q, i) => ({ q, i }))
        .filter(({ q }) => q.section_id === section.id)
        .map(({ i }) => i),
    }));
  }, [test, questions]);

  if (loading || !test || questions.length === 0) {
    return <div className="dashboard-content" style={{ padding: 24 }}>Loading test...</div>;
  }

  if (!current) {
    return <div className="dashboard-content" style={{ padding: 24 }}>No questions available.</div>;
  }

  const timerMM = String(Math.floor(timerSecs / 60)).padStart(2, '0');
  const timerSS = String(timerSecs % 60).padStart(2, '0');
  const timerCls = timerSecs < 60 ? 'danger' : timerSecs < 300 ? 'warn' : '';

  return (
    <div className="ti-shell">
      <div className="ti-nav">
        <div className="ti-nav-head">
          <button className="ti-nav-back" onClick={() => router.push('/tests')}>← Tests</button>
          <div className="ti-nav-test-title">{test.title}</div>
          <div className="ti-nav-progress">
            {answered} / {questions.length} answered
            {Object.values(answers).filter((a) => a.isFlagged).length > 0 &&
              ` · ${Object.values(answers).filter((a) => a.isFlagged).length} flagged`}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sectionGroups.map(({ section, indices }) => (
            <div key={section.id} className="ti-nav-sections">
              <div className="ti-nav-section-label">
                {SECTION_ICONS[section.section_type]} {section.name}
              </div>
              <div className="ti-nav-dot-grid">
                {indices.map((qi) => {
                  const q = questions[qi];
                  const isAnswered = !!answers[q.id]?.selectedOption;
                  const isFlagged = !!answers[q.id]?.isFlagged;
                  const isCurrent = qi === currentIdx;

                  const cls = [
                    'ti-nav-dot',
                    isCurrent ? 'current' : '',
                    isAnswered && !isCurrent ? 'answered' : '',
                    isFlagged ? 'flagged' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <div key={q.id} className={cls} onClick={() => void goToQuestion(qi)} title={`Q${qi + 1}`}>
                      {qi + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="ti-nav-legend">
          <div className="ti-legend-row"><div className="ti-legend-dot" style={{ background: 'var(--accent-primary)' }} />Current</div>
          <div className="ti-legend-row"><div className="ti-legend-dot" style={{ background: 'var(--highlight)', border: '1px solid var(--accent-primary)' }} />Answered</div>
          <div className="ti-legend-row"><div className="ti-legend-dot" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />Unanswered</div>
          <div className="ti-legend-row"><div className="ti-legend-dot" style={{ background: 'var(--accent-tertiary)', borderRadius: '50%' }} />Flagged</div>
        </div>
      </div>

      <div className="ti-main">
        <div className="ti-topbar">
          <div className="ti-topbar-label">{test.title}</div>
          <div className={`ti-timer${timerCls ? ` ${timerCls}` : ''}`}>
            {timerMM}:{timerSS}
          </div>
          <button className="ti-submit-btn" onClick={() => setShowModal(true)} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>

        <div className="ti-q-scroll">
          <div className="ti-q-area">
            <div className="ti-q-head">
              <span className="ti-q-num">Question {currentIdx + 1} of {questions.length}</span>
              <span className={`ti-q-diff diff-${current.difficulty}`}>{current.difficulty}</span>
              <span className="ti-q-type">{current.question_type.replace('_', ' ')}</span>
              <button
                className={`ti-flag-btn${answers[current.id]?.isFlagged ? ' flagged' : ''}`}
                onClick={() => void toggleFlag()}
              >
                ⚑ {answers[current.id]?.isFlagged ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {current.audio_url && (
              <div className="ti-audio-player">
                <button className="ti-audio-play" onClick={() => setAudioPlaying((p) => !p)}>
                  {audioPlaying ? '⏸' : '▶'}
                </button>
                <div className="ti-audio-track">
                  <div
                    className="ti-audio-fill"
                    style={{ width: audioPlaying ? '35%' : '0%', transition: 'width 10s linear' }}
                  />
                </div>
                <div className="ti-audio-time">Audio</div>
              </div>
            )}

            <div className="ti-q-prompt">{current.prompt}</div>

            <div className="ti-options">
              {current.options.map((opt, i) => {
                const isSelected = answers[current.id]?.selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`ti-option${isSelected ? ' selected' : ''}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => void selectAnswer(current.id, opt.id)}
                  >
                    <span className="ti-option-key">{opt.id}</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="ti-bottom-nav">
          <button
            className="ti-nav-btn"
            disabled={currentIdx === 0}
            onClick={() => void goToQuestion(currentIdx - 1)}
          >
            ← Prev
          </button>
          <div className="ti-bottom-center">
            {answered} / {questions.length} answered
          </div>
          <button
            className={`ti-nav-btn${currentIdx < questions.length - 1 ? ' primary' : ''}`}
            disabled={currentIdx >= questions.length - 1}
            onClick={() => void goToQuestion(currentIdx + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {showModal && (
        <div className="ti-modal-overlay">
          <div className="ti-modal">
            <div className="ti-modal-icon">📝</div>
            <div className="ti-modal-title">Submit test?</div>
            <div className="ti-modal-sub">
              You have answered {answered} of {questions.length} questions.
            </div>
            {questions.length - answered > 0 && (
              <div className="ti-modal-warn">
                ⚠️ {questions.length - answered} unanswered questions will be marked wrong.
              </div>
            )}
            <div className="ti-modal-btns">
              <button className="ti-modal-cancel" onClick={() => setShowModal(false)}>
                Continue test
              </button>
              <button className="ti-modal-confirm" onClick={() => void handleSubmit()}>
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}