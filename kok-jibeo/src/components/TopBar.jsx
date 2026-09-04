import { GAME_TITLE, LOGO_DATA_URI } from '../constants'
import { useApp } from '../state/AppContext'
import { ArrowLeftIcon, ChartIcon, TextSizeIcon } from './icons'
import { QuietButton } from './ui'

/**
 * 상단 고정 바 (디자인가이드 4번)
 * - 좌측: 현재 위치 + "허브로" 뒤로가기
 * - 우측: "지금까지 결과 보기" + "글씨 크게" 토글 (항상 노출)
 */
export function TopBar({ location, onBack, backLabel = '허브로', onOpenResult }) {
  const { fontLarge, toggleFontLarge, completedCount } = useApp()
  const resultEnabled = Boolean(onOpenResult) && completedCount > 0

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 sm:px-6">
        {onBack ? (
          <QuietButton onClick={onBack} aria-label={`${backLabel}로 돌아가기`}>
            <ArrowLeftIcon aria-hidden="true" />
            <span>{backLabel}</span>
          </QuietButton>
        ) : (
          <div className="flex items-center gap-2 px-2">
            <img src={LOGO_DATA_URI} alt="" className="h-8 w-auto" aria-hidden="true" />
            <span className="text-base font-bold text-point-ink">{GAME_TITLE}</span>
          </div>
        )}

        <p className="order-last min-w-full basis-full truncate px-2 text-base text-ink-soft sm:order-none sm:min-w-0 sm:basis-auto sm:flex-1">
          {location}
        </p>

        <div className="ml-auto flex items-center gap-1">
          <QuietButton
            onClick={onOpenResult}
            disabled={!resultEnabled}
            title={
              resultEnabled ? undefined : '한 개 이상 마치면 결과를 볼 수 있어요'
            }
          >
            <ChartIcon aria-hidden="true" />
            <span className="hidden sm:inline">지금까지 결과 보기</span>
            <span className="sm:hidden">결과</span>
          </QuietButton>

          <QuietButton
            onClick={toggleFontLarge}
            aria-pressed={fontLarge}
            className={
              fontLarge
                ? 'border-2 border-point bg-point-tint text-point-ink'
                : 'border-2 border-line'
            }
          >
            <TextSizeIcon aria-hidden="true" />
            <span>글씨 크게</span>
            <span className="sr-only">{fontLarge ? '켜짐' : '꺼짐'}</span>
          </QuietButton>
        </div>
      </div>
    </header>
  )
}
