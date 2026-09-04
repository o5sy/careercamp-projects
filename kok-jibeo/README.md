# AI 질문 훈련 게임 (작업명: kok-jibeo)

30~60대(핵심 50~60대)를 위한 "AI에게 제대로 질문하는 법" 훈련 웹 게임.
React + Vite + Tailwind CSS, 백엔드 없음, 진행 상태는 `localStorage`에만 저장합니다.

## 실행

```bash
npm install
npm run dev
```

빌드/미리보기: `npm run build` → `npm run preview`

## 게임명 교체

게임명은 미확정 상태이며 `[게임명 TBD]` placeholder를 쓰고 있습니다.
`src/constants.js` 의 **한 줄만** 바꾸면 타이틀 화면 · 상단 바 · 브라우저 탭 제목에 모두 반영됩니다.

```js
export const GAME_TITLE = '[게임명 TBD]'
```

## 파일 구조

```
src/
  constants.js              GAME_TITLE, 4요소(색상·아이콘·설명), 공통 카피, 화면 상태 상수
  data/questions.json       질문데이터_32문항.json 원본 그대로 (수정 금지)
  data/gameData.js          questions.json 로딩 + branch 인덱스, 전체 분기/문항 수 계산
  state/AppContext.jsx      글씨 배율 · 진행 상태(localStorage) 전역 관리
  App.jsx                   화면 상태 머신 (라우터 없음)
  components/
    TopBar.jsx              상단 고정 바 (현재 위치 / 결과 보기 / 글씨 크게)
    ui.jsx                  Screen · Card · 버튼 · 4요소 뱃지 · 진행 상태 뱃지
    icons.jsx               인라인 SVG 아이콘 (중립적 아이콘만)
    AnswerBody.jsx          AI 답변 렌더러 (마크다운 표 파서 + 번호 목록)
    BeforeAfterPanels.jsx   Before/After 2분할 카드
    TopicCard.jsx           허브·결과 공용 소재 카드
    ReviewModal.jsx         분기별 다시보기 모달
  screens/                  시작 → 인트로 → 허브 → 분기 선택 → 상황 카드
                            → 문항 → 완성된 질문 → Before/After → 결과 요약
```

## 소재 추가 방법

`src/data/questions.json` 의 `topics` 배열에 객체를 추가하면 끝입니다.
허브 카드, 분기 선택, 결과 화면의 분모(요소별 N/전체 분기 수)가 모두 데이터 기준으로
자동 계산되므로 소재·분기 개수를 하드코딩한 곳은 없습니다.

한 분기의 필수 필드: `branch_id`, `branch_label`, `situation_card`,
`questions[]`(`element` = 역할/상황/형식/목적 순, 선택지 4개 중 `correct: true` 1개, 선택지마다 `feedback`),
`assembled_question`, `before_after.{before_question, before_answer, after_answer}`.

`after_answer`는 마크다운 표(`| 순서 | ... |`)와 `1) 2) 3)` 번호 목록을 모두 지원합니다.
표는 768px 미만에서 가로 스크롤 없이 세로 카드로 전환됩니다.

## 진행 상태 저장 형식

```jsonc
// localStorage["kok-jibeo.progress.v1"]
{
  "version": 1,
  "branches": {
    "car_accident_my_fault": {
      "completed": true,
      // 결과 화면 4요소 카운트용 — "한 번에 맞혔는지" (재도전 후 정답은 false)
      "firstTry": { "역할": true, "상황": false, "형식": true, "목적": true },
      "completedAt": 1720000000000
    }
  }
}
```

글씨 크게 상태는 `localStorage["kok-jibeo.fontLarge.v1"]`에 따로 저장됩니다.

## 디자인·접근성 규칙 (코드에 반영된 것)

- 컬러는 `src/index.css` 의 `@theme` 한 곳에서 관리. 다크 테마 없음.
- 텍스트로 쓰는 색은 WCAG AA(4.5:1)를 만족하는 진한 변형(`-ink`)을 따로 둠.
  포인트 컬러 `#D97A4D`는 테두리·강조용, 흰 글씨를 올리는 CTA 배경은 `#B85C2E`.
- 오답에 빨간색을 쓰지 않고 앰버(`#E0A94C`) 톤 + 재시도 아이콘 + "다시 한 번 볼까요?" 카피.
- 정답/오답은 색상만으로 구분하지 않고 항상 아이콘 + 텍스트 병기.
- 모든 버튼 최소 높이 56px, 본문 18px 이상, 표 내부 16px 이상.
- "글씨 크게"는 루트 폰트 크기를 128%로 바꿔 rem 기반 UI 전체가 함께 커집니다.
- 애니메이션은 0.3초, `prefers-reduced-motion` 존중.
- 요소 기본 스타일은 반드시 `@layer base` 안에 작성해야 합니다.
  레이어 밖 규칙은 Tailwind 유틸리티(`text-white` 등)를 덮어써 대비 사고가 납니다.
