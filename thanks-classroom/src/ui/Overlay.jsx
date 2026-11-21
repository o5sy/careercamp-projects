// 3D 화면 위에 뜨는 패널들: 정보 카드 · 진행도 · 행동 버튼 · 말풍선 · 쪽지 모아보기 · 내 쪽지 쓰기
import { forwardRef } from "react";
import { seatLabel, noteVar, STYLES, EYES, MOUTHS, ACCS, HAIRS, SKINS, SHIRTS } from "../model.js";

export function InfoCard({ config, honoree, students, staffNames, arrived, total }) {
  const staff = staffNames.length ? " · " + staffNames.join(" · ") : "";
  return (
    <section className="hud card" id="info" aria-label="강의실 정보">
      <p className="eyebrow">{config.camp} · {config.date}</p>
      <h1>우리 강의실 <span>마지막 수업 날</span></h1>
      <p className="live"><i />{`수강생 ${students}명${staff} · ${honoree.name}이 함께 있어요`}</p>
      <p className="sub">강의실 자리 배치를 그대로 옮겨 왔어요. 사람을 누르면 그 사람의 한마디가 떠요.</p>
      {config.collecting && (
        <p className="proto"><b>쪽지 모으는 중</b>{` · ${arrived} / ${total}장 도착 · 아래 '내 쪽지 쓰기'로 남겨 주세요`}</p>
      )}
    </section>
  );
}

export function ProgressCard() {
  return (
    <section className="hud card" id="progress" aria-label="캠프 진행도">
      <div className="pg-top"><b>100</b><span>%</span><em>캠프 진행도</em></div>
      <div className="bar"><i /></div>
      <ol className="steps"><li>첫 주</li><li>실과제 발표</li><li className="now">마지막 수업</li></ol>
    </section>
  );
}

export function Hint() {
  return <p className="hud" id="hint">드래그로 둘러보기 · 휠로 확대/축소<br />사람을 누르면 한마디가 떠요</p>;
}

export function Toast({ text }) {
  return <div className="hud card" id="toast" hidden={!text}>{text}</div>;
}

export function EmoteBar({ emotes, call, onEmote }) {
  return (
    <section className="card emotes" aria-label={`${call} 감정 표현`}>
      <span>{call} 감정 표현</span>
      <div>
        {emotes.map(e => (
          <button key={e.key} type="button" onClick={() => onEmote(e.key)} aria-label={e.label} title={e.label}>{e.emoji}</button>
        ))}
      </div>
    </section>
  );
}

export function ActionBar({ collecting, call, onWrite, onTeacher, onWave, onNotes, onView }) {
  return (
    <nav className="hud card" id="actions" aria-label="행동">
      {collecting && <button type="button" className="primary" onClick={onWrite}>내 쪽지 쓰기</button>}
      <button type="button" className={collecting ? "" : "primary"} onClick={onTeacher}>{call}께 가기</button>
      <button type="button" onClick={onWave}>다 같이 인사</button>
      <button type="button" onClick={onNotes}>쪽지 모아보기</button>
      <button type="button" onClick={onView}>시점 바꾸기</button>
    </nav>
  );
}

