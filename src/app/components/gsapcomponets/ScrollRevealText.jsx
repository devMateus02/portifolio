"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function ScrollRevealText({ as: Tag = "p", className = "", children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const split = SplitText.create(ref.current, { type: "words", wordsClass: "reveal-word" });

     gsap.fromTo(
  split.words,
  { opacity: 0.12 },
  {
    opacity: 1,
    ease: "none",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ref.current,
      start: "top 85%",
      end: "bottom 50%",
      scrub: .8,
    
    },
  }
);

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}