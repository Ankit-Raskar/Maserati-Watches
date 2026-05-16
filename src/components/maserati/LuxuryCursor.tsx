import { useEffect, useRef } from "react";

/**
 * Premium Maserati custom cursor.
 * — Gold dot snaps instantly to pointer
 * — Ring trails with smooth lerp (0.14 factor)
 * — Expands with glow on interactive targets
 * — Hidden on mobile/touch devices
 * — Uses CSS will-change + translateX/Y for GPU compositing (no top/left)
 */
export function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Prefer pointer media for tablet detection too
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = !!t.closest("a, button, input, select, textarea, [role='button'], [data-cursor='hover']");
      if (isInteractive === hovering) return;
      hovering = isInteractive;
      if (isInteractive) {
        ring.style.width = "58px";
        ring.style.height = "58px";
        ring.style.borderColor = "rgba(232,220,170,0.95)";
        ring.style.background = "rgba(232,220,170,0.07)";
        ring.style.boxShadow =
          "0 0 48px rgba(232,220,170,0.5), 0 0 18px rgba(232,220,170,0.3), inset 0 0 20px rgba(232,220,170,0.12)";
        ring.style.mixBlendMode = "normal";
      } else {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.borderColor = "rgba(210,200,150,0.65)";
        ring.style.background = "transparent";
        ring.style.boxShadow = "0 0 24px rgba(167,160,117,0.4)";
        ring.style.mixBlendMode = "normal";
      }
    };

    const tick = () => {
      // Smooth lerp — 0.14 feels natural and premium
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    // Hide system cursor site-wide
    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Crisp gold center dot */}
      <div
        ref={dotRef}
        className="mas-cursor"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "rgba(232,220,170,1)",
          boxShadow: "0 0 10px rgba(232,220,170,0.9), 0 0 4px rgba(255,255,255,0.6)",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
        }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="mas-cursor-ring"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderRadius: "50%",
          border: "1px solid rgba(210,200,150,0.65)",
          background: "transparent",
          boxShadow: "0 0 24px rgba(167,160,117,0.4)",
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
          transition:
            "width 0.28s cubic-bezier(0.25,0.46,0.45,0.94), height 0.28s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.28s ease, box-shadow 0.28s ease, background 0.28s ease",
        }}
      />
    </>
  );
}
