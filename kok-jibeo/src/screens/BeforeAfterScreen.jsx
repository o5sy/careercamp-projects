import { BeforeAfterPanels } from '../components/BeforeAfterPanels'
import { ArrowRightIcon } from '../components/icons'
import { PrimaryButton, Screen, ScreenTitle } from '../components/ui'

/**
 * Before/After 비교 화면 — 이 화면의 CTA에서 분기를 완료 처리하고 허브로 돌아갑니다.
 */
export function BeforeAfterScreen({ topic, branch, onComplete }) {
  return (
    <Screen width="lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-lg font-semibold text-ink-soft">
            <span className="text-2xl" aria-hidden="true">
              {topic.topic_icon}
            </span>
            {topic.topic_label} · {branch.branch_label}
          </p>
          <ScreenTitle>질문이 좋아지면 답이 이렇게 달라져요</ScreenTitle>
        </div>

        <BeforeAfterPanels
          beforeQuestion={branch.before_after.before_question}
          beforeAnswer={branch.before_after.before_answer}
          afterQuestion={branch.assembled_question}
          afterAnswer={branch.before_after.after_answer}
        />

        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={onComplete}>
            다음 상황으로
            <ArrowRightIcon aria-hidden="true" />
          </PrimaryButton>
        </div>
      </div>
    </Screen>
  )
}
