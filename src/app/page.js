"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Navbar from "@/app/components/Navbar";
import SectionHero from "@/app/components/section/hero";
import SkillSection from "@/app/components/section/SkillsSection";
import Sobre from "@/app/components/section/sobre";
import PrincipaisTrabalhos from "@/app/components/section/PrincipaisTrabalhos";
import Servicos from "@/app/components/section/Servicos";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const heroRef = useRef(null);
  const growRef = useRef(null);

 useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",        // toda a animação dura 1 tela de scroll
            scrub: 0.9,
            pin: true,            // pina o hero durante a animação inteira
            pinSpacing: false,
            anticipatePin: 1,
          },
        });

        // a seção cresce dentro dessa mesma janela pinada
        tl.fromTo(
          growRef.current,
          { scale: 0 },
          { scale: 1, ease: "sine.out" },
          0   // começa no início da timeline
        );
      });
    },
    { scope: container }
  );

  return (
    <main ref={container} className="bg-grid relative bg-[#0a0a0a] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <div ref={heroRef} className="h-screen w-full z-0">
        <SectionHero />
      </div>

      {/* Seção (cresce só no desktop; no mobile aparece normal) */}
      <div ref={growRef} className="relative z-10 origin-center bg-[#0a0a0a]">
        <SkillSection />
      </div>

      {/* Resto */}
      <div className="relative z-10 bg-[#0a0a0a]">
        <Sobre />
        <PrincipaisTrabalhos />
        <Servicos />
      </div>
    </main>
  );
}