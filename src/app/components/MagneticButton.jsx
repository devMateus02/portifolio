"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import TransitionLink from "./TransitionLink";
export default function MagneticButton({ href = "#", children, className = "" }) {
  const btn = useRef(null);
  const fill = useRef(null);

  const onMove = (e) => {
    const el = btn.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    // botão "puxa" na direção do mouse
    gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: "power3.out" });
    // conteúdo se move um pouco menos (parallax)
    gsap.to(el.querySelector("[data-content]"), {
      x: x * 0.15,
      y: y * 0.2,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to(btn.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(btn.current.querySelector("[data-content]"), {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <TransitionLink
      ref={btn}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-purple-300/30 bg-gradient-to-b from-purple-600 to-purple-800 text-[12px]  px-4 py-[12px] md:text-[16px] md:px-9 md:py-[18px] font-semibold md:font-semibold text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.65)] transition-shadow duration-300 hover:shadow-[0_15px_55px_-8px_rgba(168,85,247,0.9)] ${className}`}
    >
      {/* brilho que varre no hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* glow interno */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-purple-400/0 transition-colors duration-300 group-hover:bg-purple-400/10" />

      <span data-content className="relative flex items-center gap-3">
        {children}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="transition-transform duration-300 group-hover:translate-x-1.5"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </TransitionLink>
  );
}