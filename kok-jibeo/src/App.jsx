import { useCallback, useEffect, useMemo, useState } from 'react'
import { GAME_TITLE, SCREENS } from './constants'
import { findBranch, findTopic } from './data/gameData'
import { useApp } from './state/AppContext'
import { TopBar } from './components/TopBar'
import { StartScreen } from './screens/StartScreen'
import { IntroScreen } from './screens/IntroScreen'
import { HubScreen } from './screens/HubScreen'
import { BranchSelectScreen } from './screens/BranchSelectScreen'
import { SituationScreen } from './screens/SituationScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { AssembledScreen } from './screens/AssembledScreen'
import { BeforeAfterScreen } from './screens/BeforeAfterScreen'
import { ResultScreen } from './screens/ResultScreen'

/** 라우터 없이 화면 상태(state machine)로 전환합니다. */
export default function App() {
  const { completeBranch } = useApp()

  const [screen, setScreen] = useState(SCREENS.START)
  const [topicId, setTopicId] = useState(null)
  const [branchId, setBranchId] = useState(null)

  /** 현재 분기 1회 진행분 — 단계, 고른 정답 index, 요소별 "한 번에 맞힘" 여부 */
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState([])
  const [firstTry, setFirstTry] = useState({})

  /** 결과 화면에서 "돌아가기"로 복귀할 화면 */
  const [resultReturn, setResultReturn] = useState(null)

  const topic = topicId ? findTopic(topicId) : null
  const branch = branchId ? findBranch(branchId)?.branch : null

  // 화면이 바뀌면 위에서부터 읽을 수 있게 스크롤을 올린다
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [screen, step])

  useEffect(() => {
    document.title = `${GAME_TITLE} — AI에게 질문하는 법 연습`
  }, [])

  const goHub = useCallback(() => {
    setScreen(SCREENS.HUB)
    setTopicId(null)
    setBranchId(null)
    setStep(0)
    setPicks([])
    setFirstTry({})
  }, [])

  const openResult = useCallback(() => {
    setResultReturn(screen)
    setScreen(SCREENS.RESULT)
  }, [screen])

  const closeResult = useCallback(() => {
    setScreen(
      resultReturn && resultReturn !== SCREENS.RESULT ? resultReturn : SCREENS.HUB,
    )
    setResultReturn(null)
  }, [resultReturn])

  const handleSelectTopic = (nextTopic) => {
    setTopicId(nextTopic.topic)
    setScreen(SCREENS.BRANCH_SELECT)
  }

  const handleSelectBranch = (nextBranch) => {
    setBranchId(nextBranch.branch_id)
    setStep(0)
    setPicks([])
    setFirstTry({})
    setScreen(SCREENS.SITUATION)
  }

  /** 문항 정답 처리 — 4문항을 모두 맞히면 완성된 질문 화면으로 자동 이동 */
  const handleSolved = (choiceIndex, wasFirstTry) => {
    const question = branch.questions[step]
    setPicks((prev) => {
      const next = [...prev]
      next[step] = choiceIndex
      return next
    })
    setFirstTry((prev) => ({ ...prev, [question.element]: wasFirstTry }))

    if (step + 1 < branch.questions.length) {
      setStep(step + 1)
    } else {
      setScreen(SCREENS.ASSEMBLED)
    }
  }

  const handleBranchComplete = () => {
    completeBranch(branchId, firstTry)
    goHub()
  }

  const nav = useMemo(() => {
    const place = topic
      ? `${topic.topic_icon} ${topic.topic_label}${branch ? ` · ${branch.branch_label}` : ''}`
      : ''
    switch (screen) {
      case SCREENS.START:
        return { location: '' }
      case SCREENS.INTRO:
        return {
          location: '둘러보기',
          onBack: () => setScreen(SCREENS.START),
          backLabel: '처음으로',
        }
      case SCREENS.HUB:
        return { location: '상황 고르기' }
      case SCREENS.BRANCH_SELECT:
        return { location: place, onBack: goHub }
      case SCREENS.SITUATION:
        return { location: place, onBack: goHub }
      case SCREENS.QUESTION:
        return {
          location: `${place} · ${step + 1}/${branch?.questions.length ?? 4}`,
          onBack: goHub,
        }
      case SCREENS.ASSEMBLED:
        return { location: `${place} · 완성된 질문`, onBack: goHub }
      case SCREENS.BEFORE_AFTER:
        return { location: `${place} · 답 비교하기`, onBack: goHub }
      case SCREENS.RESULT:
        return {
          location: '지금까지 결과',
          onBack: closeResult,
          backLabel: '돌아가기',
        }
      default:
        return { location: '' }
    }
  }, [screen, topic, branch, step, goHub, closeResult])

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.START:
        return (
          <StartScreen
            onStart={() => setScreen(SCREENS.INTRO)}
            onSkipIntro={() => setScreen(SCREENS.HUB)}
          />
        )
      case SCREENS.INTRO:
        return <IntroScreen onNext={() => setScreen(SCREENS.HUB)} />
      case SCREENS.HUB:
        return <HubScreen onSelectTopic={handleSelectTopic} onOpenResult={openResult} />
      case SCREENS.BRANCH_SELECT:
        if (!topic) return <HubScreen onSelectTopic={handleSelectTopic} onOpenResult={openResult} />
        return (
          <BranchSelectScreen
            topic={topic}
            onSelectBranch={handleSelectBranch}
            onBackToHub={goHub}
          />
        )
      case SCREENS.SITUATION:
        if (!topic || !branch) return null
        return (
          <SituationScreen
            topic={topic}
            branch={branch}
            onStart={() => setScreen(SCREENS.QUESTION)}
            onBack={() => setScreen(SCREENS.BRANCH_SELECT)}
          />
        )
      case SCREENS.QUESTION:
        if (!topic || !branch) return null
        return (
          <QuestionScreen
            key={`${branch.branch_id}-${step}`}
            topic={topic}
            branch={branch}
            stepIndex={step}
            onSolved={handleSolved}
          />
        )
      case SCREENS.ASSEMBLED:
        if (!topic || !branch) return null
        return (
          <AssembledScreen
            topic={topic}
            branch={branch}
            picks={picks}
            onNext={() => setScreen(SCREENS.BEFORE_AFTER)}
          />
        )
      case SCREENS.BEFORE_AFTER:
        if (!topic || !branch) return null
        return (
          <BeforeAfterScreen
            topic={topic}
            branch={branch}
            onComplete={handleBranchComplete}
          />
        )
      case SCREENS.RESULT:
        return <ResultScreen onBackToHub={goHub} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <TopBar
        location={nav.location}
        onBack={nav.onBack}
        backLabel={nav.backLabel}
        onOpenResult={screen === SCREENS.RESULT ? undefined : openResult}
      />
      {renderScreen()}
    </div>
  )
}
