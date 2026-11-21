// 책상 · 모니터 · 의자 · 노트북. 같은 물건은 drei Instances로 한 번에 그려요.
import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";

function Parts({ items, children, basic, color, shadow = true }) {
  if (!items.length) return null;
  return (
    <Instances key={items.length} limit={items.length} range={items.length} castShadow={shadow && !basic} receiveShadow>
      {children}
      {basic ? <meshBasicMaterial color={color} /> : <meshStandardMaterial color={color} roughness={0.85} />}
      {items.map((p, i) => <Instance key={i} position={[p[0], p[1], p[2]]} rotation={[p[3] || 0, 0, 0]} />)}
    </Instances>
  );
}

export function Desks({ seats }) {
  const parts = useMemo(() => {
    const P = { desk: [], leg: [], mon: [], monP: [], scrOn: [], scrOff: [], scrPOn: [], scrPOff: [], stand: [], base: [], seat: [], back: [], cleg: [], lapB: [], lapS: [], cup: [], bag: [] };
    seats.forEach(s => {
      const { x, z, filled, row, col } = s;
      const portrait = (row * 7 + col * 3) % 5 === 0;
      P.desk.push([x, 0.74, z]);
      [[-0.55, -0.28], [0.55, -0.28], [-0.55, 0.28], [0.55, 0.28]].forEach(([dx, dz]) => P.leg.push([x + dx, 0.36, z + dz]));
      if (portrait) {
        P.monP.push([x, 1.14, z - 0.2]);
        (filled ? P.scrPOn : P.scrPOff).push([x, 1.14, z - 0.181]);
      } else {
        P.mon.push([x, 1.04, z - 0.2]);
        (filled ? P.scrOn : P.scrOff).push([x, 1.04, z - 0.181]);
      }
      P.stand.push([x, 0.86, z - 0.23]);
      P.base.push([x, 0.765, z - 0.21]);
      P.seat.push([x, 0.44, z + 0.62]);
      P.back.push([x, 0.76, z + 0.86, -0.1]);
      [[-0.2, -0.19], [0.2, -0.19], [-0.2, 0.19], [0.2, 0.19]].forEach(([dx, dz]) => P.cleg.push([x + dx, 0.21, z + 0.62 + dz]));
      if (filled) {
        P.lapB.push([x - 0.3, 0.764, z + 0.04]);
        P.lapS.push([x - 0.3, 0.87, z - 0.07, -0.3]);
        if ((row + col) % 2) P.cup.push([x + 0.38, 0.83, z + 0.08]);
      } else if ((row * 3 + col) % 4 === 0) {
        P.bag.push([x, 0.62, z + 0.78, -0.1]);
      }
    });
    return P;
  }, [seats]);

  return (
    <>
      <Parts items={parts.desk} color="#E7DAC2"><boxGeometry args={[1.18, 0.035, 0.64]} /></Parts>
      <Parts items={parts.leg} color="#F2F2EF"><boxGeometry args={[0.035, 0.72, 0.035]} /></Parts>
      <Parts items={parts.mon} color="#1B1C20"><boxGeometry args={[0.62, 0.37, 0.035]} /></Parts>
      <Parts items={parts.monP} color="#1B1C20"><boxGeometry args={[0.37, 0.62, 0.035]} /></Parts>
      <Parts items={parts.scrOn} color="#DDE6F2" basic><planeGeometry args={[0.58, 0.33]} /></Parts>
      <Parts items={parts.scrOff} color="#2A2E36" basic><planeGeometry args={[0.58, 0.33]} /></Parts>
      <Parts items={parts.scrPOn} color="#E7EDF5" basic><planeGeometry args={[0.33, 0.58]} /></Parts>
      <Parts items={parts.scrPOff} color="#2A2E36" basic><planeGeometry args={[0.33, 0.58]} /></Parts>
      <Parts items={parts.stand} color="#1B1C20"><boxGeometry args={[0.05, 0.2, 0.04]} /></Parts>
      <Parts items={parts.base} color="#1B1C20"><boxGeometry args={[0.22, 0.015, 0.16]} /></Parts>
      <Parts items={parts.seat} color="#BDB5A9"><boxGeometry args={[0.46, 0.06, 0.44]} /></Parts>
      <Parts items={parts.back} color="#E4E6E8"><boxGeometry args={[0.46, 0.42, 0.04]} /></Parts>
      <Parts items={parts.cleg} color="#F2F2EF"><boxGeometry args={[0.03, 0.42, 0.03]} /></Parts>
      <Parts items={parts.lapB} color="#8E939B"><boxGeometry args={[0.32, 0.014, 0.22]} /></Parts>
      <Parts items={parts.lapS} color="#8E939B"><boxGeometry args={[0.32, 0.21, 0.01]} /></Parts>
      <Parts items={parts.cup} color="#C98A45"><cylinderGeometry args={[0.04, 0.033, 0.14, 12]} /></Parts>
      <Parts items={parts.bag} color="#30343C"><boxGeometry args={[0.34, 0.3, 0.14]} /></Parts>
    </>
  );
}
