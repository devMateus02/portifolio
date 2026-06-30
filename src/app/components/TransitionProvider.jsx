"use client";

import { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";

const TransitionContext = createContext(null);
export const useTransition = () => useContext(TransitionContext);

// densidade do grid de blocos
const COLS = 8;
const ROWS = 5;
const TOTAL = COLS * ROWS;

// tempo máximo (ms) que o overlay fica coberto esperando o canvas avisar.
// páginas sem canvas (que nunca chamam revealNow) revelam por aqui.
const FALLBACK_MS = 1200;

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlay = useRef(null);
  const blocks = useRef([]);
  const animating = useRef(false);
  const pendingReveal = useRef(false); // estamos cobertos, esperando p/ revelar?
  const revealed = useRef(false); // já revelamos nesta transição?

  const getOrdered = () =>
    blocks.current
      .filter(Boolean)
      .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));

  // executa a revelação (só uma vez por transição)
  const doReveal = useCallback(() => {
    if (revealed.current || !pendingReveal.current) return;
    revealed.current = true;
    pendingReveal.current = false;

    const ordered = getOrdered();
    gsap.to(ordered, {
      scaleY: 0,
      duration: 0.32,
      ease: "power2.inOut",
      stagger: { each: 0.012, from: "end" },
      onComplete: () => {
        gsap.set(overlay.current, { pointerEvents: "none" });
        animating.current = false;
      },
    });
  }, []);

  // chamado pela página com canvas quando o primeiro frame pintou
  const revealNow = useCallback(() => {
    doReveal();
  }, [doReveal]);

  // FASE 1 — cobrir a tela e navegar
  const navigateWithTransition = useCallback(
    (href) => {
      if (animating.current || href === pathname) return;
      animating.current = true;
      revealed.current = false;
      pendingReveal.current = false;

      const ordered = getOrdered();
      gsap.set(overlay.current, { pointerEvents: "all" });
      gsap.set(ordered, { transformOrigin: "bottom" });

      gsap.to(ordered, {
        scaleY: 1,
        duration: 0.32,
        ease: "power2.inOut",
        stagger: { each: 0.012, from: "start" },
        onComplete: () => {
          // tela coberta: agora pode navegar e começar a esperar o canvas
          pendingReveal.current = true;
          router.push(href);
        },
      });
    },
    [router, pathname]
  );

  // FASE 2 — quando a rota muda: arma o fallback de segurança.
  // a revelação real virá do revealNow() (canvas) OU deste timeout.
  useEffect(() => {
    if (!pendingReveal.current) return;

    const fallback = setTimeout(() => doReveal(), FALLBACK_MS);
    return () => clearTimeout(fallback);
  }, [pathname, doReveal]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, revealNow }}>
      {children}

      {/* OVERLAY de transição (grid de blocos roxos) */}
      <div
        ref={overlay}
        aria-hidden
        style={{ pointerEvents: "none" }}
        className="fixed inset-0 z-[999999]"
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <div
                key={i}
                ref={(el) => (blocks.current[i] = el)}
                data-order={col + row}
                style={{
                  transform: "scaleY(0)",
                  transformOrigin: "bottom",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                  // overlap p/ não sobrar fresta entre blocos
                  marginTop: "-1px",
                  marginLeft: "-1px",
                  width: "calc(100% + 2px)",
                  height: "calc(100% + 2px)",
                }}
                className="bg-purple-600"
              />
            );
          })}
        </div>
      </div>
    </TransitionContext.Provider>
  );
}