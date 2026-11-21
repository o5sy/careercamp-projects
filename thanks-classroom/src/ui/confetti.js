// 강사님을 누르면 터지는 꽃가루 (화면 위 캔버스)
export function burstConfetti(canvas) {
  if (!canvas || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = (canvas.width = Math.round(innerWidth * dpr)), H = (canvas.height = Math.round(innerHeight * dpr));
  const colors = ["#FF6F91", "#FFC83D", "#7AD69A", "#8FC1FF", "#C9B2FF"];
  const parts = Array.from({ length: 160 }, (_, i) => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.38,
    vx: (Math.random() - 0.5) * 18 * dpr, vy: (-Math.random() * 16 - 5) * dpr,
    s: (5 + Math.random() * 6) * dpr, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, c: colors[i % 5]
  }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.38 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    }
    if (++f < 180) requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
  })();
}
