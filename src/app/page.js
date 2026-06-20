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
      // pina o HERO enquanto a seção cresce
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=120%",
        pin: true,
        pinSpacing: false,   // deixa a seção subir por cima sem empurrar
      });

      // a seção cresce do scale 0 ao 1
      gsap.fromTo(
        growRef.current,
        { scale: 0 },
        {
          scale: 1,
          ease: "sine.out",
          scrollTrigger: {
            trigger: growRef.current,
            start: "top bottom",
            end: "+=90%",
            scrub: 0.9,
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <main ref={container} className="bg-[#0a0a0a] overflow-x-hidden">
      <Navbar />

      {/* Hero — pinado pelo GSAP (sem sticky CSS) */}
      <div ref={heroRef} className="h-screen w-full z-0">
        <SectionHero />
      </div>

      {/* Seção que cresce */}
      <div ref={growRef} className="relative z-10 origin-center bg-[#0a0a0a]">
        <SkillSection />
      </div>

      {/* Resto rola normal */}
      <div className="relative z-10 bg-[#0a0a0a]">
        <Sobre />
        <PrincipaisTrabalhos />
        <Servicos />
      </div>
    </main>
  );
}