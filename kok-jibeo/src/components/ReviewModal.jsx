import { useEffect, useRef } from 'react'
import { COPY } from '../constants'
import { BeforeAfterPanels } from './BeforeAfterPanels'
import { CopyQuestionButton } from './CopyQuestionButton'
import { HighlightedQuestion } from './HighlightedQuestion'
import { CloseIcon } from './icons'
import { SecondaryButton } from './ui'

/**
 * 분기별 다시보기 — 완성된 질문 + Before/After를 다시 볼 수 있는 모달
 */
export function ReviewModal({ topic, branch, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/40 p-3 sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="mx-auto w-full max-w-4xl rounded-2xl border border-line bg-canvas p-4 sm:p-6"
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-base font-semibold text-ink-soft">
              <span className="text-xl" aria-hidden="true">
                {topic.topic_icon}
              </span>
              {topic.topic_label}
            </p>
            <h2 id="review-title" className="text-xl font-bold sm:text-2xl">
              {branch.branch_label}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-line bg-card text-xl transition-colors duration-200 hover:border-point hover:bg-point-tint"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border-2 border-point bg-point-tint p-4 sm:p-5">
            <p className="mb-2 text-base font-bold text-point-ink">
              {COPY.assembledLabel}
            </p>
            <blockquote className="rounded-xl border-l-4 border-point bg-card px-4 py-3 text-lg font-semibold leading-relaxed sm:text-xl">
              <HighlightedQuestion text={branch.assembled_question} />
            </blockquote>
            <div className="mt-3">
              <CopyQuestionButton text={branch.assembled_question} />
            </div>
          </section>

          <BeforeAfterPanels
            beforeQuestion={branch.before_after.before_question}
            beforeAnswer={branch.before_after.before_answer}
            afterQuestion={branch.assembled_question}
            afterAnswer={branch.before_after.after_answer}
          />

          <div className="mx-auto w-full max-w-xs">
            <SecondaryButton onClick={onClose}>닫기</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
