/**
 * 인라인 SVG 아이콘 모음.
 * 정답/오답을 색상만으로 구분하지 않기 위해 아이콘 + 텍스트를 항상 함께 씁니다.
 * 음식 · 조리 관련 아이콘은 사용하지 않습니다 (디자인가이드 9번).
 */

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

/** 역할 — 사람 실루엣 */
export function PersonIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

/** 상황 — 말풍선 */
export function BubbleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v4l4.5-4H20a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
    </svg>
  )
}

/** 형식 — 문서 · 표 */
export function TableIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M9 9.5V20M3 15h18" />
    </svg>
  )
}

/** 목적 — 타겟 */
export function TargetIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  )
}

/** 정답 — 체크 */
export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6.5 9.5 17 4 11.5" />
    </svg>
  )
}

/** 재도전 — 다시 시도 */
export function RetryIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4h-4" />
    </svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

/** 글씨 크게 토글 */
export function TextSizeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 19 8 6l5 13M4.6 15h6.8" />
      <path d="M14.5 19 18 10l3.5 9M15.6 16.4h4.8" />
    </svg>
  )
}

/** 결과 보기 — 막대 그래프 */
export function ChartIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  )
}

/** 미시작 — 빈 원 */
export function CircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  )
}

/** 완료 — 원 안의 체크 */
export function CircleCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  )
}

/** 진행중 — 반쯤 채워진 원 */
export function CircleHalfIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/** 복사 */
export function CopyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function SparkleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 13.6 9l5.4 1.6L13.6 12l-1.6 5.5L10.4 12 5 10.6 10.4 9z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </svg>
  )
}

const ICONS = {
  person: PersonIcon,
  bubble: BubbleIcon,
  table: TableIcon,
  target: TargetIcon,
}

/** ELEMENTS[element].icon 이름으로 아이콘 컴포넌트를 얻습니다. */
export function ElementIcon({ name, ...props }) {
  const Icon = ICONS[name] ?? CircleIcon
  return <Icon {...props} />
}
