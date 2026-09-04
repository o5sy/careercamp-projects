import { useEffect, useState } from 'react'
import { COPY, ELEMENTS } from '../constants'
import { ArrowRightIcon, ElementIcon } from '../components/icons'
import { CopyQuestionButton } from '../components/CopyQuestionButton'
import { HighlightedQuestion } from '../components/HighlightedQuestion'
import { Card, ElementBadge, PrimaryButton, Screen, ScreenTitle } from '../components/ui'

const STEP_DELAY = 300 // 0.3초 간격

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * 완성된 질문 화면
 * - 4단계에서 고른 정답 선택지의 text를 순서대로 하나씩 등장 (fade-in, 0.3초 간격)
 * - 애니메이션이 끝나면 assembled_question 전체를 큰 인용구 카드로 강조
 */
export function AssembledScreen({ topic, branch, picks, onNext }) {
  const parts = branch.questions.map((question, i) => ({
    element: question.element,
    text: question.choices[picks[i]]?.text ?? '',
  }))

  const reduced = prefersReducedMotion()
  const [visible, setVisible] = useState(() => (reduced ? parts.length + 1 : 0))

  useEffect(() => {
    if (reduced) return
    const timers = []
    for (let i = 1; i <= parts.length + 1; i += 1) {
      timers.push(window.setTimeout(() => setVisible(i), STEP_DELAY * i))
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch.branch_id])

  const showFull = visible > parts.length

  return (
    <Screen width="sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-lg font-semibold text-ink-soft">
            <span className="text-2xl" aria-hidden="true">
              {topic.topic_icon}
            </span>
            {topic.topic_label} · {branch.branch_label}
          </p>
          <ScreenTitle>네 가지가 모두 들어갔어요</ScreenTitle>
        </div>

        {/* 4요소가 순서대로 붙는 조립 애니메이션 */}
        <ol className="flex flex-col gap-3">
          {parts.map((part, i) => {
            const meta = ELEMENTS[part.element]
            const shown = visible > i
            return (
              <li
                key={part.element}
                className={shown ? 'kj-fade-in' : 'invisible'}
                aria-hidden={!shown}
              >
                <div
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ borderColor: meta?.color, backgroundColor: meta?.tint }}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-lg text-white"
                    style={{ backgroundColor: meta?.ink }}
                  >
                    <ElementIcon name={meta?.icon} aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span
                      className="text-base font-bold"
                      style={{ color: meta?.ink }}
                    >
                      {meta?.label}
                    </span>
                    <span className="text-lg font-semibold text-ink">{part.text}</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>

        {/* 완성 문장 — 큰 인용구 카드 */}
        <div aria-live="polite">
          {showFull ? (
            <Card className="kj-fade-in border-2 border-point bg-point-tint">
              <p className="mb-3 flex flex-wrap items-center gap-2 text-base font-bold text-point-ink">
                {COPY.assembledLabel}
                <span className="flex gap-1">
                  {parts.map((part) => (
                    <ElementBadge key={part.element} element={part.element} size="sm" />
                  ))}
                </span>
              </p>
              <blockquote className="rounded-xl border-l-4 border-point bg-card px-4 py-4 text-xl font-semibold leading-relaxed sm:text-2xl">
                <HighlightedQuestion text={branch.assembled_question} />
              </blockquote>
              <div className="mt-3">
                <CopyQuestionButton text={branch.assembled_question} />
              </div>
            </Card>
          ) : null}
        </div>

        {showFull ? (
          <div className="kj-fade-in">
            <PrimaryButton onClick={onNext}>
              이 질문, AI한테 어떤 답을 줄까요?
              <ArrowRightIcon aria-hidden="true" />
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </Screen>
  )
}
