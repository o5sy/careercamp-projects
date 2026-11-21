// 사람 한 명: 앉은 수강생 또는 서 있는 오늘의 주인공. 누르면 한마디, 머리 위에는 이름표.
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Head } from "./Head.jsx";

const REDUCE = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// 팔 기본 자세 [왼팔, 오른팔]: 앉으면 노트북 위로, 서면 옆으로
const SEATED_REST = [[-0.95, 0, 0.15], [-0.95, 0, -0.15]];
const STANDING_REST = [[0, 0, -0.28], [0, 0, 0.28]];

export const EMOTES = [
  { key: "laugh", label: "웃기", emoji: "😆" },
  { key: "cry", label: "감동해서 울기", emoji: "😭" },
  { key: "heart", label: "하트", emoji: "🥰" },
  { key: "clap", label: "박수", emoji: "👏" }
];
const EMOTE_FACE = {
  laugh: { eyes: "happy", mouth: "open" },
  cry: { eyes: "happy", mouth: "open" },
  heart: { eyes: "happy", mouth: "smile" },
  clap: { eyes: "happy", mouth: "open" }
};
const EMOJI = Object.fromEntries(EMOTES.map(e => [e.key, e.emoji]));

function Mat({ c, ...p }) {
  return <meshStandardMaterial color={c} roughness={0.85} {...p} />;
}

function Mic() {
  const m = useMemo(() => {
    const from = new THREE.Vector3(-0.27, -0.02, 0.06), to = new THREE.Vector3(-0.09, -0.09, 0.27);
    const dir = to.clone().sub(from);
    return {
      mid: from.clone().lerp(to, 0.5), to, len: dir.length(),
      quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    };
  }, []);
  return (
    <>
      <mesh position={m.mid} quaternion={m.quat} scale={[1, m.len, 1]}>
        <cylinderGeometry args={[0.008, 0.008, 1, 6]} />
        <Mat c="#3A3F58" />
      </mesh>
      <mesh position={m.to}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <Mat c="#3A3F58" />
      </mesh>
    </>
  );
}

