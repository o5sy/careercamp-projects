import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ALL_BRANCHES, TOTAL_BRANCHES } from '../data/gameData'
import { ELEMENT_ORDER } from '../constants'

const STORAGE_KEY = 'kok-jibeo.progress.v1'
const FONT_KEY = 'kok-jibeo.fontLarge.v1'

/**
 * localStorage에 저장되는 진행 상태
 * {
 *   version: 1,
 *   branches: {
 *     [branch_id]: {
 *       completed: true,
 *       // "한 번에 맞혔는지" 여부 (재도전해서 맞힌 경우 false) — 결과 화면 4요소 카운트용
 *       firstTry: { '역할': true, '상황': false, '형식': true, '목적': true },
 *       completedAt: 1720000000000
 *     }
 *   }
 * }
 */
const EMPTY_PROGRESS = { version: 1, branches: {} }

function readProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.branches !== 'object') {
      return EMPTY_PROGRESS
    }
    return { version: 1, branches: parsed.branches ?? {} }
  } catch {
    // 저장 값이 깨졌거나 localStorage를 쓸 수 없는 환경 — 진행은 계속 가능하게 한다
    return EMPTY_PROGRESS
  }
}

function readFontLarge() {
  try {
    return localStorage.getItem(FONT_KEY) === '1'
  } catch {
    return false
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [progress, setProgress] = useState(readProgress)
  const [fontLarge, setFontLarge] = useState(readFontLarge)

  // 진행 상태 저장 (새로고침 후에도 유지)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* 저장 실패해도 게임 진행은 막지 않는다 */
    }
  }, [progress])

  // 글씨 크게 — 루트 폰트 배율을 바꿔 전체 화면에 즉시 반영
  useEffect(() => {
    document.documentElement.dataset.fontscale = fontLarge ? 'large' : 'normal'
    try {
      localStorage.setItem(FONT_KEY, fontLarge ? '1' : '0')
    } catch {
      /* noop */
    }
  }, [fontLarge])

  const toggleFontLarge = useCallback(() => setFontLarge((v) => !v), [])

  /**
   * 분기 완료 처리 — Before/After 화면의 "다음 상황으로"에서 호출
   * @param {string} branchId
   * @param {Record<string, boolean>} firstTry 요소별 "한 번에 맞힘" 여부
   */
  const completeBranch = useCallback((branchId, firstTry) => {
    setProgress((prev) => {
      const before = prev.branches[branchId]
      // 재방문해서 다시 풀었을 때 이전에 한 번에 맞힌 기록을 깎지 않는다 (감점 없음)
      const merged = { ...(before?.firstTry ?? {}) }
      for (const element of ELEMENT_ORDER) {
        merged[element] = Boolean(merged[element]) || Boolean(firstTry?.[element])
      }
      return {
        version: 1,
        branches: {
          ...prev.branches,
          [branchId]: { completed: true, firstTry: merged, completedAt: Date.now() },
        },
      }
    })
  }, [])

  const resetProgress = useCallback(() => setProgress(EMPTY_PROGRESS), [])

  const derived = useMemo(() => {
    const isBranchCompleted = (branchId) => Boolean(progress.branches[branchId]?.completed)

    const completedBranchIds = ALL_BRANCHES.filter(({ branch }) =>
      isBranchCompleted(branch.branch_id),
    ).map(({ branch }) => branch.branch_id)

    /** 요소별 "한 번에 맞힌" 개수 — 분모는 전체 분기 수 (요소당 분기별 1문항) */
    const elementCounts = ELEMENT_ORDER.map((element) => ({
      element,
      count: ALL_BRANCHES.reduce(
        (sum, { branch }) =>
          sum + (progress.branches[branch.branch_id]?.firstTry?.[element] ? 1 : 0),
        0,
      ),
      total: TOTAL_BRANCHES,
    }))

    /** @param {import('../data/gameData').Topic} topic */
    const topicProgress = (topic) => {
      const done = topic.branches.filter((b) => isBranchCompleted(b.branch_id)).length
      return { done, total: topic.branches.length }
    }

    return {
      isBranchCompleted,
      completedBranchIds,
      completedCount: completedBranchIds.length,
      allCompleted: completedBranchIds.length === TOTAL_BRANCHES && TOTAL_BRANCHES > 0,
      elementCounts,
      topicProgress,
    }
  }, [progress])

  const value = useMemo(
    () => ({
      progress,
      completeBranch,
      resetProgress,
      fontLarge,
      toggleFontLarge,
      ...derived,
    }),
    [progress, completeBranch, resetProgress, fontLarge, toggleFontLarge, derived],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
