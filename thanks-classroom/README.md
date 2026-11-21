# 우리 강의실 롤링페이퍼

AI Native 캠프 강의실을 3D로 옮긴 롤링페이퍼예요. 각자 자기 자리를 골라 캐릭터를 꾸미고 김대영 강사님께 한마디를 남겨요.

React + [react-three-fiber](https://github.com/pmndrs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) · Vite

## 실행

```
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ 에 배포용 파일
```

## 구조

| 위치 | 하는 일 |
|---|---|
| `src/App.jsx` | 상태(고른 사람 · 쪽지 쓰기 · 쪽지 목록)와 화면 조립 |
| `src/model.js` | 자리표 → 자리 · 사람, 캐릭터 꾸미기 선택지, 받은 쪽지 합치기 |
| `src/api.js` | 쪽지 저장소(구글 Apps Script) 읽기 · 쓰기, 기기별 수정키 |
| `src/three/` | 3D 장면: `Room` 벽 · 가구, `Desks` 책상 · 모니터(Instances), `Character` · `Head` 사람, `CameraRig` 카메라(CameraControls), `textures.js` TV · 화이트보드 그림 |
| `src/ui/` | 화면 위 패널: 정보 카드 · 말풍선 · 쪽지 모아보기 · 내 쪽지 쓰기, 꽃가루 |
| `apps-script/Code.gs` | 구글 Apps Script. 자리표를 주고, 쪽지를 구글 시트에 저장해요 |

단체 사진(`public/class-photo.jpg`)은 공개 저장소라 빈 액자 그림으로 바꿨어요. 나머지는 원본 그대로예요.

## 저장소 (구글 시트 + Apps Script)

- `src/api.js`의 `API_URL`(또는 빌드할 때 `VITE_API_URL`)이 Apps Script 웹 앱 주소(`…/exec?api=1`)예요.
- 자리표 · 강사님 이름 · 받기 여부(`collecting`)는 `Code.gs`의 `CONFIG`에서 바꾸고, 배포 관리 → 연필 → 새 버전으로 다시 배포해요.
- 쪽지는 시트 한 줄에 한 사람씩 쌓여요. 잘못 들어간 쪽지는 그 줄을 지우면 돼요.
- 같은 이름은 처음 쓴 기기에서만 고칠 수 있어요 (`수정키` 열).

## 배포 (Cloudflare Pages)

```
npx wrangler login
npx wrangler pages project create thanks-classroom --production-branch main
npm run deploy
```

나중에 조직 레포로 옮기면 push할 때마다 자동 배포되게 바꿔요.
