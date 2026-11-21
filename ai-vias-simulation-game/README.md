# 우리는 우리가 넣은 대로 된다 (ai-vias-simulation-game)

AI에 민감 정보를 그냥 넣거나 AI 답을 그대로 믿었을 때 생기는 사고를 직접 겪어 보게 하는 게임 기획이에요. 같은 기획서를 두 도구(oh-my-claudecode의 ralplan·ralph, Ouroboros)에 맡겨 만든 구현을 비교해 본 실험 결과도 같이 담았어요. 구현은 시험용이라, 다시 만들 때는 기획(`docs/`)부터 보면 돼요.

| 위치 | 내용 |
|---|---|
| `docs/PRD.md` | 게임 기획서 |
| `docs/overview.md` | 발표용 기획 요약 (30초 · 1분 버전) |
| `omc-ralph/` | oh-my-claudecode로 만든 버전: `index.html`, 계획(`plans/`), `prd.json`, 진행 기록(`progress.txt`), 검증 스크립트(`verify/`) |
| `ouroboros/` | Ouroboros로 만든 버전: `index.html`, 실행 기록(`traces/`) |
| `screenshots/` | 플레이 화면 2장 |

## 실행

설치할 것 없이 각 폴더의 `index.html`을 브라우저로 열면 돼요.

게임 안의 고객 이름·전화번호·주문번호는 지어낸 예시예요.
