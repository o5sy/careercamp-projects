import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Classroom } from "./three/Classroom.jsx";
import { VIEWS } from "./three/CameraRig.jsx";
import { buildModel, mergeNotes, cleanAvatar, seatLabel, noteVar, HONOREE_SPOT } from "./model.js";
import { fetchAll, postNote, deviceKey, getMyName, setMyName } from "./api.js";
import { burstConfetti } from "./ui/confetti.js";
import { InfoCard, Hint, Toast, ActionBar, Bubble, Drawer, Writer } from "./ui/Overlay.jsx";
import { EMOTES } from "./three/Character.jsx";

const PENDING = "아직 한마디가 도착하지 않았어요. 아래 '내 쪽지 쓰기'로 남길 수 있어요.";
const now = () => performance.now() / 1000;
const ERRORS = {
  taken: "이 이름으로 다른 기기에서 쓴 쪽지가 있어요. 처음 쓴 기기에서 고치거나, 쪽지를 모으는 사람에게 알려 주세요.",
  invalid: "이름 · 한마디 · 동의를 다시 확인해 주세요.",
  closed: "쪽지 받기가 끝났어요."
};

export default function App() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [notes, setNotes] = useState([]);
  const [myName, setMyNameState] = useState(getMyName);
  const [sel, setSel] = useState(null);           // null · 사람 번호 · "T"(강사님)
  const [hovered, setHovered] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [writer, setWriter] = useState(null);     // null이면 닫힘
  const [toast, setToast] = useState("");
  const [waveAt, setWaveAt] = useState(-10);
  const [cheer, setCheer] = useState(false);
  const [hop, setHop] = useState({ id: null, at: -10 });
  const [photoOpen, setPhotoOpen] = useState(false);
  const [emote, setEmote] = useState(null);       // { key, at } 감정 표현 중
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [status, setStatus] = useState("");

  const rigRef = useRef(null), registry = useRef(new Map()), selRef = useRef(null), bubbleRef = useRef(null);
  const confettiRef = useRef(null), downRef = useRef(null), viewIdx = useRef(0), savingRef = useRef(false);
  const toastTimer = useRef(0), cheerTimer = useRef(0), keyRef = useRef(null), emoteTimer = useRef(0);
  selRef.current = sel;

  useEffect(() => {
    fetchAll().then(j => { setConfig(j.config); setNotes(j.notes || []); }).catch(() => setLoadError(true));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  const model = useMemo(() => (config ? buildModel(config) : null), [config]);
  const merged = useMemo(() => (model ? mergeNotes(model, notes, myName) : null), [model, notes, myName]);

  // 20초마다 새 쪽지 확인 (화면을 보고 있을 때만)
  useEffect(() => {
    if (!model) return undefined;
    const t = setInterval(async () => {
      if (document.visibilityState !== "visible" || savingRef.current) return;
      try { const j = await fetchAll(); setNotes(j.notes || []); setStatus(""); }
      catch { setStatus("새 쪽지를 불러오지 못했어요. 잠시 뒤 다시 확인해 주세요."); }
    }, 20000);
    return () => clearInterval(t);
  }, [model]);
  // TV 어록 넘기기 · 처음 열면 다 같이 한 번 손 흔들기
  useEffect(() => { const t = setInterval(() => setQuoteIdx(i => i + 1), 6000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (!model) return undefined;
    const t = setTimeout(() => setWaveAt(now()), 900);
    return () => clearTimeout(t);
  }, [model]);
  useEffect(() => {
    const h = e => keyRef.current && keyRef.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!config || !model || !merged) {
    return <div id="loading">{loadError ? "강의실 정보를 불러오지 못했어요. 잠시 뒤 새로고침해 주세요." : "강의실 불러오는 중…"}</div>;
  }

  const honoree = model.honoree;
  const people = merged.people;
  const students = people.filter(p => !p.staff).length;
  const operatorCount = people.filter(p => p.operator).length;
  const staffNames = people.filter(p => p.staff && !p.operator).map(p => p.name).concat(operatorCount ? [`운영진 ${operatorCount}명`] : []);
  const signText = "커리어 캠프 1기 드림";
  const quotes = (config.quotes || []).concat(merged.quotes);
  const names = people.map(p => p.name).sort((a, b) => a.localeCompare(b, "ko"));

  const say = text => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };
  const infoFor = id => {
    if (id === "T") return { x: HONOREE_SPOT.x, y: 1.42, z: HONOREE_SPOT.z, ry: HONOREE_SPOT.ry, isT: true };
    const p = people[id];
    if (p.spot) return { x: p.spot.x, y: 1.42, z: p.spot.z, ry: p.spot.ry, isT: false };
    return { x: p.seat.x, y: 1.24, z: p.seat.z + 0.58, ry: Math.PI, isT: false };
  };

  function select(id) {
    setWriter(null);
    setDrawerOpen(false);
    setSel(id);
    setHop({ id, at: now() });
    rigRef.current?.focus(infoFor(id), "bubble");
    if (id === "T") burstConfetti(confettiRef.current);
  }
  function step(d) {
    if (typeof sel !== "number") return;
    const n = people.length;
    select((sel + d + n) % n);
  }

  // ── 내 쪽지 쓰기
  function previewFor(w, name) {
    const idx = model.nameToIdx.get(name);
    if (idx === undefined) return { ...w, name: "", idx: null, avatar: null, warn: "" };
    const p = people[idx];
    const mine = merged.myNote && merged.myNote.name === name;
    rigRef.current?.focus(infoFor(idx), "writer");
    return {
      ...w, name, idx, error: "",
      avatar: cleanAvatar(mine ? merged.myNote.avatar : p.avatar, p.baseAvatar),
      warn: p.message && name !== myName ? "이 이름으로 이미 쪽지가 있어요. 내가 다른 기기에서 썼다면 그 기기에서 고쳐 주세요." : ""
    };
  }
  function openWriter() {
    setSel(null);
    setDrawerOpen(false);
    const mine = merged.myNote;
    const base = { name: "", idx: null, avatar: null, message: mine ? mine.message : "", quote: mine ? mine.quote : "", consent: !!mine, error: "", warn: "", saving: false };
    setWriter(previewFor(base, mine ? mine.name : ""));
  }
  async function submit() {
    const w = writer;
    if (!w || w.saving) return;
    const message = w.message.trim().slice(0, 300), quote = w.quote.trim().slice(0, 60);
    if (w.idx === null) return setWriter({ ...w, error: "내 이름을 골라 주세요." });
    if (!message) return setWriter({ ...w, error: `${honoree.name}께 한마디를 써 주세요.` });
    if (!w.consent) return setWriter({ ...w, error: "동의에 체크해 주세요." });
    setWriter({ ...w, saving: true, error: "" });
    savingRef.current = true;
    try {
      const j = await postNote({ key: deviceKey(), name: w.name, message, quote, avatar: w.avatar, consent: true });
      if (!j || !j.ok) throw Object.assign(new Error("save failed"), { code: j && j.error });
      setMyName(w.name);
      setMyNameState(w.name);
      setNotes(ns => [...ns.filter(n => n.name !== w.name), { name: w.name, message, quote, avatar: w.avatar, at: Date.now() }]);
      say("저장했어요. 다른 사람 화면에는 20초 안에 떠요.");
      select(w.idx);
      fetchAll().then(r => setNotes(r.notes || [])).catch(() => {});
    } catch (e) {
      setWriter(cur => cur && { ...cur, saving: false, error: ERRORS[e.code] || "저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요." });
    } finally {
      savingRef.current = false;
    }
  }

  function onCharClick(id) {
    if (writer) {
      if (typeof id === "number" && config.collecting && !writer.saving) setWriter(previewFor(writer, people[id].name));
      return;
    }
    select(id);
  }
  function onHover(id) {
    setHovered(id);
    document.body.style.cursor = id === null ? "" : "pointer";
  }
  function wave() {
    setWaveAt(now());
    setCheer(true);
    clearTimeout(cheerTimer.current);
    cheerTimer.current = setTimeout(() => setCheer(false), 3200);
    say("다 같이 “감사합니다!”");
  }
  function doEmote(key) {
    const e = EMOTES.find(x => x.key === key);
    setSel(null);
    setWriter(null);
    setEmote({ key, at: now() });
    clearTimeout(emoteTimer.current);
    emoteTimer.current = setTimeout(() => setEmote(null), 5200);
    rigRef.current?.overview(); // 전체를 보면서 강사님 얼굴이 보이게
    say(`${honoree.call}이 ${e.emoji} 하니까 다 같이 따라 해요`);
  }
  function nextView() {
    setSel(null);
    setWriter(null);
    viewIdx.current = (viewIdx.current + 1) % VIEWS.length;
    rigRef.current?.view(viewIdx.current);
    say(VIEWS[viewIdx.current].name);
  }
  const closeAll = () => { setSel(null); setDrawerOpen(false); setWriter(null); setPhotoOpen(false); };
  keyRef.current = e => {
    if (e.key === "Escape") return closeAll();
    if (e.target && e.target.closest && e.target.closest("input, textarea, select")) return;
    if (typeof sel === "number" && !drawerOpen) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
  };

  const avatarFor = i => (writer && writer.idx === i && writer.avatar ? writer.avatar : people[i].avatar);

  let bubble = null;
  if (sel === "T") {
    bubble = { isT: true, name: `오늘의 주인공, ${honoree.name}`, seat: "맨 앞 · 강사님 자리", message: config.groupMessage, sign: signText, note: "var(--note-1)" };
  } else if (typeof sel === "number") {
    const p = people[sel];
    bubble = { isT: false, name: p.name, seat: seatLabel(p.seat), message: p.message || PENDING, pending: !p.message, count: `${sel + 1} / ${people.length}`, note: noteVar(p, sel) };
  }

  return (
    <>
      <div id="app" onPointerDown={e => { downRef.current = { x: e.clientX, y: e.clientY }; }}>
        <Canvas
          shadows="soft" flat dpr={[1, 2]}
          camera={{ fov: 40, near: 0.1, far: 200, position: [2.5, 8.6, 15.5] }}
          onPointerMissed={e => {
            const d = downRef.current;
            if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
            if (!writer) setSel(null);
          }}
        >
          <Classroom
            config={config} model={model} merged={merged} avatarFor={avatarFor}
            sel={sel} hovered={hovered} cheer={cheer} waveAt={waveAt} hop={hop} emote={emote}
            quotes={quotes} quoteIdx={quoteIdx} fontsReady={fontsReady}
            registry={registry} rigRef={rigRef} selRef={selRef} bubbleRef={bubbleRef}
            onCharClick={onCharClick} onHover={onHover} onEmote={doEmote}
            onPhoto={() => { setSel(null); setPhotoOpen(true); }}
          />
        </Canvas>
      </div>

      <InfoCard config={config} honoree={honoree} students={students} staffNames={staffNames} arrived={merged.arrived} total={students} />
      <Hint />
      <Toast text={toast} />
      <ActionBar
        collecting={config.collecting} call={honoree.call}
        onWrite={openWriter} onTeacher={() => select("T")} onWave={wave}
        onNotes={() => { setSel(null); setWriter(null); setDrawerOpen(o => !o); }} onView={nextView}
      />
      <Bubble ref={bubbleRef} data={bubble} onClose={() => setSel(null)} onPrev={() => step(-1)} onNext={() => step(1)} />
      <Drawer open={drawerOpen} people={people} arrived={merged.arrived} total={students} status={status} onClose={() => setDrawerOpen(false)} onGo={i => select(i)} />
      <Writer
        open={!!writer} w={writer} names={names} honoree={honoree} collecting={config.collecting}
        onClose={() => setWriter(null)}
        onName={name => setWriter(previewFor(writer, name))}
        onAvatar={patch => writer && writer.idx !== null && setWriter({ ...writer, avatar: cleanAvatar({ ...writer.avatar, ...patch }, people[writer.idx].baseAvatar) })}
        onField={patch => setWriter({ ...writer, ...patch })}
        onSubmit={submit}
      />
      {photoOpen && (
        <div id="lightbox" role="dialog" aria-label="단체 사진 크게 보기" onClick={() => setPhotoOpen(false)}>
          <img src="/class-photo.jpg" alt="커리어 캠프 1기 단체 사진" />
          <button type="button" className="d-x" aria-label="사진 닫기">×</button>
        </div>
      )}
      <canvas id="confetti" ref={confettiRef} aria-hidden="true" />
    </>
  );
}
