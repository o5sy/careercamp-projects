// 강의실 껍데기: 바닥 · 벽 4개 · 천장 · 가구. 카메라가 벽 바깥에 있으면 그 벽은 숨겨서 안이 보이게.
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ROOM } from "../model.js";

// TV 왼쪽 벽 단체 사진 액자 (누르면 크게 보기)
function PhotoFrame({ onOpen }) {
  const tex = useTexture("/class-photo.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  const w = 2.3, h = w * 1125 / 2000;
  return (
    <group position={[-4.1, 1.85, -RD + 0.03]}
      onClick={e => { e.stopPropagation(); if (e.delta <= 6) onOpen(); }}
      onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}>
      <Box args={[w + 0.16, h + 0.16, 0.05]} position={[0, 0, 0]} color="#C49A63" roughness={0.6} />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
}
import { useCanvasTexture, drawTV, drawBoard, drawGarland, drawWifi, makeCarpet } from "./textures.js";

const { RW, RD, RH } = ROOM;
const CONCRETE = "#D9D7D1", WHITE = "#F2F2EF", WOOD = "#B8864A";

export function Box({ args, position, rotation, color, basic, shadow = true, roughness = 0.85, metalness = 0, transparent, opacity }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow && !basic} receiveShadow>
      <boxGeometry args={args} />
      {basic
        ? <meshBasicMaterial color={color} />
        : <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} transparent={transparent} opacity={opacity} />}
    </mesh>
  );
}

function Picture({ args, position, rotation, map, color = "#FFFFFF", transparent }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args} />
      <meshBasicMaterial map={map || null} color={color} transparent={transparent} />
    </mesh>
  );
}

