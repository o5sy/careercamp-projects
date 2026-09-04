import { useEffect, useRef, useState } from 'react'
import { ANSWERS, drawAnswer } from '../data/answers'

const OPEN_DURATION = 1200
const CLOSE_DURATION = 1200

export default function OracleBook() {
  const [phase, setPhase] = useState('idle') // idle | opening | result | closing
  const [question, setQuestion] = useState('')
  const [askedQuestion, setAskedQuestion] = useState('') // 펼쳐진 책 왼쪽 페이지에 고정 표시되는 질문
  const [pageIndex, setPageIndex] = useState(0) // ANSWERS 배열 인덱스 = 현재 펼쳐진 장(chapter)
  const [navDir, setNavDir] = useState(null) // 'next' | 'prev' | null
  const [shake, setShake] = useState(false)
  const [toast, setToast] = useState('')
  const lastIndexRef = useRef(null)
  const timerRef = useRef(null)
  const bookRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (phase !== 'result') return
    function handleOutsideClick(e) {
      if (bookRef.current && !bookRef.current.contains(e.target)) {
        closeBook()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [phase])

  function askOracle() {
    if (!question.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    if (phase !== 'idle') return
    const drawn = drawAnswer(lastIndexRef.current)
    lastIndexRef.current = drawn.index
    const askedQ = question
    setPhase('opening')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setAskedQuestion(askedQ)
      setPageIndex(drawn.index)
      setNavDir(null)
      setPhase('result')
    }, OPEN_DURATION)
  }

  function openBrowse() {
    if (phase !== 'idle') return
    const drawn = drawAnswer(lastIndexRef.current)
    lastIndexRef.current = drawn.index
    setPhase('opening')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setAskedQuestion('')
      setPageIndex(drawn.index)
      setNavDir(null)
      setPhase('result')
    }, OPEN_DURATION)
  }

  function closeBook() {
    if (phase !== 'result') return
    setPhase('closing')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setPhase('idle')
      setQuestion('')
      setAskedQuestion('')
      setNavDir(null)
    }, CLOSE_DURATION)
  }

  function navigate(delta) {
    if (phase !== 'result') return
    const next = pageIndex + delta
    if (next < 0 || next >= ANSWERS.length) return
    setNavDir(delta > 0 ? 'next' : 'prev')
    setPageIndex(next)
  }

  function handleQuestionKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askOracle()
    }
  }

  async function shareResult() {
    const shareText = askedQuestion
      ? `Q. ${askedQuestion}\nA. ${current.text}\n\n- 니책임 결정의 서 -`
      : `A. ${current.text}\n\n- 니책임 결정의 서 -`
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
        return
      } catch {
        // 사용자가 공유를 취소한 경우 클립보드로 대체
      }
    }
    try {
      await navigator.clipboard.writeText(shareText)
      setToast('결과가 복사되었습니다')
      setTimeout(() => setToast(''), 1800)
    } catch {
      setToast('복사에 실패했습니다')
      setTimeout(() => setToast(''), 1800)
    }
  }

  const bookOpen = phase === 'opening' || phase === 'result'
  const current = ANSWERS[pageIndex]
  const showPage = phase === 'result' || phase === 'closing'

  return (
    <div className="oracle-stage">
      <div className="book-wrap">
        <div ref={bookRef} className={`book ${bookOpen ? 'is-open' : 'is-closed'}`}>
          <div className="page-left" onClick={() => navigate(-1)}>
            {showPage && askedQuestion && (
              <div
                className={`page-content ${navDir === 'next' ? 'slide-next' : navDir === 'prev' ? 'slide-prev' : ''}`}
                key={`q-${pageIndex}`}
              >
                <p className="page-left-label">Q.</p>
                <p className="result-question">&ldquo;{askedQuestion}&rdquo;</p>
              </div>
            )}
          </div>
          <div className="book-spine" aria-hidden="true" />
          <div className="book-page" onClick={() => navigate(1)}>
            {showPage && (
              <>
                <div
                  className={`page-content ${navDir === 'next' ? 'slide-next' : navDir === 'prev' ? 'slide-prev' : ''}`}
                  key={pageIndex}
                >
                  <p className="chapter-label">제{pageIndex + 1}장</p>
                  <p className={`result-answer ${current.source === 'viewer' ? 'is-viewer' : ''}`}>
                    {current.text}
                    <span className="stamp-mark" key={`stamp-${pageIndex}`} aria-hidden="true">
                      니<br />책임.
                    </span>
                  </p>
                  <div className="result-actions">
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeBook()
                      }}
                    >
                      책 덮기
                    </button>
                    <button
                      type="button"
                      className="ask-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareResult()
                      }}
                    >
                      결과 공유하기
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="book-cover" onClick={openBrowse}>
            <h1 className="book-title">
              <span className="book-title-line">니</span>
              <span className="book-title-line">
                책임<span className="book-title-dot">.</span>
              </span>
            </h1>
          </div>
        </div>
      </div>

      {phase === 'idle' && (
        <div className={`ask-panel ${shake ? 'shake' : ''}`}>
          <textarea
            className="question-input"
            placeholder="무엇이 그리 고민이십니까... 여기에 적어주십시오..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleQuestionKeyDown}
            maxLength={200}
            rows={3}
          />
          <div className="ask-panel-actions">
            <button type="button" className="ask-btn" onClick={askOracle}>
              <span>결정의 서 펼치기</span>
              <svg
                className="enter-icon"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 10 4 15 9 20" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
