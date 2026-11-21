// Canvas 안에 들어가는 장면 전체
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Room, Lights } from "./Room.jsx";
import { Desks } from "./Desks.jsx";
import { Html } from "@react-three/drei";
import { Character, EMOTES } from "./Character.jsx";
import { EmoteBar } from "../ui/Overlay.jsx";
import { CameraRig } from "./CameraRig.jsx";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// 고른 사람 머리 위에 말풍선(화면 위 DOM)을 붙여 두기. 휴대폰 폭이면 아래 시트로.
function BubbleTracker({ selRef, registry, bubbleRef }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    const el = bubbleRef.current, id = selRef.current;
    if (!el || id === null || id === undefined) return;
    const head = registry.current.get(id);
    if (!head) return;
    if (size.width < 640) { el.classList.add("sheet"); el.classList.remove("below"); return; }
    el.classList.remove("sheet");
    head.getWorldPosition(v);
    v.y += head.userData.tagY || 0.5;
    v.project(camera);
    const sx = (v.x * 0.5 + 0.5) * size.width, sy = (-v.y * 0.5 + 0.5) * size.height;
    const bw = el.offsetWidth, bh = el.offsetHeight;
    const left = clamp(sx - bw / 2, 12, size.width - bw - 12);
    let top = sy - bh - 18, below = false;
    if (top < 12) { top = sy + 46; below = true; }
    top = clamp(top, 12, size.height - bh - 80);
    el.classList.toggle("below", below);
    el.style.left = left + "px";
    el.style.top = top + "px";
    el.style.setProperty("--tail", clamp(sx - left, 22, bw - 22) + "px");
  });
  return null;
}

export function Classroom({
  config, model, merged, avatarFor, sel, hovered, cheer, waveAt, hop, emote,
  quotes, quoteIdx, fontsReady, registry, rigRef, selRef, bubbleRef, onCharClick, onHover, onEmote, onPhoto
}) {
  const register = (id, obj) => { if (obj) registry.current.set(id, obj); else registry.current.delete(id); };
  const h = model.honoree;
  return (
    <>
      <color attach="background" args={["#E6E2D9"]} />
      <fog attach="fog" args={["#E6E2D9", 34, 70]} />
      <Lights />
      <Room config={config} honoree={h} quotes={quotes} quoteIdx={quoteIdx} fontsReady={fontsReady} onPhoto={onPhoto} />
      <Desks seats={model.seats} />
      {merged.people.map((p, i) => (
        <Character
          key={p.name} id={i} avatar={avatarFor(i)} standing={!!p.spot}
          x={p.spot ? p.spot.x : p.seat.x} z={p.spot ? p.spot.z : p.seat.z + 0.6} ry={p.spot ? p.spot.ry : Math.PI}
          tag={cheer ? "감사합니다!" : p.name}
          tagClass={cheer ? "cheer" : p.staff ? "staff" : ""}
          tagColor={`var(--note-${p.note})`} showDot={!cheer && !p.staff}
          showTag={sel !== i} highlight={hovered === i}
          waveAt={waveAt} waveDelay={i * 0.05} hopAt={hop.id === i ? hop.at : -10}
          emote={emote} emoteDelay={0.5 + i * 0.03}
          register={register} onClick={onCharClick} onHover={onHover}
        />
      ))}
      <Character
        key="T" id="T" avatar={h.avatar} standing deco x={h.x} z={h.z} ry={h.ry}
        tag={`★ ${h.name}`} tagClass="teacher" tagColor="#FFFFFF" showDot={false}
        showTag={sel !== "T"} highlight={hovered === "T"}
        waveAt={-10} waveDelay={0} hopAt={hop.id === "T" ? hop.at : -10}
        emote={emote} emoteDelay={0}
        register={register} onClick={onCharClick} onHover={onHover}
      />
      {/* 강사님 머리 위 감정 표현 버튼 */}
      <group position={[h.x, 0, h.z]}>
        <Html position={[0, 3.3, 0]} center zIndexRange={[12, 10]}>
          <EmoteBar emotes={EMOTES} call={h.call} onEmote={onEmote} />
        </Html>
      </group>
      <CameraRig ref={rigRef} />
      <BubbleTracker selRef={selRef} registry={registry} bubbleRef={bubbleRef} />
    </>
  );
}
