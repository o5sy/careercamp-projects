// 캔버스에 그려서 3D 물건에 붙이는 그림: TV · 화이트보드 · 가랜드 · 와이파이 종이 · 카펫
import * as THREE from "three";
import { useEffect, useMemo } from "react";

export function useCanvasTexture(w, h, draw, deps) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [w, h]);
  useEffect(() => {
    const ctx = tex.image.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h);
    tex.needsUpdate = true;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return tex;
}

function wrapLines(ctx, text, maxW) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

const DISPLAY = 'Gaegu, "Malgun Gothic", sans-serif';
const MONO = '"IBM Plex Mono", monospace';

export function drawTV(ctx, w, h, { quotes, idx, honoree, camp, date }) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#C6EAF7"); g.addColorStop(1, "#86CDEA");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.beginPath(); ctx.arc(860, 110, 150, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(140, 500, 120, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#1F3A4D";
  if (quotes.length) {
    const i = idx % quotes.length;
    ctx.textAlign = "left";
    ctx.font = `500 26px ${MONO}`;
    ctx.fillText(`${honoree.call} 어록  ${i + 1} / ${quotes.length}`, 52, 66);
    ctx.textAlign = "center";
    ctx.font = `700 66px ${DISPLAY}`;
    const lines = wrapLines(ctx, `“${quotes[i]}”`, w - 150);
    lines.forEach((l, k) => ctx.fillText(l, w / 2, h / 2 + 10 + (k - (lines.length - 1) / 2) * 80));
    ctx.fillStyle = "#D6335A";
    ctx.font = `700 40px ${DISPLAY}`;
    ctx.fillText(`고마워요, ${honoree.name} ♥`, w / 2, h - 52);
  } else {
    ctx.textAlign = "center";
    ctx.fillStyle = "#D6335A"; ctx.font = `700 70px ${DISPLAY}`;
    ctx.fillText("♥", w / 2, h / 2 - 96);
    ctx.fillStyle = "#1F3A4D"; ctx.font = `700 92px ${DISPLAY}`;
    ctx.fillText(`고마워요, ${honoree.name}`, w / 2, h / 2 + 10);
    ctx.font = `500 26px ${MONO}`;
    ctx.fillText(`${camp} · ${date} · 마지막 수업`, w / 2, h - 60);
  }
}

export function drawBoard(ctx, w, h, releases) {
  ctx.fillStyle = "#FCFCFA"; ctx.fillRect(0, 0, w, h);
  ctx.textAlign = "left";
  ctx.fillStyle = "#2257C7"; ctx.font = `700 64px ${DISPLAY}`;
  ctx.fillText("캠프 릴리즈 노트", 60, 96);
  ctx.strokeStyle = "#2257C7"; ctx.lineWidth = 5; ctx.beginPath();
  for (let x = 60; x <= 520; x += 10) ctx.lineTo(x, 118 + Math.sin(x / 14) * 4);
  ctx.stroke();
  ctx.font = `700 42px ${DISPLAY}`;
  releases.forEach((r, i) => {
    ctx.fillStyle = i === releases.length - 1 ? "#D6334F" : "#26292E";
    let line = `${r.ver}  ${r.when} — ${r.text}`;
    while (ctx.measureText(line).width > w - 140 && line.length > 4) line = line.slice(0, -2) + "…";
    ctx.fillText(line, 70, 196 + i * 84);
  });
  ctx.fillStyle = "#D6334F"; ctx.font = `700 70px ${DISPLAY}`;
  ctx.fillText("♥", w - 150, h - 60);
}

export function drawGarland(ctx, w, h, call) {
  const letters = ["고", "마", "워", "요", "♥", ...call, "!"];
  const colors = ["#FFCAD4", "#CADFFF", "#C2EBD7", "#E3D6FF", "#FFE48A"];
  const P0 = [40, 30], P1 = [w / 2, 150], P2 = [w - 40, 30];
  const B = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k]);
  const D = t => [0, 1].map(k => 2 * (1 - t) * (P1[k] - P0[k]) + 2 * t * (P2[k] - P1[k]));
  ctx.strokeStyle = "#5A5148"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(...P0); ctx.quadraticCurveTo(...P1, ...P2); ctx.stroke();
  letters.forEach((ch, i) => {
    const t = 0.07 + i * (0.86 / (letters.length - 1));
    const [x, y] = B(t), [dx, dy] = D(t);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(dy, dx));
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath(); ctx.moveTo(-78, 0); ctx.lineTo(78, 0); ctx.lineTo(0, 150); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2A2433"; ctx.textAlign = "center";
    ctx.font = `700 72px ${DISPLAY}`;
    ctx.fillText(ch, 0, 74);
    ctx.restore();
  });
}

export function drawWifi(ctx, w, h) {
  ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#222"; ctx.textAlign = "center";
  ctx.font = `600 30px ${MONO}`; ctx.fillText("CLASS ROOM WIFI", w / 2, 70);
  ctx.fillStyle = "#888"; ctx.fillRect(50, 110, 220, 8); ctx.fillRect(50, 140, 170, 8);
}

export function makeCarpet() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d"), img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 140 + Math.random() * 22;
    img.data[i] = v; img.data[i + 1] = v - 1; img.data[i + 2] = v - 4; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(14, 11);
  return t;
}
