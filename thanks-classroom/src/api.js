// 쪽지 저장소 = 구글 Apps Script 웹 앱 (apps-script/Code.gs). 자리표 · 강사님 정보도 여기서 받아요.
// 다른 저장소를 쓰려면 빌드할 때 VITE_API_URL 환경 변수로 바꿔요.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  ""; // 공개 사본: 원래 쪽지 저장소 주소는 뺐어요. VITE_API_URL로 넣어요.

export async function fetchAll() {
  const r = await fetch(API_URL, { cache: "no-store" });
  const j = await r.json();
  if (!j || !j.ok || !j.config) throw new Error("bad response");
  return j;
}

// text/plain으로 보내야 브라우저가 사전 요청(CORS preflight)을 하지 않아요
export async function postNote(body) {
  const r = await fetch(API_URL, { method: "POST", body: JSON.stringify(body) });
  return r.json();
}

// 기기마다 수정키 하나: 같은 이름은 처음 쓴 기기에서만 고칠 수 있어요
const KEY_STORE = "thanks-classroom-key";
const NAME_STORE = "thanks-classroom-name";
let memoryKey = null;

function read(k) {
  try { return localStorage.getItem(k); } catch { return null; }
}
function write(k, v) {
  try { localStorage.setItem(k, v); } catch { /* 저장을 막은 브라우저면 이번 방문 동안만 기억 */ }
}

export function deviceKey() {
  let k = read(KEY_STORE) || memoryKey;
  if (!k) {
    const a = new Uint8Array(18);
    crypto.getRandomValues(a);
    k = Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
    memoryKey = k;
    write(KEY_STORE, k);
  }
  return k;
}
export const getMyName = () => read(NAME_STORE) || "";
export const setMyName = name => write(NAME_STORE, name);
