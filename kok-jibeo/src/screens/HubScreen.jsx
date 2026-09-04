import { TOPICS, TOTAL_BRANCHES } from '../data/gameData'
import { useApp } from '../state/AppContext'
import { TopicCard } from '../components/TopicCard'
import { ChartIcon, CircleCheckIcon } from '../components/icons'
import { Card, Screen, ScreenTitle, SecondaryButton } from '../components/ui'

/**
 * 허브 — topics 배열을 그대로 렌더링하므로 소재를 추가하면 카드가 자동으로 늘어납니다.
 */
export function HubScreen({ onSelectTopic, onOpenResult }) {
  const { completedCount, allCompleted } = useApp()

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        {allCompleted ? (
          <Card className="flex items-center gap-3 border-correct bg-correct-tint">
            <CircleCheckIcon
              className="shrink-0 text-2xl text-correct-ink"
              aria-hidden="true"
            />
            <div>
              <p className="text-xl font-bold text-correct-ink">
                전체 완료 ({TOTAL_BRANCHES}/{TOTAL_BRANCHES})
              </p>
              <p className="text-base text-ink">
                모든 상황을 다 연습하셨어요. 결과 화면에서 한 번에 돌아볼 수 있어요.
              </p>
            </div>
          </Card>
        ) : null}

        <div className="flex flex-col gap-2">
          <ScreenTitle>어떤 상황부터 연습해볼까요?</ScreenTitle>
          <p className="text-lg text-ink-soft">
            순서는 자유예요. 내 이야기와 가까운 것부터 골라보세요.
            {completedCount > 0 ? (
              <>
                {' '}
                지금까지 {completedCount}/{TOTAL_BRANCHES}개를 마쳤어요.
              </>
            ) : null}
          </p>
        </div>

        <div className="max-w-md">
          <SecondaryButton
            onClick={onOpenResult}
            disabled={completedCount === 0}
            title={
              completedCount === 0 ? '한 개 이상 마치면 결과를 볼 수 있어요' : undefined
            }
          >
            <ChartIcon aria-hidden="true" />
            지금까지 결과 보기
          </SecondaryButton>
          {completedCount === 0 ? (
            <p className="mt-2 text-base text-ink-soft">
              상황 하나를 마치면 결과를 볼 수 있어요.
            </p>
          ) : null}
        </div>

        <ul className="flex flex-col gap-3">
          {TOPICS.map((topic) => (
            <li key={topic.topic}>
              <TopicCard topic={topic} onSelect={onSelectTopic} />
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}
