"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Renderiza DENTRO do <Canvas> (idealmente dentro do <Suspense>, junto da cena).
 * Espera alguns frames realmente renderizados e então chama onReady,
 * garantindo que a revelação da transição só comece com o canvas já pintado.
 */
export function RevealSignal({ onReady, framesToWait = 3 }) {
  const fired = useRef(false);
  const count = useRef(0);

  useFrame(() => {
    if (fired.current) return;
    count.current += 1;
    if (count.current >= framesToWait) {
      fired.current = true;
      onReady?.();
    }
  });

  return null;
}