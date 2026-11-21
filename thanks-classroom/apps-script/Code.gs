/**
 * 3D 강의실 롤링페이퍼 · 페이지 + 쪽지 저장소
 *
 * 붙여 넣는 곳: 구글 시트 "○○○ 강사님 쪽지 저장소 (3D 강의실)" → 확장 프로그램 → Apps Script
 *   - Code.gs : 이 파일
 *   - Index   : 파일 옆 + → HTML → 이름 "Index" → 레포의 index.html 내용
 * 배포: 오른쪽 위 "배포" → "새 배포" → 톱니바퀴에서 "웹 앱" →
 *       실행 계정 "나" · 액세스 권한이 있는 사용자 "모든 사용자" → 배포 → 권한 허용 → 웹 앱 URL = 공유 링크
 * 고친 뒤에는 "배포 관리" → 연필 → 버전 "새 버전" → 배포 (링크는 그대로)
 *
 * 잘못 들어간 쪽지는 시트에서 그 줄을 지우면 사이트에서도 사라져요.
 * 공개 사본: 자리표 이름은 가명이에요.
 */
const CONFIG = {
  camp: "AI NATIVE CAMP",
  date: "2026. 11. 04",
  collecting: true, // 쪽지 받기를 끝낼 때 false로 바꾸고 새 버전으로 배포
  honoree: {
    name: "○○○ 강사님", call: "강사님", img: null,
    avatar: { skin: "#F3CBA5", hair: "#2A211F", style: "part", glasses: true, eyes: "happy", mouth: "open", shirt: "#3E4C70", pants: "#2F3340" }
  },
  groupMessage: "3개월 동안 열정적으로 알려 주시고 끝까지 응원해 주셔서 고맙습니다. 강사님 덕분에 우리 모두 한 뼘씩 자랐어요. 어디에 계시든 저희가 응원할게요!",
  // 위 줄이 맨 앞(TV 쪽), 아래 줄이 맨 뒤 · 왼쪽 3칸 / 오른쪽 3칸 (TV를 보고 앉았을 때 기준). "" = 빈자리
  chart: [
    ["", "수강생01", "수강생02", "수강생03", "수강생04", "수강생05"],
    ["", "수강생06", "수강생07", "수강생08", "수강생09", ""],
    ["수강생10", "수강생11", "수강생12", "수강생13", "수강생14", "수강생15"],
    ["수강생16", "수강생17", "수강생18", "수강생19", "수강생20", "수강생21"],
    ["수강생22", "수강생23", "수강생24", "수강생25", "수강생26", ""],
    ["", "", "보조 강사님", "수강생27", "수강생28", ""]
  ],
  // 자리표 칸 색 (b 파랑 · g 초록 · p 보라 · w 회색 · - 빈칸)
  colors: ["-bbgpb", "-ggbb-", "bpbbgb", "ggbggw", "pwgpg-", "--wbb-"],
  staff: ["보조 강사님"],
  // 왼쪽 벽 앞에 서 있는 운영진 (쪽지도 남길 수 있어요)
  operators: ["운영진1", "운영진2", "운영진3"],
  quotes: [],
  releases: [
    { ver: "v0.1", when: "첫 주", text: "개발 환경 세팅" },
    { ver: "v0.9", when: "10/16", text: "실과제 발표" },
    { ver: "v1.0", when: "11/04", text: "마지막 수업" }
  ]
};

const HEADER = ["이름", "한마디", "어록", "캐릭터", "수정키", "저장 시각", "동의"];
const COLS = HEADER.length;

/* ── 페이지 · API 입구 ── */
// 링크로 열면 페이지, ?api=1 이면 자리표 + 쪽지 JSON
function doGet(e) {
  if (e && e.parameter && e.parameter.api) return json_(apiGet());
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("우리 강의실 롤링페이퍼")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover");
}
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "invalid" }); }
  return json_(save_(body));
}
// 페이지 안에서 google.script.run 으로 부르는 함수
function apiGet() { return { ok: true, config: CONFIG, notes: readNotes_() }; }
function apiPost(s) {
  let body;
  try { body = JSON.parse(s); } catch (err) { return { ok: false, error: "invalid" }; }
  return save_(body);
}

/* ── 시트 읽고 쓰기 ── */
function sheet_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(HEADER);
  return sh;
}
function rows_(sh) {
  const last = sh.getLastRow();
  return last >= 2 ? sh.getRange(2, 1, last - 1, COLS).getValues() : [];
}
function readNotes_() {
  return rows_(sheet_())
    .filter(r => r[0])
    .map(r => ({
      name: plain_(r[0]), message: plain_(r[1]), quote: plain_(r[2]),
      avatar: parse_(r[3]), at: r[5] ? new Date(r[5]).getTime() : 0
    }));
}
function save_(body) {
  if (!CONFIG.collecting) return { ok: false, error: "closed" };
  body = body && typeof body === "object" ? body : {};
  const name = String(body.name || "");
  const message = String(body.message || "").trim();
  const key = String(body.key || "");
  if (names_().indexOf(name) < 0 || !message || message.length > 300 || key.length < 16 || key.length > 80 || body.consent !== true) {
    return { ok: false, error: "invalid" };
  }
  const avatar = JSON.stringify(body.avatar && typeof body.avatar === "object" ? body.avatar : {}).slice(0, 600);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const rows = rows_(sh);
    const idx = rows.findIndex(r => plain_(r[0]) === name);
    const h = hash_(key);
    // 같은 이름은 처음 쓴 기기에서만 고칠 수 있어요
    if (idx >= 0 && rows[idx][4] && String(rows[idx][4]) !== h) return { ok: false, error: "taken" };
    const row = [cell_(name, 40), cell_(message, 300), cell_(body.quote, 60), avatar, h, new Date().toISOString(), "Y"];
    if (idx >= 0) sh.getRange(idx + 2, 1, 1, COLS).setValues([row]);
    else sh.appendRow(row);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/* ── 도우미 ── */
function names_() { return CONFIG.chart.flat().filter(Boolean).concat(CONFIG.operators || []); }
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
// = + - @ 로 시작하는 글이 시트 수식으로 바뀌지 않게 막기
function cell_(s, max) {
  s = String(s == null ? "" : s).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function plain_(v) { return String(v == null ? "" : v).replace(/^'/, ""); }
function parse_(s) {
  try { const o = JSON.parse(s); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; }
}
function hash_(s) {
  return "h:" + Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)
    .map(b => ((b + 256) % 256).toString(16).padStart(2, "0")).join("");
}
