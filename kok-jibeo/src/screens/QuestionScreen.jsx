import { useState } from 'react'
import { COPY, ELEMENTS } from '../constants'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  RetryIcon,
} from '../components/icons'
import { ElementBadge, PrimaryButton, Screen } from '../components/ui'

/**
 * 문항 화면 (역할 → 상황 → 형식 → 목적, 4회 반복)
 * - 오답도 학습 요소이므로 선택한 오답과 그 피드백을 지우지 않고 남겨둡니다.
 * - 재도전 무제한 · 감점 없음. 단, "한 번에 맞혔는지"만 결과 집계용으로 따로 전달합니다.
 */
export function QuestionScreen({ topic, branch, stepIndex, onSolved }) {
  const question = branch.questions[stepIndex]
  const total = branch.questions.length
  const meta = ELEMENTS[question.element]

  /** 사용자가 누른 선택지 index 목록 (누른 순서) */
  const [picks, setPicks] = useState([])

  const solvedIndex = picks.find((i) => question.choices[i].correct)
  const solved = solvedIndex !== undefined
  const lastPick = picks.length ? picks[picks.length - 1] : null
  const showRetryNotice = !solved && lastPick !== null

  const handlePick = (index) => {
    if (solved || picks.includes(index)) return
    setPicks((prev) => [...prev, index])
  }

  const handleNext = () => {
    // 한 번에 맞힘 = 첫 선택이 곧 정답이었던 경우
    onSolved(solvedIndex, picks.length === 1)
  }

  return (
    <Screen width="sm">
      <div className="flex flex-col gap-5">
        {/* 진행률 + 현재 요소 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <ElementBadge element={question.element} size="lg" />
            <p className="text-lg font-bold text-ink-soft">
              <span className="sr-only">진행률 </span>
              {stepIndex + 1}/{total}
            </p>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="질문 만들기 진행률"
          >
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${((stepIndex + (solved ? 1 : 0)) / total) * 100}%`,
                backgroundColor: meta?.color,
              }}
            />
          </div>
        </div>

        {/* 상황 다시 보기 */}
        <details className="rounded-xl border border-line bg-card px-4 py-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-base font-semibold text-ink-soft">
            상황 다시 보기
            <ChevronDownIcon aria-hidden="true" />
          </summary>
          <p className="pt-2 text-base leading-relaxed">{branch.situation_card}</p>
        </details>

        {/* 문항 */}
        <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
          {question.prompt}
        </h1>
        <p className="-mt-2 text-base text-ink-soft">{meta?.hint}</p>

        {/* 재도전 안내 (색상만으로 구분하지 않도록 아이콘 + 텍스트 병기) */}
        <div aria-live="polite">
          {showRetryNotice ? (
            <p className="flex items-center gap-2 rounded-xl border border-retry bg-retry-tint px-4 py-3 text-lg font-semibold text-retry-ink">
              <RetryIcon className="shrink-0 text-xl" aria-hidden="true" />
              {COPY.retryTitle} 아래 설명을 보고 다른 것도 골라보세요.
            </p>
          ) : null}
        </div>

        {/* 선택지 — 세로 1열, 터치 영역 56px 이상 */}
        <ul className="flex flex-col gap-3">
          {question.choices.map((choice, index) => {
            const picked = picks.includes(index)
            const isCorrect = picked && choice.correct
            const isWrong = picked && !choice.correct
            const disabled = picked || solved

            let tone = 'border-line bg-card hover:border-point hover:bg-point-tint'
            if (isCorrect) tone = 'border-correct bg-correct-tint'
            else if (isWrong) tone = 'border-retry bg-retry-tint'
            else if (solved) tone = 'border-line bg-card opacity-70'

            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handlePick(index)}
                  disabled={disabled}
                  aria-describedby={picked ? `feedback-${stepIndex}-${index}` : undefined}
                  className={`flex min-h-14 w-full items-start gap-3 rounded-xl border-2 p-4 text-left text-lg font-semibold transition-colors duration-200 disabled:cursor-default ${tone}`}
                >
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-base ${
                      isCorrect
                        ? 'border-correct bg-correct text-white'
                        : isWrong
                          ? 'border-retry bg-retry text-white'
                          : 'border-line text-ink-soft'
                    }`}
                    aria-hidden="true"
                  >
                    {isCorrect ? (
                      <CheckIcon />
                    ) : isWrong ? (
                      <RetryIcon />
                    ) : (
                      <span className="text-base font-bold">{index + 1}</span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">{choice.text}</span>
                </button>

                {picked ? (
                  <p
                    id={`feedback-${stepIndex}-${index}`}
                    className={`kj-fade-in mt-2 ml-4 border-l-4 pl-3 text-base leading-relaxed ${
                      isCorrect
                        ? 'border-correct text-correct-ink'
                        : 'border-retry text-retry-ink'
                    }`}
                  >
                    <span className="font-bold">
                      {isCorrect ? '정답 · ' : '살펴보기 · '}
                    </span>
                    {choice.feedback}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>

        {solved ? (
          <div className="kj-fade-in">
            <PrimaryButton onClick={handleNext} autoFocus>
              {stepIndex + 1 < total ? '다음으로' : '완성된 질문 보기'}
              <ArrowRightIcon aria-hidden="true" />
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </Screen>
  )
}
