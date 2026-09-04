import { ELEMENT_ORDER, GAME_TAGLINE, GAME_TITLE, LOGO_DATA_URI } from '../constants'
import { TOTAL_QUESTIONS, TOTAL_BRANCHES } from '../data/gameData'
import { useApp } from '../state/AppContext'
import { ElementBadge, PrimaryButton, Screen, SecondaryButton } from '../components/ui'
import { ArrowRightIcon, SparkleIcon } from '../components/icons'

export function StartScreen({ onStart, onSkipIntro }) {
  const { completedCount } = useApp()

  return (
    <Screen width="sm" className="pt-12 sm:pt-16">
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-point bg-point-tint px-4 py-1.5 text-base font-semibold text-point-ink">
          <SparkleIcon aria-hidden="true" />
          AI에게 질문하는 법, 연습해요
        </p>

        <img src={LOGO_DATA_URI} alt="콕집어 로고" className="h-32 w-auto sm:h-40" />

        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          {GAME_TITLE}
        </h1>

        <p className="text-xl leading-relaxed">
          {GAME_TAGLINE}
          <br />
          <span className="text-ink-soft">
            실제로 겪을 수 있는 상황 {TOTAL_BRANCHES}가지, 문항 {TOTAL_QUESTIONS}개로
            차근차근 연습해봅니다.
          </span>
        </p>

        <ul className="flex flex-wrap justify-center gap-2" aria-label="질문의 4요소">
          {ELEMENT_ORDER.map((element) => (
            <li key={element}>
              <ElementBadge element={element} size="lg" />
            </li>
          ))}
        </ul>

        <div className="mt-2 flex w-full flex-col gap-3">
          <PrimaryButton onClick={onStart}>
            시작하기
            <ArrowRightIcon aria-hidden="true" />
          </PrimaryButton>
          {completedCount > 0 ? (
            <SecondaryButton onClick={onSkipIntro}>
              이어서 하기 ({completedCount}/{TOTAL_BRANCHES} 완료)
            </SecondaryButton>
          ) : null}
        </div>
      </div>
    </Screen>
  )
}
