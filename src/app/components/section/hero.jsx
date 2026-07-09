"use client";
import { useRef } from "react";
import FluidPortrait from "../3d/FluidPortrait";
import MagneticButton from "../MagneticButton";
import TransitionLink from "../TransitionLink";
export default function Hero() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative max-w-screen h-screen overflow-hidden flex flex-col justify-end bg-[#060608]"
    >
        <div
        className="fixed inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      {/* Glow roxo */}
      <div
        className="absolute pointer-events-none bg-purple-500/10 rounded-full blur-[120px]"
        style={{ top: -80, left: -60, width: 400, height: 400 }}
      />

      {/* Tag vertical */}
      <span
        className="absolute top-15 right-12 text-[11px] tracking-widest text-white/15 uppercase z-10"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        3 anos de experiência
      </span>

    


        <p className="absolute  top-[62%]  lg:top-[55%] left-[5%] text-[12px] lg:text-[18px] lg:font-light font-semibold tracking-widest text-gray-300 lg:text-gray-100/90  uppercase mb-10 leading-relaxed z-50">
          Desenvolvedor Fullstack
          <span className="block mb-4">& Web Designer</span>

       
        </p>

 <div className="rv inline-block absolute bottom-10 right-[26%] md:top-[30%] md:right-[15%] z-50">
  <MagneticButton href="/contato">Ver projetos</MagneticButton>
</div>
    

      {/* Linha de assinatura roxa */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-10"
        style={{
          background: "linear-gradient(90deg, #aa1bfd 0%, transparent 10%)",
        }}
      />

      {/* Canvas cobrindo a seção INTEIRA, atrás do texto */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <FluidPortrait eventTarget={sectionRef} />
      </div>
    </section>
  );
}
