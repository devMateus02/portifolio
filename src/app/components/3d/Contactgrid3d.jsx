"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * ContactGrid3D
 * Grid wireframe (só bordas) em tons de roxo sobre fundo preto.
 * O grid fica inclinado em perspectiva e as células "sobem"
 * (translateZ) conforme a proximidade do mouse.
 *
 * Os listeners de mouse ficam na WINDOW (não no wrapper),
 * então a interação funciona mesmo com conteúdo por cima
 * (card do formulário, overlays etc.).
 */

// ── Config ────────────────────────────────────────────────
const COLS = 26;
const ROWS = 16;

const RADIUS = 300;      // raio da "lanterna" (px)
const MAX_LIFT = 70;     // translateZ máximo das células (px)
const MAX_TILT = 5;      // inclinação do grid seguindo o mouse (graus)
const LERP = 0.1;        // suavização (0–1, menor = mais elástico)

// Bordas em repouso: bem apagadas, quase invisíveis no preto.
// A "lanterna" do mouse é quem revela as linhas.
const BORDER_COLORS = [
  "rgba(126, 34, 206, 0.07)",
  "rgba(147, 51, 234, 0.06)",
  "rgba(168, 85, 247, 0.05)",
];
const GLOW_COLOR = "rgba(168, 85, 247, 0.55)"; // brilho das células reveladas

