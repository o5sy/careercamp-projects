import { COPY } from '../constants'
import { AnswerBody } from './AnswerBody'

/**
 * Before/After 비교 (디자인가이드 6-7)
 * - 데스크톱 좌우 2분할 / 모바일 상하 스택
 * - Before를 "실패"로 낙인찍지 않는 뉴트럴 톤, After는 포인트 컬러의 연한 톤
 */
function Panel({ label, tone, question, answer }) {
  const isAfter = tone === 'after'
  return (
    <section
      className={`flex flex-col gap-3 rounded-2xl border p-5 sm:p-6 ${
        isAfter ? 'border-point bg-point-tint' : 'border-line bg-before'
      }`}
      aria-label={label}
    >
      <p
        className={`text-base font-bold ${isAfter ? 'text-point-ink' : 'text-ink-soft'}`}
      >
        {label}
      </p>

      <blockquote
        className={`rounded-xl border-l-4 bg-card px-4 py-3 font-semibold ${
          isAfter ? 'border-point' : 'border-ink-soft/40'
        }`}
      >
        {question}
      </blockquote>

      <div className="mt-1">
        <p className="mb-2 text-base font-semibold text-ink-soft">AI의 답</p>
        <div className="rounded-xl bg-card px-4 py-3">
          <AnswerBody text={answer} />
        </div>
      </div>
    </section>
  )
}

export function BeforeAfterPanels({
  beforeQuestion,
  beforeAnswer,
  afterQuestion,
  afterAnswer,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-start md:gap-5">
      <Panel
        label={COPY.beforeLabel}
        tone="before"
        question={beforeQuestion}
        answer={beforeAnswer}
      />
      <Panel
        label={COPY.afterLabel}
        tone="after"
        question={afterQuestion}
        answer={afterAnswer}
      />
    </div>
  )
}
