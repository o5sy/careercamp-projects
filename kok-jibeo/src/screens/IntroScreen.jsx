import { ELEMENTS, ELEMENT_ORDER, INTRO_BEFORE } from '../constants'
import { INTRO_BRANCH } from '../data/gameData'
import { BeforeAfterPanels } from '../components/BeforeAfterPanels'
import { ElementIcon, ArrowRightIcon } from '../components/icons'
import { Card, PrimaryButton, Screen, ScreenTitle } from '../components/ui'

/**
 * 인트로 — 자동차 사고 예시로 Before/After를 먼저 보여주는 데모 (기획서 7번 플로우)
 */
export function IntroScreen({ onNext }) {
  return (
    <Screen width="lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <ScreenTitle>같은 상황, 다른 질문</ScreenTitle>
          <p className="text-lg text-ink-soft">
            아래 두 질문은 같은 사고 이야기예요. 그런데 AI의 답은 이렇게 달라집니다.
          </p>
        </div>

        <BeforeAfterPanels
          beforeQuestion={INTRO_BEFORE.question}
          beforeAnswer={INTRO_BEFORE.answer}
          afterQuestion={INTRO_BRANCH.assembled_question}
          afterAnswer={INTRO_BRANCH.before_after.after_answer}
        />

        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              차이를 만든 건 이 네 가지예요
            </h2>
            <p className="mt-1 text-base text-ink-soft">
              질문에 이 네 가지를 넣어주면 AI가 훨씬 쓸모 있는 답을 줍니다.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {ELEMENT_ORDER.map((element) => {
              const meta = ELEMENTS[element]
              return (
                <li
                  key={element}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: meta.color, backgroundColor: meta.tint }}
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl text-white"
                    style={{ backgroundColor: meta.ink }}
                  >
                    <ElementIcon name={meta.icon} aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-lg font-bold" style={{ color: meta.ink }}>
                      {meta.label}
                    </span>
                    <span className="text-base text-ink">{meta.hint}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>

        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={onNext}>
            직접 연습해보기
            <ArrowRightIcon aria-hidden="true" />
          </PrimaryButton>
        </div>
      </div>
    </Screen>
  )
}
