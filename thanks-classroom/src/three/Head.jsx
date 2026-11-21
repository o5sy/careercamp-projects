// 캐릭터 머리: 얼굴은 +z 쪽. 머리 모양 · 눈 · 입 · 안경 · 소품을 avatar 값으로 바꿔요.
import * as THREE from "three";

const INK = "#2B2230";
const DS = THREE.DoubleSide;

function Mat({ c, ...p }) {
  return <meshStandardMaterial color={c} roughness={0.85} {...p} />;
}
function Ball({ r, seg = [16, 12], c, position, scale, rotation, shadow = true, matProps }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow={shadow}>
      <sphereGeometry args={[r, seg[0], seg[1]]} />
      <Mat c={c} {...matProps} />
    </mesh>
  );
}

const CURLS = (() => {
  const arr = [];
  for (let i = 0; i < 9; i++) {
    const ang = (i / 9) * Math.PI * 2 + 0.3, front = Math.sin(ang) > 0.55;
    const r = front ? 0.17 : 0.25;
    arr.push([Math.cos(ang) * r, front ? 0.19 : 0.09, Math.sin(ang) * r - 0.02]);
  }
  arr.push([0, 0.27, -0.02], [0.12, 0.24, -0.08], [-0.12, 0.24, -0.08]);
  return arr;
})();

function Hair({ style, hair }) {
  const capLen = { buzz: 1.08, curly: 1.3, bob: 1.36, long: 1.36, bun: 1.36 }[style] || 1.32;
  const tilt = style === "bob" || style === "long" || style === "bun" ? 0.18 : 0.42;
  return (
    <>
      <mesh rotation={[-tilt, 0, 0]} castShadow>
        <sphereGeometry args={[0.288, 32, 16, 0, Math.PI * 2, 0, capLen]} />
        <Mat c={hair} side={DS} />
      </mesh>
      {(style === "bob" || style === "long") && <Ball r={0.3} seg={[28, 20]} c={hair} position={[0, -0.04, -0.08]} scale={[1.05, 1, 0.95]} />}
      {style === "long" && (
        <mesh position={[0, -0.27, -0.14]} scale={[1.3, 1, 0.7]} castShadow>
          <capsuleGeometry args={[0.2, 0.24, 6, 16]} />
          <Mat c={hair} />
        </mesh>
      )}
      {style === "bun" && <Ball r={0.11} c={hair} position={[0, 0.3, -0.12]} />}
      {style === "part" && <Ball r={0.12} c={hair} position={[-0.12, 0.19, 0.16]} scale={[1.3, 0.6, 0.8]} />}
      {style === "curly" && CURLS.map((p, i) => <Ball key={i} r={0.085} seg={[12, 10]} c={hair} position={p} />)}
    </>
  );
}

function Eyes({ kind }) {
  return [-1, 1].map(s => {
    const happy = kind === "happy" || (kind === "wink" && s === 1);
    if (happy) {
      return (
        <mesh key={s} position={[s * 0.095, 0.008, 0.256]}>
          <torusGeometry args={[0.03, 0.01, 6, 14, Math.PI]} />
          <Mat c={INK} roughness={0.4} />
        </mesh>
      );
    }
    return (
      <group key={s}>
        <Ball r={0.036} c={INK} position={[s * 0.095, 0.02, 0.25]} scale={[1, 1.15, 0.55]} shadow={false} matProps={{ roughness: 0.4 }} />
        <Ball r={0.011} seg={[8, 6]} c="#FFFFFF" position={[s * 0.095 + 0.013, 0.037, 0.268]} shadow={false} matProps={{ roughness: 0.3 }} />
      </group>
    );
  });
}

function Mouth({ kind }) {
  if (kind === "open") {
    return (
      <mesh position={[0, -0.07, 0.258]} rotation={[0.25, 0, 0]}>
        <circleGeometry args={[0.05, 20, Math.PI, Math.PI]} />
        <Mat c="#B8475B" side={DS} />
      </mesh>
    );
  }
  if (kind === "cat") {
    return [-1, 1].map(s => (
      <mesh key={s} position={[s * 0.022, -0.08, 0.258]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.022, 0.009, 6, 12, Math.PI]} />
        <Mat c="#7A3B3B" />
      </mesh>
    ));
  }
  return (
    <mesh position={[0, -0.07, 0.258]} rotation={[0, 0, Math.PI]}>
      <torusGeometry args={[0.038, 0.011, 6, 16, Math.PI]} />
      <Mat c="#7A3B3B" />
    </mesh>
  );
}

