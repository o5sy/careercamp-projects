// 카메라: drei CameraControls로 드래그 · 확대, 시점 바꾸기, 사람에게 부드럽게 다가가기
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM } from "../model.js";

export const VIEWS = [
  { name: "뒤에서 본 강의실 (자리표와 같은 방향)", pos: [2.5, 8.6, 15.5], target: [0, 0.6, -1.4] },
  { name: "앞에서 본 강의실 (얼굴이 보여요)", pos: [-3.5, 6.8, -13], target: [0.5, 0.7, 0.8] },
  { name: "뒤 오른쪽에서", pos: [9.8, 7.6, 14.2], target: [0, 0.8, -1.5] },
  { name: "위에서 내려다보기", pos: [0.01, 21, 5.5], target: [0, 0, 0.6] }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const CameraRig = forwardRef(function CameraRig(_, ref) {
  const cc = useRef();
  const { camera, size } = useThree();
  const aspect = size.width / size.height;

  // 세로 화면이면 조금 더 멀리서
  function pose(v) {
    const t = new THREE.Vector3(...v.target), p = new THREE.Vector3(...v.pos);
    const k = aspect >= 1.25 ? 1 : clamp(1.25 / aspect, 1, 2.4);
    return { pos: t.clone().add(p.sub(t).multiplyScalar(k)), target: t };
  }
  function lookAt(pos, target, smooth) {
    cc.current?.setLookAt(pos.x, pos.y, pos.z, target.x, target.y, target.z, smooth);
  }

  useEffect(() => {
    const c = cc.current;
    if (!c) return;
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-ROOM.RW, 0, -ROOM.RD), new THREE.Vector3(ROOM.RW, 3, ROOM.RD)));
    const v = pose(VIEWS[0]);
    lookAt(v.pos, v.target, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useImperativeHandle(ref, () => ({
    // 감정 표현용: 뒤에서 강의실 전체를 보되, 학생 쪽을 보고 선 강사님 얼굴이 가운데 오게
    overview() {
      const v = pose({ pos: [-1.5, 8.5, 12.5], target: [3.0, 0.9, -3.6] });
      lookAt(v.pos, v.target, true);
    },
    view(i) {
      const v = pose(VIEWS[i % VIEWS.length]);
      lookAt(v.pos, v.target, true);
    },
    // mode "bubble": 말풍선 · "writer": 쪽지 쓰기 창(오른쪽, 휴대폰은 아래)을 피해서 보여 주기
    focus({ x, y, z, ry, isT }, mode) {
      const head = new THREE.Vector3(x, y, z);
      const fwd = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
      const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
      const narrow = size.width < 640;
      const emote = mode === "emote"; // 강사님 얼굴 + 옆으로 수강생들이 같이 보이게 조금 멀리
      const dist = (emote ? 5.2 : isT ? 3.3 : 2.7) * (narrow ? 1.35 : 1);
      const pos = head.clone().addScaledVector(fwd, dist).addScaledVector(right, emote ? -1.6 : 0.7).add(new THREE.Vector3(0, emote ? 1.6 : isT ? 0.8 : 1.45, 0));
      const target = head.clone().add(new THREE.Vector3(0, 0.1, 0));
      const halfH = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      if (narrow) target.y -= mode === "writer" ? halfH * 0.75 : 0.65;
      else if (mode === "writer") target.addScaledVector(right, -(200 / size.width) * 2 * halfH * aspect);
      lookAt(pos, target, true);
    }
  }));

  return <CameraControls ref={cc} makeDefault minDistance={2.2} maxDistance={44} maxPolarAngle={1.42} smoothTime={0.45} />;
});
