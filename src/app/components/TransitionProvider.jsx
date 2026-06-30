"use client";

import { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";

const TransitionContext = createContext(null);
export const useTransition = () => useContext(TransitionContext);

const COLS = 8;
const ROWS = 5;
const TOTAL = COLS * ROWS;

export default function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlay = useRef(null);
  const blocks = useRef([]);
  const animating = useRef(false);
  const pendingReveal = useRef(false); // marca que estamos esperando a nova rota p/ revelar

  const getOrdered = () =>
    blocks.current
      .filter(Boolean)
      .sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));

  // FASE 1 — cobrir a tela e navegar
  const navigateWithTransition = useCallback(
    (href) => {
      if (animating.current) return;
      // se já estamos na rota, não faz nada
      if (href === pathname) return;

      animating.current = true;
      const ordered = getOrdered();

      gsap.set(overlay.current, { pointerEvents: "all" });
      gsap.set(ordered, { transformOrigin: "bottom" });

      gsap.to(ordered, {
        scaleY: 1,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: { each: 0.012, from: "start" },
        onComplete: () => {
          pendingReveal.current = true; // a revelação será disparada pelo useEffect do pathname
          router.push(href);
        },
      });
    },
    [router, pathname]
  );

  // FASE 2 — quando o pathname muda E havia uma transição pendente, revela
  useEffect(() => {
    if (!pendingReveal.current) return;
    pendingReveal.current = false;

    const ordered = getOrdered();

    // espera um frame p/ a nova página pintar antes de revelar
    const id = requestAnimationFrame(() => {
      gsap.to(ordered, {
        scaleY: 0,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: { each: 0.012, from: "end" },
        onComplete: () => {
          gsap.set(overlay.current, { pointerEvents: "none" });
          animating.current = false;
        },
      });
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}

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