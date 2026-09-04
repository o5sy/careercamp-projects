import { ELEMENT_ORDER } from '../constants'
import { ArrowRightIcon } from '../components/icons'
import {
  Card,
  ElementBadge,
  PrimaryButton,
  Screen,
  ScreenTitle,
  SecondaryButton,
} from '../components/ui'

/** 상황 카드 — 분기 진입 첫 화면 (situation_card) */
export function SituationScreen({ topic, branch, onStart, onBack }) {
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
          <ScreenTitle>이런 상황이에요</ScreenTitle>
        </div>

        <Card className="border-l-4 border-l-point text-lg leading-relaxed">
          {branch.situation_card}
        </Card>

        <Card className="flex flex-col gap-3 bg-canvas">
          <p className="text-base font-semibold">
            이제 네 가지를 차례대로 골라 질문을 만들어봅니다.
          </p>
          <ol className="flex flex-wrap items-center gap-2">
            {ELEMENT_ORDER.map((element, i) => (
              <li key={element} className="flex items-center gap-2">
                {i > 0 ? (
                  <span className="text-ink-soft" aria-hidden="true">
                    →
                  </span>
                ) : null}
                <ElementBadge element={element} />
              </li>
            ))}
          </ol>
        </Card>

        <div className="flex flex-col gap-3">
          <PrimaryButton onClick={onStart}>
            질문 만들어보기
            <ArrowRightIcon aria-hidden="true" />
          </PrimaryButton>
          <SecondaryButton onClick={onBack}>다른 상황 고르기</SecondaryButton>
        </div>
      </div>
    </Screen>
  )
}
