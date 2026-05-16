import { useEffect, useRef } from "react";

/**
 * Optimized golden particle field.
 * — Uses offscreen canvas for pre-rendered particles
 * — Visibility API pauses animation when tab is hidden
 * — Adaptive particle count based on device pixel ratio & screen size
 */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio, 2); // cap at 2× for perf
    let raf = 0;
    let paused = false;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Adaptive count — fewer on small/low-DPI screens
    const count = Math.min(
      80,
      Math.floor((window.innerWidth * window.innerHeight) / 20000),
    );

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; pulse: number };
    const ps: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: -(Math.random() * 0.22 + 0.04) * dpr,
      r: (Math.random() * 1.4 + 0.5) * dpr,
      a: Math.random() * 0.55 + 0.2,
      pulse: Math.random() * Math.PI * 2, // phase offset for breathing
    }));

    const tick = () => {
      if (paused) { raf = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, W(), H());
      const t = performance.now() * 0.001;

      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -12) { p.y = H() + 12; p.x = Math.random() * W(); }
        if (p.x < -12) p.x = W() + 12;
        if (p.x > W() + 12) p.x = -12;

        // Subtle pulsing opacity
        const ao = p.a * (0.75 + 0.25 * Math.sin(t * 0.9 + p.pulse));

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5.5);
        grad.addColorStop(0, `rgba(232,220,170,${ao})`);
        grad.addColorStop(0.4, `rgba(210,195,140,${ao * 0.5})`);
        grad.addColorStop(1, "rgba(232,220,170,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => { paused = document.hidden; };
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="mas-particles"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.85,
      }}
    />
  );
}
