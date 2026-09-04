import { useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'
import { QuietButton } from './ui'

/** 완성된 질문을 클립보드에 복사하는 버튼 — 복사 성공 시 잠깐 "복사했어요"로 바뀝니다. */
export function CopyQuestionButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 클립보드 권한이 없는 환경 — 실패해도 게임 진행에는 영향 없다 */
    }
  }

  return (
    <QuietButton
      type="button"
      onClick={handleCopy}
      className={`border-2 border-line ${className}`}
    >
      {copied ? (
        <CheckIcon className="text-correct-ink" aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? '복사했어요' : '질문 복사하기'}</span>
    </QuietButton>
  )
}
