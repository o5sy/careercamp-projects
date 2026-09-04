import { useApp } from '../state/AppContext'
import { CircleCheckIcon, CircleHalfIcon, CircleIcon, ArrowRightIcon } from './icons'
import { StatusPill } from './ui'

/**
 * 진행 상태 뱃지 — 색상만으로 구분하지 않도록 아이콘 + 텍스트를 함께 표시
 * @param {{done:number,total:number}} props
 */
export function ProgressStatus({ done, total }) {
  if (done === 0) {
    return (
      <StatusPill icon={CircleIcon} tone="neutral">
        아직 시작 안 했어요
      </StatusPill>
    )
  }
  if (done < total) {
    return (
      <StatusPill icon={CircleHalfIcon} tone="progress">
        {done}/{total} 진행중
      </StatusPill>
    )
  }
  return (
    <StatusPill icon={CircleCheckIcon} tone="done">
      완료 {done}/{total}
    </StatusPill>
  )
}

/**
 * 허브 · 결과 화면에서 공통으로 쓰는 소재 카드
 * @param {{ topic: import('../data/gameData').Topic, onSelect?: (topic: any) => void }} props
 */
export function TopicCard({ topic, onSelect }) {
  const { topicProgress } = useApp()
  const { done, total } = topicProgress(topic)
  const interactive = typeof onSelect === 'function'

  const inner = (
    <>
      <span className="text-4xl leading-none" aria-hidden="true">
        {topic.topic_icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <span className="text-xl font-bold sm:text-2xl">{topic.topic_label}</span>
        <ProgressStatus done={done} total={total} />
      </span>
      {interactive ? (
        <ArrowRightIcon className="shrink-0 text-point-ink" aria-hidden="true" />
      ) : null}
    </>
  )

  const shared =
    'flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left sm:p-5'

  if (!interactive) {
    return <div className={`${shared} border-line`}>{inner}</div>
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      className={`${shared} min-h-20 border-line transition-colors duration-200 hover:border-point hover:bg-point-tint`}
    >
      {inner}
    </button>
  )
}
