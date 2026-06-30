"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}=+*^?#%&@$";

export default function ScrambleText({
  segments,
  as: Tag = "p",
  className = "",
  stagger = 0.035,
  cycles = 12,
  start = "top 85%",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const letterEls = Array.from(el.querySelectorAll("[data-final]"));
    gsap.set(letterEls, { filter: "blur(8px)", opacity: 0 });

    const tweens = [];

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        letterEls.forEach((letter, i) => {
          const final = letter.dataset.final;

          if (final === " ") {
            gsap.to(letter, { opacity: 1, filter: "blur(0px)", duration: 0.2, delay: i * stagger });
            return;
          }

          gsap.to(letter, { opacity: 1, duration: 0.15, delay: i * stagger });

          const t = gsap.to({}, {
            duration: cycles * 0.03,
            delay: i * stagger,
            ease: "none",
            onUpdate: function () {
              const progress = this.progress();
              letter.style.filter = `blur(${(1 - progress) * 7}px)`;
              if (progress < 1) {
                letter.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            },
            onComplete: () => {
              letter.textContent = final;
              letter.style.filter = "blur(0px)";
            },
          });
          tweens.push(t);
        });
      },
    });

    return () => {
      st.kill();
      tweens.forEach((t) => t.kill());
    };
  }, [segments, stagger, cycles, start]);

  let globalIndex = 0;

  return (
    <Tag ref={ref} className={className} aria-label={segments.map((s) => s.text).join("")}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className || ""}>
          {Array.from(seg.text).map((ch) => {
            globalIndex++;
            return (
              <span
                key={globalIndex}
                data-final={ch}
                aria-hidden="true"
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}