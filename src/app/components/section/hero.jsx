"use client";
import { useRef } from "react";
import RibbonScene from "../RibbonScene";
import FluidPortrait from "../FluidPortrait";

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

    
{/*       
        <span className="fixed top-[25%] left-[2%]  text-white font-extrabold leading-none tracking-tight text-[140px]">
          {" "}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-5 h-px bg-purple-600 flex-shrink-0" />
            <p className="text-[13px] font-light tracking-widest text-gray-50/90 uppercase">
              Olá, eu sou
            </p>
          </div>
          MATEUS
        </span>

        <span className="fixed right-0 bottom-10  text-white font-extrabold leading-none z-10 tracking-tight text-[140px]">
          CELESTINO
        </span> */}

        <p className="absolute  top-[62%]  lg:top-[55%] left-[5%] text-[12px] lg:text-[18px] lg:font-light font-semibold tracking-widest text-gray-300 lg:text-gray-100/90  uppercase mb-10 leading-relaxed z-50">
          Desenvolvedor Fullstack
          <span className="block mb-4">& Web Designer</span>

       
        </p>

 <a href="#"
  className="group absolute z-50 inline-flex items-center gap-2 lg:gap-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 py-2 lg:px-5 lg:py-2.5 transition-all duration-300
  hover:border-purple-500/40 hover:bg-purple-500/[0.08] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]
  active:border-purple-500/40 active:bg-purple-500/[0.08] active:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]
  bottom-8 left-1/2 -translate-x-1/2
  lg:bottom-auto lg:left-auto lg:translate-x-0 lg:top-[35%] lg:right-[15%]"
>
  {/* ponto pulsante */}
  <span className="relative flex h-[6px] w-[6px] flex-shrink-0">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-500 opacity-60" />
    <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-purple-500" />
  </span>

  {/* texto */}
  <span className="text-[9px] lg:text-[12px] font-bold uppercase lg:tracking-[0.18em] text-white/90 transition-colors duration-300 group-hover:text-white group-active:text-white">
    Ver Projetos
  </span>

  {/* seta */}
  <span className="relative ml-0.5 lg:ml-1 flex h-7 w-7 lg:h-8 lg:w-8 items-center justify-center overflow-hidden rounded-full border border-purple-500/40 transition-all duration-300 group-hover:border-purple-500 group-hover:bg-purple-500/20 group-active:border-purple-500 group-active:bg-purple-500/20">
    <svg
      width="11"
      height="13"
      viewBox="0 0 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-300 ease-out group-hover:translate-x-[14px] group-hover:-translate-y-[14px] group-hover:opacity-[0] group-active:translate-x-[14px] group-active:-translate-y-[14px] group-active:opacity-[0]"
    >
      <path
        d="M10.8182 0.787811C10.7009 0.248132 10.1683 -0.0942568 9.62864 0.0230645L0.834049 1.93493C0.29437 2.05225 -0.0480194 2.58486 0.0693025 3.12454C0.186624 3.66422 0.719229 4.00661 1.25891 3.88928L9.07632 2.18985L10.7758 10.0073C10.8931 10.5469 11.4257 10.8893 11.9654 10.772C12.505 10.6547 12.8474 10.1221 12.7301 9.5824L10.8182 0.787811ZM0.841064 15.0002L1.68224 15.541L10.6822 1.541L9.84107 1.00024L8.99989 0.459484L-0.000114024 14.4595L0.841064 15.0002Z"
        fill="white"
      />
    </svg>
    {/* segunda seta que entra por baixo-esquerda (efeito de loop) */}
    <svg
      width="11"
      height="13"
      viewBox="0 0 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -translate-x-[14px] translate-y-[14px] opacity-[0] transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-[1] group-hover:rotate-90 group-active:translate-x-0 group-active:translate-y-0 group-active:opacity-[1] group-active:rotate-90"
    >
      <path
        d="M10.8182 0.787811C10.7009 0.248132 10.1683 -0.0942568 9.62864 0.0230645L0.834049 1.93493C0.29437 2.05225 -0.0480194 2.58486 0.0693025 3.12454C0.186624 3.66422 0.719229 4.00661 1.25891 3.88928L9.07632 2.18985L10.7758 10.0073C10.8931 10.5469 11.4257 10.8893 11.9654 10.772C12.505 10.6547 12.8474 10.1221 12.7301 9.5824L10.8182 0.787811ZM0.841064 15.0002L1.68224 15.541L10.6822 1.541L9.84107 1.00024L8.99989 0.459484L-0.000114024 14.4595L0.841064 15.0002Z"
        fill="white"
      />
    </svg>
  </span>
</a>
    

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