export function Room({ config, honoree, quotes, quoteIdx, fontsReady, onPhoto }) {
  const front = useRef(), back = useRef(), left = useRef(), right = useRef(), ceiling = useRef();
  const tv = useCanvasTexture(1024, 576, (ctx, w, h) => drawTV(ctx, w, h, { quotes, idx: quoteIdx, honoree, camp: config.camp, date: config.date }),
    [quotes.join("\n"), quoteIdx, honoree.name, fontsReady]);
  const board = useCanvasTexture(1400, 640, (ctx, w, h) => drawBoard(ctx, w, h, config.releases || []), [fontsReady]);
  const garland = useCanvasTexture(2048, 300, (ctx, w, h) => drawGarland(ctx, w, h, honoree.call), [honoree.call, fontsReady]);
  const wifi = useCanvasTexture(320, 220, drawWifi, [fontsReady]);
  const carpet = useMemo(makeCarpet, []);

  useFrame(({ camera }) => {
    const p = camera.position;
    if (front.current) front.current.visible = p.z > -RD;
    if (back.current) back.current.visible = p.z < RD;
    if (left.current) left.current.visible = p.x > -RW;
    if (right.current) right.current.visible = p.x < RW;
    if (ceiling.current) ceiling.current.visible = p.y < RH + 0.8;
  });

  return (
    <>
      {/* 바닥(디오라마 받침) · 윗면만 카펫 */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[RW * 2 + 0.4, 0.3, RD * 2 + 0.4]} />
        {[0, 1, 2, 3, 4, 5].map(i => i === 2
          ? <meshStandardMaterial key={i} attach={`material-${i}`} map={carpet} roughness={1} />
          : <meshStandardMaterial key={i} attach={`material-${i}`} color="#CBC6BC" roughness={0.85} />)}
      </mesh>

      {/* 앞 벽: TV · 가랜드 · 커튼 · 와이파이 종이 */}
      <group ref={front}>
        <Box args={[RW * 2 + 0.28, RH, 0.14]} position={[0, RH / 2, -RD - 0.07]} color={CONCRETE} shadow={false} />
        <Box args={[3.1, 1.78, 0.08]} position={[0, 1.78, -RD + 0.04]} color="#1C1D21" roughness={0.4} />
        <Picture args={[2.96, 1.66]} position={[0, 1.78, -RD + 0.085]} map={tv} />
        <Picture args={[6.4, 0.94]} position={[0, 3.0, -RD + 0.03]} map={garland} transparent />
        {Array.from({ length: 14 }, (_, i) => (
          <Box key={i} args={[0.32, 2.9, 0.07]} position={[3.9 + i * 0.32, 1.5, -RD + 0.1 + (i % 2) * 0.06]} color={i % 2 ? "#A3A6AA" : "#979A9F"} />
        ))}
        <Picture args={[0.32, 0.22]} position={[-6.6, 1.55, -RD + 0.01]} map={wifi} />
        <PhotoFrame onOpen={onPhoto} />
      </group>

      {/* 왼쪽 벽: 나무 칸막이 · 유리문 · 비상구 표시 */}
      <group ref={left}>
        <Box args={[0.14, RH, RD * 2 + 0.28]} position={[-RW - 0.07, RH / 2, 0]} color={CONCRETE} shadow={false} />
        <Box args={[0.1, 3.2, 3.4]} position={[-RW + 0.06, 1.6, 1.6]} color={WOOD} />
        <Box args={[0.04, 2.25, 1.7]} position={[-RW + 0.03, 1.12, 5.2]} color="#BFE0EE" roughness={0.1} transparent opacity={0.45} />
        {[-0.86, 0.86].map(dz => <Box key={dz} args={[0.06, 2.3, 0.06]} position={[-RW + 0.03, 1.12, 5.2 + dz]} color="#8A8D91" />)}
        <Box args={[0.04, 0.2, 0.52]} position={[-RW + 0.03, 2.62, 5.2]} color="#22A35A" basic />
      </group>

      {/* 오른쪽 벽: 창문 · 강사님 자리 옆 화이트보드 */}
      <group ref={right}>
        <Box args={[0.14, RH, RD * 2 + 0.28]} position={[RW + 0.07, RH / 2, 0]} color={CONCRETE} shadow={false} />
        {[-0.6, 2.9, 6.3].map(z => (
          <group key={z}>
            <Picture args={[3.0, 1.35]} position={[RW - 0.005, 2.05, z]} rotation={[0, -Math.PI / 2, 0]} color="#EEF7FF" />
            {[0.7, -0.7].map(dy => <Box key={dy} args={[0.06, 0.07, 3.08]} position={[RW - 0.03, 2.05 + dy, z]} color={WHITE} />)}
            {[-1.52, 0, 1.52].map(dz => <Box key={dz} args={[0.06, 1.42, 0.06]} position={[RW - 0.03, 2.05, z + dz]} color={WHITE} />)}
          </group>
        ))}
        <Box args={[0.05, 1.25, 2.7]} position={[RW - 0.03, 1.6, -5.4]} color={WHITE} />
        <Picture args={[2.6, 1.19]} position={[RW - 0.06, 1.6, -5.4]} rotation={[0, -Math.PI / 2, 0]} map={board} />
        <Box args={[0.12, 0.03, 2.7]} position={[RW - 0.08, 0.97, -5.4]} color="#C9CBCD" />
        {["#2257C7", "#D6334F", "#26292E"].map((c, i) => (
          <mesh key={c} position={[RW - 0.1, 1.0, -6.1 + i * 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.13, 8]} />
            <meshStandardMaterial color={c} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* 뒤 벽: 노란 벽 · 회색 패널 · 나무 문 · 열린 문 · 나무 판 */}
      <group ref={back}>
        <Box args={[RW * 2 + 0.28, RH, 0.14]} position={[0, RH / 2, RD + 0.07]} color="#EEE3BC" shadow={false} />
        <Box args={[RW * 2 + 0.28, 1.0, 0.05]} position={[0, 0.5, RD - 0.02]} color="#BFC6CB" shadow={false} />
        <Box args={[1.05, 2.15, 0.07]} position={[2.6, 1.075, RD - 0.05]} color={WOOD} />
        <mesh position={[2.22, 1.0, RD - 0.1]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshStandardMaterial color="#C9C9C9" metalness={0.6} roughness={0.3} />
        </mesh>
        <Picture args={[1.0, 2.1]} position={[5.6, 1.05, RD - 0.06]} rotation={[0, Math.PI, 0]} color="#F4EBCD" />
        {[-0.56, 0.56].map(dx => <Box key={dx} args={[0.1, 2.2, 0.1]} position={[5.6 + dx, 1.1, RD - 0.06]} color={WOOD} />)}
        <Box args={[1.22, 0.1, 0.1]} position={[5.6, 2.2, RD - 0.06]} color={WOOD} />
        <Box args={[2.3, 3.1, 0.08]} position={[8.4, 1.55, RD - 0.06]} color={WOOD} />
      </group>

      {/* 천장: 노출 배관 · 긴 LED 조명 · 냉난방기 (위에서 내려다볼 땐 숨김) */}
      <group ref={ceiling}>
        {[-9.3, 9.3].map(x => (
          <mesh key={x} position={[x, RH - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, RD * 2, 14]} />
            <meshStandardMaterial color="#9EA3A8" roughness={0.6} />
          </mesh>
        ))}
        {[-6.6, -3.3, 0, 3.3, 6.6].map(x => (
          <group key={x}>
            <Box args={[0.07, 0.035, 14]} position={[x, 3.0, 0]} color="#FFFFFF" basic />
            {[-6.5, 6.5].map(z => <Box key={z} args={[0.01, 0.4, 0.01]} position={[x, 3.2, z]} color="#B9BCBF" shadow={false} />)}
          </group>
        ))}
        {[[-2.7, -1.5], [2.7, 3.6]].map(([x, z]) => (
          <group key={x}>
            <Box args={[0.95, 0.22, 0.95]} position={[x, RH - 0.11, z]} color="#EDEEEF" shadow={false} />
            <Box args={[0.6, 0.01, 0.6]} position={[x, RH - 0.225, z]} color="#C9CCCF" shadow={false} />
          </group>
        ))}
      </group>

      {/* 창가 수납장 · 가방 */}
      <Box args={[0.56, 0.88, 10.8]} position={[RW - 0.3, 0.44, 1.6]} color="#F1F1EE" />
      {[[-1.8, "#22252B"], [2.2, "#2F3B55"], [5.6, "#1E2024"]].map(([z, c]) => (
        <Box key={z} args={[0.42, 0.34, 0.6]} position={[RW - 0.32, 1.05, z]} color={c} />
      ))}

      {/* 강사님 자리: 둥근 높은 테이블 · 옷걸이 */}
      <mesh position={[6.4, 1.06, -6.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.045, 36]} />
        <meshStandardMaterial color="#D9A85F" roughness={0.85} />
      </mesh>
      <mesh position={[6.4, 0.53, -6.2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.04, 10]} />
        <meshStandardMaterial color="#1F2024" roughness={0.85} />
      </mesh>
      {[0, Math.PI / 2].map(r => <Box key={r} args={[0.7, 0.03, 0.05]} position={[6.4, 0.02, -6.2]} rotation={[0, r + 0.4, 0]} color="#1F2024" />)}
      <mesh position={[8.8, 0.9, -7.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 10]} />
        <meshStandardMaterial color={WHITE} roughness={0.85} />
      </mesh>
      <mesh position={[8.8, 1.75, -7.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.22, 0.025, 8, 20]} />
        <meshStandardMaterial color="#8C9096" roughness={0.85} />
      </mesh>
    </>
  );
}

export function Lights() {
  // three r155+ 는 빛 세기 단위가 바뀌어서 예전 값에 π를 곱해요
  return (
    <>
      <hemisphereLight args={["#FFFBF2", "#B7B2A8", 0.85 * Math.PI]} />
      <ambientLight intensity={0.22 * Math.PI} />
      <directionalLight
        castShadow
        color="#FFF4E2"
        position={[14, 16, 5]}
        intensity={0.95 * Math.PI}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
    </>
  );
}

