// 자리표(config) + 받은 쪽지(notes) → 화면에 그릴 자리 · 사람 정보

export const STYLES = [["short", "짧은 머리"], ["part", "가르마"], ["buzz", "아주 짧게"], ["curly", "곱슬"], ["bob", "단발"], ["long", "긴 머리"], ["bun", "올림머리"]];
export const EYES = [["open", "동그란 눈"], ["happy", "웃는 눈"], ["wink", "윙크"]];
export const MOUTHS = [["smile", "미소"], ["open", "활짝"], ["cat", "고양이 입"]];
export const ACCS = [["", "없음"], ["headphones", "헤드폰"], ["beanie", "비니"], ["sprout", "새싹"], ["star", "별 핀"], ["bow", "리본"]];
export const HAIRS = ["#1F1A1A", "#2A211F", "#3B2A22", "#4A3428", "#5A3D2E", "#8A6A4A"];
export const SKINS = ["#FFE0C7", "#F6D0B1", "#F3CBA5", "#EDBB94", "#D9A47C"];
export const SHIRTS = ["#7FAEE0", "#A8D5A0", "#C3B4E6", "#D8D8D4", "#FFB547", "#FF8FA8", "#8FD3E8", "#3E4C70", "#2B2B33", "#F4F4F2"];
export const AV_KEYS = ["style", "hair", "skin", "shirt", "eyes", "mouth", "acc"];

// 자리표 칸 색 → 옷 색 · 쪽지 색
const COLOR = {
  b: { shirt: "#7FAEE0", note: 4 },
  g: { shirt: "#A8D5A0", note: 3 },
  p: { shirt: "#C3B4E6", note: 5 },
  w: { shirt: "#D8D8D4", note: 1 }
};

// 강의실 크기: 가로 x -10(왼쪽 벽) ~ 10(창가), 세로 z -8(앞 TV) ~ 8(뒤 벽), 높이 3.4
export const ROOM = { RW: 10, RD: 8, RH: 3.4 };
export const HONOREE_SPOT = { x: 5.3, z: -5.6, ry: -0.5 };

const keysOf = list => list.map(x => x[0]);

function hashName(s) {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// 쪽지를 쓰기 전 임시 모양: 이름마다 다르게
function autoAvatar(name, color) {
  const h = hashName(name), pick = (arr, k) => arr[(h >>> k) % arr.length];
  return {
    skin: pick(["#FFE0C7", "#F6D0B1", "#F3CBA5", "#EDBB94"], 0),
    hair: pick(["#2A211F", "#3B2A22", "#1F1A1A", "#4A3428", "#5A3D2E"], 3),
    style: pick(["short", "part", "buzz", "curly", "bob", "long", "bun", "short", "part"], 6),
    glasses: (h >>> 10) % 10 < 3,
    eyes: pick(["open", "open", "happy", "wink"], 13),
    mouth: pick(["smile", "smile", "open", "cat"], 16),
    acc: pick(["", "", "", "", "", "headphones", "sprout", "star"], 19),
    shirt: color ? color.shirt : "#9FB7D9"
  };
}

// 받은 값은 정해진 선택지 안에서만 쓰기
export function cleanAvatar(av, base) {
  av = av && typeof av === "object" ? av : {};
  const of = (v, list, d) => (list.includes(v) ? v : d);
  return {
    style: of(av.style, keysOf(STYLES), base.style),
    hair: of(av.hair, HAIRS, base.hair),
    skin: of(av.skin, SKINS, base.skin),
    shirt: of(av.shirt, SHIRTS, base.shirt),
    eyes: of(av.eyes, keysOf(EYES), base.eyes),
    mouth: of(av.mouth, keysOf(MOUTHS), base.mouth),
    acc: of(av.acc, keysOf(ACCS), base.acc || ""),
    glasses: typeof av.glasses === "boolean" ? av.glasses : !!base.glasses
  };
}

export function buildModel(config) {
  const seats = [], people = [];
  config.chart.forEach((line, pr) => line.forEach((name, pc) => {
    // 위 줄이 맨 앞, 왼쪽 3칸 / 오른쪽 3칸 (TV를 보고 앉았을 때 기준)
    const seat = {
      row: pr + 1, col: pc + 1,
      x: pc < 3 ? -4.2 + pc * 1.2 : 1.8 + (pc - 3) * 1.2,
      z: -3.6 + pr * 1.8,
      filled: !!name
    };
    seats.push(seat);
    if (!name) return;
    const color = COLOR[(config.colors[pr] || "")[pc]];
    const auto = autoAvatar(name, color);
    people.push({
      name, seat,
      staff: (config.staff || []).includes(name),
      note: color ? color.note : 2,
      baseAvatar: cleanAvatar(auto, auto)
    });
  }));
  // 운영진: 왼쪽 벽 앞에 서서 수강생 쪽(창가 방향)을 봐요
  const operators = config.operators || ["운영진1", "운영진2", "운영진3"];
  operators.forEach((name, i) => {
    const auto = autoAvatar(name, { shirt: "#3E4C70" });
    people.push({
      name, seat: null, spot: { x: -8.7, z: -2.8 + i * 1.25, ry: Math.PI / 2 },
      staff: true, operator: true, note: 1, baseAvatar: cleanAvatar(auto, auto)
    });
  });
  return {
    seats, people,
    honoree: { ...config.honoree, ...HONOREE_SPOT },
    nameToIdx: new Map(people.map((p, i) => [p.name, i]))
  };
}

export function mergeNotes(model, notes, myName) {
  const byName = new Map();
  (notes || []).forEach(n => {
    if (!n || !model.nameToIdx.has(n.name)) return;
    const prev = byName.get(n.name);
    if (!prev || (+n.at || 0) >= (+prev.at || 0)) byName.set(n.name, n);
  });
  const people = model.people.map(p => {
    const n = byName.get(p.name);
    return {
      ...p,
      message: n ? String(n.message || "").slice(0, 300) : "",
      quote: n ? String(n.quote || "").slice(0, 60) : "",
      avatar: n ? cleanAvatar(n.avatar, p.baseAvatar) : p.baseAvatar,
      mine: !!(n && myName && p.name === myName)
    };
  });
  return {
    people,
    myNote: (myName && byName.get(myName)) || null,
    // 도착 개수는 수강생만 세요 (강사님 · 운영진 쪽지는 보이지만 개수에는 안 들어가요)
    arrived: people.filter(p => !p.staff && p.message).length,
    quotes: people.map(p => p.quote).filter(Boolean)
  };
}

export const seatLabel = s => (s ? `앞에서 ${s.row}번째 줄 · 왼쪽에서 ${s.col}번째` : "운영진 · 왼쪽 벽");
export const noteVar = (p, i) => `var(--note-${p.note || (i % 5) + 1})`;
