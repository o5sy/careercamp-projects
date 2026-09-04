/**
 * AI 답변 텍스트 렌더러.
 * - 마크다운 표(`| 순서 | 해야 할 일 | 이유 |`)는 실제 표로 렌더링하고,
 *   좁은 화면(360~400px)에서는 CSS로 세로 카드 형태로 바뀝니다 (가로 스크롤 없음).
 * - 표가 아닌 경우 줄바꿈(\n)을 문단으로, "1) 2) 3)" 형태는 번호 목록으로 렌더링합니다.
 */

const ROW = /^\s*\|(.+)\|\s*$/
const SEPARATOR = /^\s*\|[\s:|-]+\|\s*$/
const NUMBERED = /^\d+\)\s*/

function isRow(line) {
  return typeof line === 'string' && ROW.test(line)
}

function isSeparator(line) {
  return typeof line === 'string' && SEPARATOR.test(line)
}

function cells(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

/** 한 줄에 "1) ... 2) ..."가 이어져 있으면 항목별로 끊어 준다 */
function splitNumbered(line) {
  const parts = line.split(/\s+(?=\d+\)\s)/)
  return parts.length > 1 ? parts.map((p) => p.trim()) : [line]
}

/**
 * @param {string} text
 * @returns {Array<{type:'table',header:string[],rows:string[][]}|{type:'list',items:string[]}|{type:'text',lines:string[]}>}
 */
export function parseAnswer(text) {
  const lines = String(text ?? '').split('\n')
  const blocks = []
  /** @type {string[]} */
  let buffer = []

  const flush = () => {
    if (!buffer.length) return
    const out = []
    for (const line of buffer) out.push(...splitNumbered(line))
    // 연속된 번호 항목은 하나의 목록으로 묶는다
    let run = null
    for (const line of out) {
      if (NUMBERED.test(line)) {
        if (!run) {
          run = { type: 'list', items: [] }
          blocks.push(run)
        }
        run.items.push(line)
      } else {
        run = null
        blocks.push({ type: 'text', lines: [line] })
      }
    }
    buffer = []
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (isRow(line) && isSeparator(lines[i + 1])) {
      flush()
      const header = cells(line)
      const rows = []
      i += 2
      while (i < lines.length && isRow(lines[i])) {
        rows.push(cells(lines[i]))
        i += 1
      }
      i -= 1
      blocks.push({ type: 'table', header, rows })
    } else if (!line.trim()) {
      flush()
    } else {
      buffer.push(line.trim())
    }
  }
  flush()
  return blocks
}

function AnswerTable({ header, rows }) {
  return (
    <table className="kj-table">
      <thead>
        <tr>
          {header.map((cell, i) => (
            <th key={i} scope="col">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c} data-label={header[c] ?? ''}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function AnswerBody({ text, className = '' }) {
  const blocks = parseAnswer(text)
  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'table') {
          return <AnswerTable key={i} header={block.header} rows={block.rows} />
        }
        if (block.type === 'list') {
          return (
            <ol key={i} className="space-y-2">
              {block.items.map((item, j) => {
                const marker = item.match(NUMBERED)?.[0].trim() ?? ''
                return (
                  <li key={j} className="flex gap-2">
                    <span className="font-bold text-point-ink" aria-hidden="true">
                      {marker}
                    </span>
                    <span>{item.replace(NUMBERED, '')}</span>
                  </li>
                )
              })}
            </ol>
          )
        }
        return (
          <p key={i}>{block.lines.join(' ')}</p>
        )
      })}
    </div>
  )
}