function Glasses() {
  return (
    <>
      {[-1, 1].map(s => (
        <mesh key={s} position={[s * 0.095, 0.02, 0.272]}>
          <torusGeometry args={[0.066, 0.011, 8, 24]} />
          <Mat c={INK} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0.282]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.06, 6]} />
        <Mat c={INK} roughness={0.4} />
      </mesh>
    </>
  );
}

function Accessory({ kind }) {
  switch (kind) {
    case "headphones":
      return (
        <>
          <mesh position={[0, 0, -0.02]} castShadow>
            <torusGeometry args={[0.305, 0.025, 8, 28, Math.PI]} />
            <Mat c="#3A3F58" />
          </mesh>
          {[-1, 1].map(s => (
            <mesh key={s} position={[s * 0.29, -0.02, -0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.085, 0.085, 0.07, 20]} />
              <Mat c="#FF6F91" />
            </mesh>
          ))}
        </>
      );
    case "beanie":
      return (
        <>
          <mesh position={[0, 0.01, 0]} rotation={[-0.18, 0, 0]} castShadow>
            <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, 1.3]} />
            <Mat c="#FFB547" side={DS} />
          </mesh>
          <mesh position={[0, 0.085, -0.02]} rotation={[Math.PI / 2 - 0.18, 0, 0]} castShadow>
            <torusGeometry args={[0.284, 0.04, 10, 32]} />
            <Mat c="#F0902E" />
          </mesh>
          <Ball r={0.07} seg={[14, 10]} c="#FFF3DD" position={[0, 0.32, -0.06]} />
        </>
      );
    case "sprout":
      return (
        <>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
            <Mat c="#3E9C5F" />
          </mesh>
          {[-1, 1].map(s => <Ball key={s} r={0.06} seg={[14, 10]} c="#6CCB8A" position={[s * 0.06, 0.41, 0]} scale={[1, 0.35, 0.6]} rotation={[0, 0, s * 0.5]} />)}
        </>
      );
    case "bow":
      return (
        <group position={[0.17, 0.22, 0.07]} rotation={[0, 0.4, 0.35]}>
          {[-1, 1].map(s => (
            <mesh key={s} position={[s * 0.05, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]} castShadow>
              <coneGeometry args={[0.055, 0.1, 14]} />
              <Mat c="#FF6F91" />
            </mesh>
          ))}
          <Ball r={0.028} seg={[10, 8]} c="#E84D78" />
        </group>
      );
    case "star":
      return (
        <mesh position={[0.2, 0.2, 0.1]} scale={[1, 1, 0.4]} rotation={[0, 0, 0.3]} castShadow>
          <octahedronGeometry args={[0.065]} />
          <Mat c="#FFC83D" roughness={0.4} />
        </mesh>
      );
    default:
      return null;
  }
}

export function Head({ a, tears, children }) {
  const skin = a.skin || "#F6D0B1";
  return (
    <group>
      {tears && [-1, 1].map(s => (
        <Ball key={"t" + s} r={0.03} seg={[10, 8]} c="#7EC8F2" position={[s * 0.1, -0.06, 0.25]} scale={[0.8, 1.6, 0.6]} shadow={false} matProps={{ roughness: 0.2 }} />
      ))}
      <Ball r={0.27} seg={[32, 24]} c={skin} />
      {[-1, 1].map(s => <Ball key={s} r={0.06} seg={[12, 10]} c={skin} position={[s * 0.262, -0.01, 0]} />)}
      <Hair style={a.style || "short"} hair={a.hair || "#3B2A22"} />
      <Eyes kind={a.eyes || "open"} />
      {[-1, 1].map(s => <Ball key={s} r={0.048} seg={[14, 10]} c="#FF9EB0" position={[s * 0.155, -0.055, 0.205]} scale={[1, 0.6, 0.35]} shadow={false} />)}
      <Mouth kind={a.mouth} />
      {a.glasses && <Glasses />}
      <Accessory kind={a.acc} />
      {children}
    </group>
  );
}
