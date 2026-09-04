import { ELEMENTS } from '../constants'

/** 문장 종결 부호(.) 기준으로 나눈다 — 따옴표 안에는 마침표가 없는 문구들이라 안전하다 */
function splitSentences(text) {
  const matches = text.match(/[^.]+\.+/g) ?? [text]
  return matches.map((s) => s.trim()).filter(Boolean)
}

/**
 * assembled_question은 항상 "역할 → 상황(1개 이상 문장) → 형식 → 목적" 순서로 쓰여 있어서
 * 첫 문장 = 역할, 마지막 문장 = 목적, 그 앞 문장 = 형식, 나머지 중간 문장들 = 상황으로 나눌 수 있다.
 */
function getSegments(assembledQuestion) {
  const sentences = splitSentences(assembledQuestion)
  if (sentences.length < 4) {
    return [{ element: null, text: assembledQuestion }]
  }
  const last = sentences.length - 1
  return [
    { element: '역할', text: sentences[0] },
    { element: '상황', text: sentences.slice(1, last - 1).join(' ') },
    { element: '형식', text: sentences[last - 1] },
    { element: '목적', text: sentences[last] },
  ]
}

/** 완성된 질문 문장 — 4요소 구간을 태그와 같은 색으로 살짝 강조한다 (글자색은 그대로 둔다) */
export function HighlightedQuestion({ text, className = '' }) {
  const segments = getSegments(text)
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        const meta = seg.element ? ELEMENTS[seg.element] : null
        return (
          <span key={i}>
            {i > 0 ? ' ' : ''}
            <mark
              style={{ backgroundColor: meta?.tint ?? 'transparent', color: 'inherit' }}
              className="rounded px-0.5"
            >
              {seg.text}
            </mark>
          </span>
        )
      })}
    </span>
  )
}
