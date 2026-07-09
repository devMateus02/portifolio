import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LogoMC3D from "../3d/LogoMC3D";
import MagneticButton from "../MagneticButton";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const PARAGRAFO_PARTES = [
  { texto: "Desenvolvedor Full Stack focado em criar ", destaque: false },
  { texto: "sites, sistemas web", destaque: true },
  { texto: " e ", destaque: false },
  { texto: "soluções digitais", destaque: true },
  { texto: " que ajudam empresas a crescer. Transformo ideias em produtos modernos, performáticos e pensados para gerar ", destaque: false },
  { texto: "resultados", destaque: true },
  { texto: ".", destaque: false },
];

const FEATURES = [
  {
    titulo: "Desenvolvimento Full Stack",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    titulo: "Sites e Sistemas Web",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
  },
  {
    titulo: "Performance e Escalabilidade",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    titulo: "Foco em Resultados",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      </svg>
    ),
  },
];

export default function Sobre() {
  const containerRef = useRef(null);

 useGSAP(
  () => {
    const words = gsap.utils.toArray(".reveal-word");

    gsap.fromTo(
      words,
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".reveal-text",
          start: "top 90%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );
  },
  { scope: containerRef }
);

  // monta as palavras preservando os destaques em roxo
  let wordIndex = 0;
  const palavras = PARAGRAFO_PARTES.flatMap((parte) =>
    parte.texto.split(" ").filter(Boolean).map((palavra) => ({
      palavra,
      destaque: parte.destaque,
      key: wordIndex++,
    }))
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[#060608] text-gray-200 flex items-center justify-center px-6 lg:px-16 py-20 overflow-hidden z-20"
    >
      {/* grid de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
{/* glow roxo central — bem mais intenso */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      "radial-gradient(ellipse 50% 45% at 50% 45%, rgba(124,30,224,0.15) 0%, rgba(89,5,179,0.15) 10%, transparent 65%)",
  }}
/>

{/* segunda camada de glow — núcleo quente concentrado */}
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background:
      "radial-gradient(circle 35% at 50% 68%, rgba(149,76,233,0.4) 0%, transparent 60%)",
  }}
/>

{/* vinheta escura — fecha as bordas mais cedo e mais forte */}
<div
  className="absolute inset-0 pointer-events-none z-50"
  style={{
    background:
      "radial-gradient(ellipse 70% 70% at 50% 40%, transparent 45%, rgba(6,6,8,0.95) 65%, #060608 70%)",
  }}
/>

      {/* logo 3D como camada de fundo central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <LogoMC3D />
      </div>

      {/* conteúdo */}
      <div className="relative z-50 max-w-4xl mx-auto w-full flex flex-col items-center gap-6 text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[.5em] font-semibold  text-purple-300">
            DESENVOLVEDOR FULLSTACK
          </span>
        </div>

        {/* título */}
        <h2 className="text-4xl md:text-6xl md:text-7xl font-bold tracking-tight">
          Quem <span className="text-purple-500">sou</span> eu?
        </h2>

        {/* parágrafo com reveal */}
        <p className="reveal-text text-[1.15em] md:text-[1.35em] leading-relaxed max-w-2xl flex flex-wrap justify-center mt-2">
          {palavras.map(({ palavra, destaque, key }) => (
            <span
              key={key}
              className={`reveal-word mr-[0.25em]  ${
                destaque ? "text-purple-400" : "text-gray-300"
              }`}
            >
              {palavra}
            </span>
          ))}
        </p>

        {/* espaço reservado para o logo (que está no fundo) */}
        <div className="h-[40vh] md:h-[45vh] w-full" />

        {/* features */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-0 w-full max-w-4xl">
          {FEATURES.map((f, i) => (
            <div
              key={f.titulo}
              className={`flex items-center gap-3 px-5 py-3 flex-1 justify-center sm:justify-start ${
                i !== FEATURES.length - 1 ? "sm:border-r border-zinc-700/40" : ""
              }`}
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-lg border border-purple-500/20 bg-purple-500/5 text-purple-300 shrink-0">
                {f.icon}
              </span>
              <span className="text-sm text-gray-300 text-left leading-tight">
                {f.titulo}
              </span>
            </div>
          ))}
        </div>

        {/* botão */}
        <div className="relative mt-6 group">
          <div className="absolute -inset-1 rounded-xl bg-purple-600/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
          
        </div><div className="rv inline-block">
  <MagneticButton href="/sobre">Entrar em contato</MagneticButton>
</div>
      </div>


      <div className="absolute top-[60%] left-[-285px] w-[2000px] h-full border-1 border-gray-300/5 rounded-[50%]">

      </div>
    </section>
  );
}