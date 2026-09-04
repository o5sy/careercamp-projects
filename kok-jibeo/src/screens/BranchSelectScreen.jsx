import { useApp } from '../state/AppContext'
import { CircleCheckIcon, CircleIcon, ArrowRightIcon } from '../components/icons'
import { Screen, ScreenTitle, SecondaryButton, StatusPill } from '../components/ui'

/**
 * 분기 선택 — 소재의 분기들을 큰 버튼으로 제시 (branch_label 사용)
 * branches 배열을 그대로 돌기 때문에 분기가 늘어나도 그대로 동작합니다.
 */
export function BranchSelectScreen({ topic, onSelectBranch, onBackToHub }) {
  const { isBranchCompleted } = useApp()

  return (
    <Screen>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-lg font-semibold text-ink-soft">
            <span className="text-2xl" aria-hidden="true">
              {topic.topic_icon}
            </span>
            {topic.topic_label}
          </p>
          <ScreenTitle>어느 쪽 이야기에 가까우세요?</ScreenTitle>
          <p className="text-lg text-ink-soft">
            둘 다 해보셔도 좋아요. 언제든 다시 올 수 있습니다.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {topic.branches.map((branch) => {
            const done = isBranchCompleted(branch.branch_id)
            return (
              <li key={branch.branch_id}>
                <button
                  type="button"
                  onClick={() => onSelectBranch(branch)}
                  className="flex min-h-24 w-full items-center gap-4 rounded-2xl border-2 border-line bg-card p-5 text-left transition-colors duration-200 hover:border-point hover:bg-point-tint"
                >
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
                    <span className="text-xl font-bold sm:text-2xl">
                      {branch.branch_label}
                    </span>
                    {done ? (
                      <StatusPill icon={CircleCheckIcon} tone="done">
                        한 번 마쳤어요 · 다시 볼 수 있어요
                      </StatusPill>
                    ) : (
                      <StatusPill icon={CircleIcon} tone="neutral">
                        아직 시작 안 했어요
                      </StatusPill>
                    )}
                  </span>
                  <ArrowRightIcon
                    className="shrink-0 text-point-ink"
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="max-w-md">
          <SecondaryButton onClick={onBackToHub}>허브로 돌아가기</SecondaryButton>
        </div>
      </div>
    </Screen>
  )
}
