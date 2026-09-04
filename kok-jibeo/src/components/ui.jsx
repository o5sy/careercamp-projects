import { ELEMENTS } from '../constants'
import { ElementIcon } from './icons'

/**
 * 화면 공통 래퍼 — 한 화면에 정보 밀도를 낮추고 여백을 충분히 둡니다.
 * 하단 여백 최소 24px 이상 확보.
 */
export function Screen({ children, width = 'md', className = '' }) {
  const maxWidth = { sm: 'max-w-xl', md: 'max-w-3xl', lg: 'max-w-5xl' }[width]
  return (
    <main
      className={`mx-auto w-full ${maxWidth} px-4 pt-6 pb-12 sm:px-6 sm:pt-8 ${className}`}
    >
      {children}
    </main>
  )
}

export function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-card p-5 sm:p-6 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function ScreenTitle({ children, className = '' }) {
  return (
    <h1 className={`text-2xl font-bold leading-snug sm:text-3xl ${className}`}>
      {children}
    </h1>
  )
}

/** 주요 CTA — 터치 영역 56px 이상, 흰 글씨와 AA 대비를 만족하는 진한 테라코타 */
export function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-point-strong px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-point-ink active:bg-point-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-ink ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** 보조 버튼 — 흰 배경 + 테두리 */
export function SecondaryButton({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-line bg-card px-6 py-3 text-lg font-semibold text-ink transition-colors duration-200 hover:border-point hover:bg-point-tint disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-ink-soft ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** 상단 바 · 인라인용 작은 버튼 (터치 영역 44px 이상) */
export function QuietButton({ children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-base font-semibold text-ink transition-colors duration-200 hover:bg-point-tint disabled:cursor-not-allowed disabled:text-ink-soft disabled:hover:bg-transparent ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** 4요소 뱃지 — 라운드 사각, 색상 + 아이콘 + 텍스트 (중립적 아이콘만 사용) */
export function ElementBadge({ element, size = 'md', className = '' }) {
  const meta = ELEMENTS[element]
  if (!meta) return null
  const sizing =
    size === 'lg'
      ? 'gap-2 px-4 py-2 text-lg'
      : size === 'sm'
        ? 'gap-1 px-2.5 py-1 text-base' /* 16px 미만으로 줄이지 않는다 */
        : 'gap-1.5 px-3 py-1.5 text-base'
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizing} ${className}`}
      style={{ backgroundColor: meta.tint, borderColor: meta.color, color: meta.ink }}
    >
      <ElementIcon name={meta.icon} aria-hidden="true" />
      {meta.label}
    </span>
  )
}

/** 진행 상태 뱃지 (미시작 / N/2 진행중 / 완료) */
export function StatusPill({ icon: Icon, children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'border-line bg-canvas text-ink-soft',
    progress: 'border-retry bg-retry-tint text-retry-ink',
    done: 'border-correct bg-correct-tint text-correct-ink',
  }
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-base font-semibold ${tones[tone]} ${className}`}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

/** 줄바꿈(\n)을 문단으로 렌더링 */
export function Paragraphs({ text, className = '' }) {
  const lines = String(text ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  )
}