export const Bubble = forwardRef(function Bubble({ data, onClose, onPrev, onNext }, ref) {
  return (
    <div id="bubble" ref={ref} role="dialog" aria-labelledby="b-name" hidden={!data} style={data ? { "--note": data.note } : undefined}>
      {data && (
        <>
          <div className="b-head"><span className="b-name" id="b-name">{data.name}</span><span className="b-seat">{data.seat}</span></div>
          <button type="button" className="b-x" onClick={onClose} aria-label="말풍선 닫기">×</button>
          <div className="b-body"><p id="b-msg" className={data.pending ? "pending" : ""}>{data.message}</p></div>
          {data.sign && <p id="b-sign">{data.sign}</p>}
          {!data.isT && (
            <div className="b-nav">
              <button type="button" onClick={onPrev}>← 이전</button>
              <span id="b-count">{data.count}</span>
              <button type="button" onClick={onNext}>다음 →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export function Drawer({ open, people, arrived, total, status, onClose, onGo }) {
  return (
    <aside id="drawer" className={open ? "open" : ""} aria-labelledby="d-title" aria-hidden={!open}>
      <div className="d-head">
        <div><h2 id="d-title">쪽지 모아보기</h2><p>수강생 {arrived} / {total}장 도착</p></div>
        <button type="button" className="d-x" onClick={onClose} aria-label="쪽지 모아보기 닫기">×</button>
      </div>
      <div className="d-list">
        {status && <p className="d-status">{status}</p>}
        {people.map((p, i) => (
          <article key={p.name} className={"d-note" + (p.message ? "" : " pending")} style={{ "--note": noteVar(p, i) }}>
            <h3>
              {p.name}
              {p.mine && <span className="mine">내 쪽지</span>}
              <small>{seatLabel(p.seat)}</small>
            </h3>
            <p>{p.message || "한마디 기다리는 중"}</p>
            <div className="d-row"><button type="button" onClick={() => onGo(i)}>자리 보기</button></div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function Chips({ name, items, value, onChange, swatch }) {
  return (
    <div className="chips">
      {items.map(([v, label]) => (
        <label key={v || "none"} className={"chip" + (swatch ? " sw" : "")} title={swatch ? label : undefined}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} aria-label={swatch ? label : undefined} />
          <span style={swatch ? { background: v } : undefined}>{swatch ? "" : label}</span>
        </label>
      ))}
    </div>
  );
}

const palette = (list, word) => list.map((c, i) => [c, `${word} ${i + 1}`]);

export function Writer({ open, w, names, honoree, collecting, onClose, onName, onAvatar, onField, onSubmit }) {
  const av = (w && w.avatar) || {};
  const set = k => v => onAvatar({ [k]: v });
  return (
    <aside id="writer" className={open ? "open" : ""} aria-labelledby="w-title" aria-hidden={!open}>
      <div className="d-head">
        <div><h2 id="w-title">내 쪽지 쓰기</h2><p>{honoree.name}께는 비밀이에요</p></div>
        <button type="button" className="d-x" onClick={onClose} aria-label="내 쪽지 쓰기 닫기">×</button>
      </div>
      <form className="w-body" noValidate onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        {!collecting && <p className="w-note">쪽지 받기가 끝났어요. 고마워요!</p>}
        <fieldset className="w-fields" disabled={!collecting || (w && w.saving)}>
          <label className="w-field" htmlFor="w-name"><span>내 이름</span>
            <select id="w-name" value={(w && w.name) || ""} onChange={e => onName(e.target.value)}>
              <option value="">자리표에서 내 이름을 골라 주세요</option>
              {names.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          {w && w.warn && <p className="w-note warn">{w.warn}</p>}
          <div className="w-field"><span>머리 모양</span><Chips name="style" items={STYLES} value={av.style} onChange={set("style")} /></div>
          <div className="w-field"><span>머리색</span><Chips name="hair" items={palette(HAIRS, "머리색")} value={av.hair} onChange={set("hair")} swatch /></div>
          <div className="w-field"><span>피부</span><Chips name="skin" items={palette(SKINS, "피부색")} value={av.skin} onChange={set("skin")} swatch /></div>
          <div className="w-field"><span>옷 색</span><Chips name="shirt" items={palette(SHIRTS, "옷 색")} value={av.shirt} onChange={set("shirt")} swatch /></div>
          <div className="w-field"><span>눈</span><Chips name="eyes" items={EYES} value={av.eyes} onChange={set("eyes")} /></div>
          <div className="w-field"><span>입</span><Chips name="mouth" items={MOUTHS} value={av.mouth} onChange={set("mouth")} /></div>
          <div className="w-field"><span>소품</span><Chips name="acc" items={ACCS} value={av.acc} onChange={set("acc")} /></div>
          <label className="w-check" htmlFor="w-glasses">
            <input type="checkbox" id="w-glasses" checked={!!av.glasses} onChange={e => onAvatar({ glasses: e.target.checked })} /> 안경 써요
          </label>
          <label className="w-field" htmlFor="w-msg"><span>{honoree.name}께 한마디</span>
            <textarea id="w-msg" rows={5} maxLength={300} placeholder="2~4문장이면 충분해요"
              value={(w && w.message) || ""} onChange={e => onField({ message: e.target.value })} />
            <small className="w-count">{((w && w.message) || "").length} / 300</small>
          </label>
          <label className="w-field" htmlFor="w-quote"><span>기억에 남는 강사님 말 <em>선택</em></span>
            <input id="w-quote" maxLength={60} placeholder="강의실 TV에 어록으로 나와요"
              value={(w && w.quote) || ""} onChange={e => onField({ quote: e.target.value })} />
          </label>
          <label className="w-check" htmlFor="w-ok">
            <input type="checkbox" id="w-ok" checked={!!(w && w.consent)} onChange={e => onField({ consent: e.target.checked })} />
            <span>이름 · 캐릭터 · 한마디가 {honoree.name}께 드릴 이 페이지에 실리고, 나중에 링크로 공유하는 웹사이트로 옮겨지는 데 동의해요</span>
          </label>
          {w && w.error && <p className="w-err" role="alert">{w.error}</p>}
          <button type="submit" className="w-save">{w && w.saving ? "저장하는 중…" : "저장하기"}</button>
          <p className="w-foot">이 기기에서 쓴 쪽지는 이 기기에서 다시 저장하면 고쳐져요. 강의실에서 자리를 눌러도 이름이 골라져요.</p>
        </fieldset>
      </form>
    </aside>
  );
}
