import { useState } from 'react'
import { ELEMENTS } from '../constants'
import { TOPICS, TOTAL_BRANCHES } from '../data/gameData'
import { useApp } from '../state/AppContext'
import { ReviewModal } from '../components/ReviewModal'
import { ProgressStatus } from '../components/TopicCard'
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CircleIcon,
  ElementIcon,
  SparkleIcon,
} from '../components/icons'
import {
  Card,
  PrimaryButton,
  Screen,
  ScreenTitle,
  StatusPill,
} from '../components/ui'

/** 점수 서열화 없이, 성장 중심 격려 문구 */
function encouragement(done, total) {
  if (done === 0) return '이제 막 시작하셨어요. 하나만 해봐도 감이 옵니다.'
  if (done >= total) return '오늘 질문 실력이 한 단계 늘었어요. 모든 상황을 연습하셨어요.'
  if (done === 1) return '첫 번째 질문을 완성하셨어요. 이 감각이 제일 중요해요.'
  return '질문 실력이 한 단계 늘었어요. 하던 대로 이어가면 됩니다.'
}

/** 4요소 카운트 — 요소당 "한 번에 맞힌" 개수를 N/전체 분기 수로 표시 */
function ElementBar({ element, count, total }) {
  const meta = ELEMENTS[element]
  const percent = total ? Math.round((count / total) * 100) : 0
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className="flex items-center gap-2 text-lg font-bold"
          style={{ color: meta.ink }}
        >
          <span
            className="flex size-8 items-center justify-center rounded-full text-base text-white"
            style={{ backgroundColor: meta.ink }}
          >
            <ElementIcon name={meta.icon} aria-hidden="true" />
          </span>
          {meta.label}
        </span>
        <span className="text-lg font-bold">
          {count}
          <span className="text-ink-soft">/{total}</span>
        </span>
      </div>
      <div
        className="h-4 w-full overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={`${meta.label} 한 번에 맞힘 ${count}/${total}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%`, backgroundColor: meta.color }}
        />
      </div>
    </li>
  )
}

export function ResultScreen({ onBackToHub }) {
  const { elementCounts, completedCount, isBranchCompleted } = useApp()
  const [review, setReview] = useState(null)

  const completedPairs = []
  for (const topic of TOPICS) {
    for (const branch of topic.branches) {
      if (isBranchCompleted(branch.branch_id)) completedPairs.push({ topic, branch })
    }
  }

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        {/* 격려 문구 */}
        <Card className="flex items-start gap-3 border-2 border-point bg-point-tint">
          <SparkleIcon className="mt-1 shrink-0 text-2xl text-point-ink" aria-hidden="true" />
          <div>
            <ScreenTitle className="text-point-ink">
              {encouragement(completedCount, TOTAL_BRANCHES)}
            </ScreenTitle>
            <p className="mt-1 text-lg text-ink">
              지금까지 {completedCount}/{TOTAL_BRANCHES}개 상황을 마쳤어요.
            </p>
          </div>
        </Card>

        {/* 4요소 카운트 */}
        <Card className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">네 가지 요소, 이렇게 챙기셨어요</h2>
            <p className="mt-1 text-base text-ink-soft">
              한 번에 고르신 개수예요. 다시 골라 맞힌 것도 연습이 된 거니 걱정하지 않으셔도
              됩니다.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {elementCounts.map(({ element, count, total }) => (
              <ElementBar key={element} element={element} count={count} total={total} />
            ))}
          </ul>
        </Card>

        {/* 소재별 · 분기별 완료 현황 (허브 카드 UI 재사용) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold sm:text-2xl">상황별 진행 현황</h2>
          <ul className="flex flex-col gap-3">
            {TOPICS.map((topic) => {
              const done = topic.branches.filter((b) => isBranchCompleted(b.branch_id)).length
              return (
                <li key={topic.topic}>
                  <Card className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl leading-none" aria-hidden="true">
                        {topic.topic_icon}
                      </span>
                      <span className="flex-1 text-xl font-bold">{topic.topic_label}</span>
                      <ProgressStatus done={done} total={topic.branches.length} />
                    </div>
                    <ul className="flex flex-col gap-2">
                      {topic.branches.map((branch) => {
                        const complete = isBranchCompleted(branch.branch_id)
                        return (
                          <li
                            key={branch.branch_id}
                            className="flex flex-wrap items-center gap-2 rounded-xl bg-canvas px-3 py-2"
                          >
                            <span className="min-w-0 flex-1 text-base font-semibold">
                              {branch.branch_label}
                            </span>
                            {complete ? (
                              <StatusPill icon={CircleCheckIcon} tone="done">
                                완료
                              </StatusPill>
                            ) : (
                              <StatusPill icon={CircleIcon} tone="neutral">
                                미완료
                              </StatusPill>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>

        {/* 분기별 다시보기 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold sm:text-2xl">완성한 질문 다시보기</h2>
          {completedPairs.length === 0 ? (
            <p className="text-lg text-ink-soft">
              상황을 하나 마치면 여기서 완성한 질문을 다시 볼 수 있어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {completedPairs.map(({ topic, branch }) => (
                <li key={branch.branch_id}>
                  <button
                    type="button"
                    onClick={() => setReview({ topic, branch })}
                    className="flex min-h-14 w-full items-center gap-3 rounded-xl border-2 border-line bg-card p-4 text-left transition-colors duration-200 hover:border-point hover:bg-point-tint"
                  >
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {topic.topic_icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base text-ink-soft">
                        {topic.topic_label}
                      </span>
                      <span className="block text-lg font-bold">
                        {branch.branch_label}
                      </span>
                    </span>
                    <ArrowRightIcon className="shrink-0 text-point-ink" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={onBackToHub}>
            {completedCount < TOTAL_BRANCHES
              ? '허브로 돌아가서 이어하기'
              : '허브로 돌아가기'}
            <ArrowRightIcon aria-hidden="true" />
          </PrimaryButton>
        </div>
      </div>

      {review ? (
        <ReviewModal
          topic={review.topic}
          branch={review.branch}
          onClose={() => setReview(null)}
        />
      ) : null}
    </Screen>
  )
}
