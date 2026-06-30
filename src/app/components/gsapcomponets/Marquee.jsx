"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Carrossel infinito (marquee) horizontal.
 * - speed: pixels por segundo
 * - pauseOnHover: pausa o movimento quando o mouse entra
 * O conteúdo passado em children é duplicado p/ dar o loop sem emendas.
 */
export default function Marquee({ children, speed = 60, pauseOnHover = true, className = "" }) {
  const track = useRef(null);
  const tween = useRef(null);

  useGSAP(
    () => {
      const el = track.current;
      // metade = largura do conteúdo original (duplicamos no JSX)
      const distance = el.scrollWidth / 2;

      tween.current = gsap.to(el, {
        x: -distance,
        duration: distance / speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          // mantém o x sempre dentro de [-distance, 0] → loop perfeito
          x: gsap.utils.unitize((x) => parseFloat(x) % distance),
        },
      });
    },
    { scope: track }
  );

  const pause = () => pauseOnHover && tween.current?.pause();
  const play = () => pauseOnHover && tween.current?.play();

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={play}
      onMouseLeave={play}
    >
      <div ref={track} className="flex w-max h-[30%]">
        {children}
        {children}
      </div>
    </div>
  );
}