export function Character({
  id, avatar, standing, x, z, ry,
  tag, tagClass, tagColor, showDot, showTag, highlight,
  waveAt, waveDelay, hopAt, register, onClick, onHover, emote, emoteDelay = 0, deco = false
}) {
  // 감정 표현 중이면 얼굴을 잠깐 바꿔요
  const face = emote ? { ...avatar, ...EMOTE_FACE[emote.key] } : avatar;
  const root = useRef(), body = useRef(), head = useRef(), star = useRef();
  const arms = useRef([]);
  const seed = useMemo(() => Math.random() * 10, []);
  const typing = useRef(Math.random() < 0.5);
  const pos = useMemo(() => [x, 0, z], [x, z]);
  const rot = useMemo(() => [0, ry, 0], [ry]);
  const skin = avatar.skin, shirt = avatar.shirt, pants = avatar.pants || "#4A5064";
  const headY = standing ? 1.42 : 1.24;
  const tagY = standing ? 0.82 : 0.5;
  const rest = standing ? STANDING_REST : SEATED_REST;

  useEffect(() => {
    if (head.current) head.current.userData.tagY = tagY;
    register(id, head.current);
    return () => register(id, null);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    const t = performance.now() / 1000;
    if (!root.current || !body.current || !head.current) return;
    if (!REDUCE) {
      body.current.position.y = (standing ? 0.82 : 0.74) + Math.sin(t * 1.8 + seed) * 0.006;
      head.current.rotation.y = Math.sin(t * 0.45 + seed) * 0.18;
      head.current.rotation.z = Math.sin(t * 0.7 + seed) * 0.04;
    }
    const jk = (t - (waveAt + waveDelay)) / 0.75;
    const hk = (t - hopAt) / 0.45;
    const waving = !standing && jk >= 0 && jk < 3.2 / 0.75;
    let y = 0;
    if (jk >= 0 && jk < 1) y += Math.sin(Math.PI * jk) * 0.32;
    if (hk >= 0 && hk < 1) y += Math.sin(Math.PI * hk) * 0.14;
    // 감정 표현: 강사님이 먼저, 수강생은 조금씩 늦게 따라 해요
    const ek = emote ? t - (emote.at + emoteDelay) : -1;
    const emoting = emote && ek >= 0 && ek < 3.2 && !REDUCE ? emote.key : null;
    if (emoting === "laugh") { y += Math.abs(Math.sin(ek * 10)) * 0.06; head.current.rotation.z = Math.sin(ek * 12) * 0.1; }
    if (emoting === "cry") { head.current.rotation.x = 0.25; head.current.rotation.z = Math.sin(ek * 8) * 0.06; }
    else head.current.rotation.x = 0;
    root.current.position.y = y;
    arms.current.forEach((pv, i) => {
      if (!pv) return;
      const [rx, ry2, rz] = rest[i], s = i ? 1 : -1;
      if (emoting === "clap") pv.rotation.set(standing ? -1.2 : -1.3, 0, -s * (0.55 + Math.sin(ek * 18) * 0.25));
      else if (emoting === "heart") pv.rotation.set(Math.PI - 0.4, 0, -s * 0.5);
      else if (emoting === "cry") pv.rotation.set(-2.2, 0, -s * 0.6);
      else if (waving && !REDUCE) pv.rotation.set(Math.PI - 0.2, 0, s * (0.35 + Math.sin(t * 14 + i) * 0.25));
      else if (!standing && typing.current && !REDUCE) pv.rotation.set(rx + Math.sin(t * 13 + seed + i * 1.7) * 0.06, ry2, rz);
      else if (standing && !REDUCE && i === 0) pv.rotation.set(rx, ry2, rz + Math.sin(t * 2.2) * 0.5 - 0.2);
      else pv.rotation.set(rx, ry2, rz);
    });
    if (Math.floor(t + seed) % 7 === 0) typing.current = Math.sin(seed * 31 + Math.floor(t)) > -0.2;
    if (star.current) {
      star.current.rotation.y = REDUCE ? 0 : t * 1.4;
      star.current.position.y = 2.02 + Math.sin(t * 2) * 0.04;
    }
  });

  const handlers = {
    onClick: e => { e.stopPropagation(); if (e.delta > 6) return; onClick(id); },
    onPointerOver: e => { e.stopPropagation(); onHover(id); },
    onPointerOut: e => { e.stopPropagation(); onHover(null); }
  };

  return (
    <group ref={root} position={pos} rotation={rot} {...handlers}>
      {standing ? (
        <>
          {[-1, 1].map(s => (
            <group key={s}>
              <mesh position={[s * 0.1, 0.24, 0]} castShadow><capsuleGeometry args={[0.085, 0.3, 4, 12]} /><Mat c={pants} /></mesh>
              <mesh position={[s * 0.1, 0.05, 0.06]} scale={[1, 0.6, 1.4]} castShadow><sphereGeometry args={[0.075, 12, 10]} /><Mat c="#F4F4F2" /></mesh>
            </group>
          ))}
          <mesh ref={body} position={[0, 0.82, 0]} castShadow><capsuleGeometry args={[0.22, 0.22, 6, 18]} /><Mat c={shirt} /></mesh>
          {[-1, 1].map((s, i) => (
            <group key={s} ref={el => (arms.current[i] = el)} position={[s * 0.25, 1.02, 0]} rotation={rest[i]}>
              <mesh position={[0, -0.16, 0]} castShadow><capsuleGeometry args={[0.065, 0.2, 4, 10]} /><Mat c={shirt} /></mesh>
              <mesh position={[0, -0.33, 0]} castShadow><sphereGeometry args={[0.065, 12, 10]} /><Mat c={skin} /></mesh>
            </group>
          ))}
          {/* 오늘의 주인공 어깨띠 · 꽃 코사지 */}
          {deco && <>
          <group position={[0, 0.86, 0]} rotation={[0, 0, 0.85]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.5, 1, 1]} castShadow><torusGeometry args={[0.232, 0.036, 8, 40]} /><Mat c="#F0436A" /></mesh>
          </group>
          <group position={[0.11, 1.0, 0.205]}>
            {[0, 1, 2, 3, 4].map(k => {
              const an = (k / 5) * Math.PI * 2;
              return <mesh key={k} position={[Math.cos(an) * 0.035, Math.sin(an) * 0.035, 0]}><sphereGeometry args={[0.03, 10, 8]} /><Mat c="#FF8FA8" /></mesh>;
            })}
            <mesh position={[0, 0, 0.01]}><sphereGeometry args={[0.024, 10, 8]} /><Mat c="#FFD36B" /></mesh>
          </group>
          </>}
          <group ref={head} position={[0, headY, 0.02]} scale={1.04}><Head a={face} tears={emote && emote.key === "cry"}>{deco && <Mic />}</Head></group>
          {deco && (
            <mesh ref={star} position={[0, 2.02, 0]} scale={[1, 1, 0.45]}>
              <octahedronGeometry args={[0.11]} />
              <Mat c="#FFC83D" emissive="#7A5200" roughness={0.35} />
            </mesh>
          )}
        </>
      ) : (
        <>
          {[-1, 1].map(s => (
            <group key={s}>
              <mesh position={[s * 0.095, 0.5, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow><capsuleGeometry args={[0.075, 0.2, 4, 12]} /><Mat c={pants} /></mesh>
              <mesh position={[s * 0.095, 0.29, 0.3]} castShadow><capsuleGeometry args={[0.07, 0.24, 4, 12]} /><Mat c={pants} /></mesh>
              <mesh position={[s * 0.095, 0.06, 0.35]} scale={[1, 0.6, 1.4]} castShadow><sphereGeometry args={[0.075, 12, 10]} /><Mat c="#F4F4F2" /></mesh>
            </group>
          ))}
          <mesh ref={body} position={[0, 0.74, -0.02]} castShadow><capsuleGeometry args={[0.2, 0.16, 6, 18]} /><Mat c={shirt} /></mesh>
          {[-1, 1].map((s, i) => (
            <group key={s} ref={el => (arms.current[i] = el)} position={[s * 0.22, 0.93, 0.02]} rotation={rest[i]}>
              <mesh position={[0, -0.14, 0]} castShadow><capsuleGeometry args={[0.06, 0.16, 4, 10]} /><Mat c={shirt} /></mesh>
              <mesh position={[0, -0.29, 0]} castShadow><sphereGeometry args={[0.065, 12, 10]} /><Mat c={skin} /></mesh>
            </group>
          ))}
          <group ref={head} position={[0, headY, 0.02]}><Head a={face} tears={emote && emote.key === "cry"} /></group>
        </>
      )}

      {emote && (
        <Html position={[0, headY + tagY + 0.4, 0]} center zIndexRange={[9, 0]} style={{ pointerEvents: "none" }}>
          <div key={emote.at} className="emote-pop" style={{ animationDelay: `${emoteDelay}s` }}>{EMOJI[emote.key]}</div>
        </Html>
      )}
      {showTag && (
        <Html position={[0, headY + tagY, 0]} center zIndexRange={[9, 0]} style={{ pointerEvents: "none" }}>
          <div className={`tag ${tagClass}${highlight ? " hover" : ""}`} style={{ "--c": tagColor }}>
            {showDot && <i />}
            <span>{tag}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