export default function ContactGrid3D({ className = "" }) {
  const wrapperRef = useRef(null); // aplica a perspectiva
  const gridRef = useRef(null);    // recebe o tilt (rotationX/Y)

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const grid = gridRef.current;
    if (!wrapper || !grid) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const blocks = Array.from(grid.children);
    // amb = brilho ambiente (cintilação aleatória, independe do mouse)
    // lastZ/lastP: último valor ESCRITO no DOM (pra pular escritas iguais)
    const state = blocks.map(() => ({
      cx: 0, cy: 0, z: 0, target: 0, amb: 0, lastZ: -1, lastP: -1,
    }));

    // OTIM: rect do wrapper cacheado — antes era getBoundingClientRect
    // a CADA mousemove (força layout no meio do frame). Recalcula só
    // no resize (ResizeObserver) e no scroll.
    let wrapRect = wrapper.getBoundingClientRect();

    const measure = () => {
      wrapRect = wrapper.getBoundingClientRect();
      blocks.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        state[i].cx = r.left - wrapRect.left + r.width / 2;
        state[i].cy = r.top - wrapRect.top + r.height / 2;
      });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    const onScroll = () => { wrapRect = wrapper.getBoundingClientRect(); };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tiltX = gsap.quickTo(grid, "rotationX", { duration: 0.8, ease: "power3.out" });
    const tiltY = gsap.quickTo(grid, "rotationY", { duration: 0.8, ease: "power3.out" });

    const mouse = { x: -9999, y: -9999, inside: false };

    // ── OTIM: gerenciamento de "sono" do loop ──
    // O rAF só roda enquanto há trabalho (mouse dentro ou células
    // assentando/cintilando). Ocioso = ZERO custo por frame.
    let rafId = 0;
    let running = false;
    let pageVisible = document.visibilityState === "visible";
    let inViewport = true;

    const wake = () => {
      if (!running && pageVisible && inViewport && !reduceMotion) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    // ⚠️ Listener na window: funciona mesmo com o formulário por cima
    const onMove = (e) => {
      mouse.x = e.clientX - wrapRect.left;
      mouse.y = e.clientY - wrapRect.top;
      mouse.inside =
        e.clientX >= wrapRect.left &&
        e.clientX <= wrapRect.right &&
        e.clientY >= wrapRect.top &&
        e.clientY <= wrapRect.bottom;

      if (mouse.inside && !reduceMotion) {
        const nx = mouse.x / wrapRect.width - 0.5;
        const ny = mouse.y / wrapRect.height - 0.5;
        tiltX(-ny * MAX_TILT);
        tiltY(nx * MAX_TILT);
        wake(); // acorda o loop se estava dormindo
      }
    };

    const onLeave = () => {
      mouse.inside = false;
      tiltX(0);
      tiltY(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    // ── Animação ambiente: células aleatórias cintilam sozinhas ──
    // A cada tick, algumas células acendem de leve e apagam devagar,
    // como falhas de energia num circuito.
    let flickerId;
    const startFlicker = () => {
      if (reduceMotion || flickerId) return;
      flickerId = setInterval(() => {
        for (let n = 0; n < 3; n++) {
          const i = (Math.random() * state.length) | 0;
          if (state[i].amb < 0.1) {
            state[i].amb = 0.2 + Math.random() * 0.45;
          }
        }
        wake(); // a cintilação também acorda o loop
      }, 220);
    };
    const stopFlicker = () => { clearInterval(flickerId); flickerId = 0; };
    startFlicker();

    const tick = () => {
      const r2 = RADIUS * RADIUS;
      let busy = false; // OTIM: alguma célula ainda precisa de frames?

      for (let i = 0; i < state.length; i++) {
        const s = state[i];

        if (mouse.inside && !reduceMotion) {
          const dx = s.cx - mouse.x;
          const dy = s.cy - mouse.y;
          const d2 = dx * dx + dy * dy;

          if (d2 < r2) {
            const t = 1 - Math.sqrt(d2) / RADIUS;
            s.target = MAX_LIFT * t * t * (3 - 2 * t); // smoothstep
          } else {
            s.target = 0;
          }
        } else {
          s.target = 0;
        }

        s.z += (s.target - s.z) * LERP;
        s.amb *= 0.965; // cintilação apaga devagar

        if (s.z < 0.05 && s.target === 0 && s.amb < 0.01) {
          if (s.lastZ !== 0 || s.lastP !== 0) {
            s.z = 0;
            s.amb = 0;
            s.lastZ = 0;
            s.lastP = 0;
            blocks[i].style.transform = "";
            blocks[i].style.boxShadow = "";
            blocks[i].style.borderColor = "";
          }
          continue;
        }

        busy = true;

        const pLuz = s.z / MAX_LIFT;        // intensidade da lanterna
        const p = Math.max(pLuz, s.amb);    // lanterna OU cintilação

        // OTIM: só escreve no DOM se o valor mudou de verdade —
        // border-color e principalmente box-shadow são caros de pintar,
        // e a maioria das células repete o mesmo valor entre frames
        if (Math.abs(s.z - s.lastZ) > 0.05 || Math.abs(p - s.lastP) > 0.004) {
          s.lastZ = s.z;
          s.lastP = p;
          // só a lanterna levanta a célula; a cintilação apenas acende
          blocks[i].style.transform = `translate3d(0, 0, ${s.z}px)`;
          blocks[i].style.borderColor = `rgba(192, 132, 252, ${0.06 + p * 0.94})`;
          blocks[i].style.boxShadow = `0 0 ${16 * p}px ${GLOW_COLOR}`;
        }
      }

      // OTIM: com o mouse dentro sempre continua; fora, continua só até
      // as células assentarem — depois o loop DORME até o próximo evento
      if (mouse.inside || busy) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    wake();

    // OTIM: fora do viewport ou aba oculta → para rAF E o flicker
    // (antes o setInterval seguia enchendo a fila em background)
    const applyVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      if (pageVisible && inViewport) {
        startFlicker();
        wake();
      } else {
        stopFlicker();
        cancelAnimationFrame(rafId);
        running = false;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      applyVisibility();
    }, { threshold: 0 });
    io.observe(wrapper);
    document.addEventListener("visibilitychange", applyVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      stopFlicker();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", applyVisibility);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 overflow-hidden bg-black ${className}`}
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      <div
        ref={gridRef}
        style={{
          position: "absolute",
          inset: "-6%",
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${BORDER_COLORS[i % BORDER_COLORS.length]}`,
              // margem negativa colapsa bordas vizinhas em uma linha só
              margin: "-0.5px",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>
    </div>
  );
}