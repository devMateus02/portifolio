"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import PhotoReveal from "../components/3d/PhotoReveal";
import ScrambleText from "../components/gsapcomponets/ScrambleText";
import ScrollRevealText from "../components/gsapcomponets/ScrollRevealText";
import Marquee from "../components/gsapcomponets/Marquee";
import MagneticButton from "../components/MagneticButton";

import Navbar from "@/app/components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const stack = [
  {  ico: "/icons8-react-100.png", lag: "48px" },
  {  ico: "/icons8-nextjs-100.png" ,lag: "48px"},
  {  ico: "/icons8-node-js-100.png",lag: "48px" },
  {  ico: "/icons8-typescript-100.png",lag: "48px" },
  {  ico: "/icons8-javascript-48.png",lag: "48px" },
  {  ico: "/icons8-mongodb-100.png",lag: "48px"},
  {  ico: "/icons8-mysql-100.png",lag: "48px" },
  {  ico: "/gsap.png",lag: "58px" },
  {  ico: "/icons8-java-96.png",lag: "58px" },
  {  ico: "/icons8-tailwind-css-96.png",lag: "48px" },
];

const diferenciais = [
  {
    titulo: "Desenvolvimento Full Stack",
    sub: "front + back + banco",
    texto:
      "Cuido do projeto de ponta a ponta, da interface ao servidor. Você não precisa juntar vários profissionais para tirar uma ideia do papel.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="8" height="8" rx="2" />
        <rect x="15" y="4" width="8" height="8" rx="2" />
        <rect x="4" y="15" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    titulo: "Performance e Escalabilidade",
    sub: "rápido por padrão",
    texto:
      "Sites que carregam rápido e sistemas preparados para crescer sem precisar reescrever tudo seis meses depois.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2 3 14h8l-1 8 10-12h-8z" />
      </svg>
    ),
  },
  {
    titulo: "Foco em Resultados",
    sub: "negócio em primeiro lugar",
    texto:
      'Antes de escrever a primeira linha, eu pergunto o que isso resolve para o seu negócio. Tecnologia é meio, não fim.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

const principios = [
  {
    titulo: "Sistemas, não remendos",
    texto:
      "Uma boa arquitetura deixa espaço para novas ideias sem quebrar o que já existe. Penso na estrutura antes de sair codando.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
        <rect x="10" y="3" width="4" height="18" rx="1" />
        <rect x="3" y="10" width="18" height="4" rx="1" />
      </svg>
    ),
  },
  {
    titulo: "Clareza acima de esperteza",
    texto:
      "Código simples vence. Prefiro algo que qualquer dev entende a uma solução genial que ninguém consegue manter.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="5" height="5" />
        <rect x="16" y="3" width="5" height="5" />
        <rect x="9.5" y="9.5" width="5" height="5" />
        <rect x="3" y="16" width="5" height="5" />
        <rect x="16" y="16" width="5" height="5" />
      </svg>
    ),
  },
  {
    titulo: "O contexto do negócio importa",
    texto:
      'Decisões técnicas são decisões de negócio. Sempre pergunto o que isso significa para a empresa antes de escolher a "solução certa".',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="4" height="4" />
        <rect x="10" y="3" width="4" height="4" />
        <rect x="17" y="3" width="4" height="4" />
        <rect x="3" y="10" width="4" height="4" />
        <rect x="10" y="10" width="4" height="4" />
        <rect x="17" y="10" width="4" height="4" />
        <rect x="3" y="17" width="4" height="4" />
        <rect x="10" y="17" width="4" height="4" />
        <rect x="17" y="17" width="4" height="4" />
      </svg>
    ),
  },
  {
    titulo: "Pensamento de longo prazo",
    texto:
      "Todo atalho cobra a conta depois. Prefiro gastar um dia a mais agora do que perder uma semana lá na frente.",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 19 19 5M19 5v8M19 5h-8" />
      </svg>
    ),
  },
];

const naoFaco = [
  { b: "Tutorial completo passo a passo.", t: "Te mostro o caminho, mas não percorro por você." },
  { b: "Implementar às cegas.", t: "Não saio adicionando funcionalidades sem entender o sistema em que elas entram." },
  { b: "Projetos sem objetivo claro.", t: "Sem direção de negócio definida, o resultado raramente é bom." },
  { b: '"Sempre foi assim".', t: "Se a equipe não está aberta a mudar o que não funciona, talvez eu não seja a pessoa certa." },
  { b: "Consultoria gratuita.", t: "Tenho prazer em ajudar, mas trabalho sério é remunerado." },
];

export default function SobrePage() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.utils.toArray(".rv").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative min-h-screen overflow-x-hidden bg-[#060608] text-neutral-200 overflow-x-hidden">
      {/* grid de fundo */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      {/* glows roxos */}
      <div className="fixed -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-700/[0.12] pointer-events-none z-0" />
      <div className="fixed top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-500/[0.08] pointer-events-none z-0" />
      <div className="fixed -bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-700/[0.07] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10">
        {/* HERO */}
        <section className="pt-24 pb-28">
          <div className="mx-auto max-w-[1200px] px-8">
           
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-5 items-center">
              <div>
              
                <ScrambleText
  className="mt-7 md:max-w-[640px] text-[clamp(20px,2.4vw,30px)] leading-snug text-neutral-300"
  stagger={.03}
  cycles={5}
  segments={[
    { text: "De sapateiro a desenvolvedor fullstack. Criando sites e " },
    { text: "sistemas web completos", className: "text-purple-400" },
    { text: " para empresas. Mais de 3 anos transformando ideias em produtos modernos, performáticos e pensados para gerar resultados reais." },
  ]}
/>
                <div className="rv mt-8 inline-flex items-center gap-3 rounded-[10px] border border-green-400/25 bg-green-400/5 px-[18px] py-3 font-mono text-[13px] text-green-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  Disponível · Aceitando projetos selecionados para 2026
                </div>
              </div>

            
              <PhotoReveal src="hero_base.webp"/>
             
            </div>

            {/* STATS */}
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-9 lg:gap-6 border-t border-white/[0.06] pt-11">
              {[
                { n: "3", suf: "+", l: "anos de experiência" },
                { n: "20", suf: "+", l: "projetos.entregues" },
                { n: "90", suf: "%", l: "performance média" },
                { n: "100", suf: "%", l: "foco em resultado" },
              ].map((s) => (
                <div key={s.l} className="rv">
                  <div className="font-mono text-[clamp(42px,5vw,64px)] font-extrabold tracking-tight leading-none">
                    {s.n}
                    <span className="text-purple-500 text-[0.5em] align-super">{s.suf}</span>
                  </div>
                  <span className="mt-2.5 block font-mono text-[12.5px] text-neutral-400">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HISTÓRIA */}
<section className="relative py-28 bg-[#0a0a0a0c]">
  <div className="mx-auto max-w-[1200px] px-8">
    <span className="absolute top-0 right-8 font-mono font-light text-[200px] leading-none text-purple-500/[0.05] select-none pointer-events-none">
      02
    </span>

    <h2 className="rv text-4xl font-bold tracking-tight leading-[1.05]">Minha História</h2>


    <div className="mt-9 max-w-[680px] flex flex-col gap-6">
      <ScrollRevealText className=" leading-[1.75] text-neutral-400">

        <h2 className="text-2xl text-white md:w-[58ch] mb-2.5" >
                Sou Desenvolvedor <span className="font-medium text-purple-500">Full Stack</span>. Ajudo empresas e empreendedores a transformar a complexidade de seus processos em sistemas web simples, rápidos e fáceis de usar.
        </h2>
        <p>Comecei mexendo com o front-end e logo percebi que gostava mesmo era de entender o sistema inteiro — do banco de dados à interface. Cada parte é uma engrenagem de uma máquina maior, e essa forma de pensar passou a guiar tudo que eu construo.</p>

         <p> Ao longo dos projetos aprendi que entregar é o que importa. Código bonito que nunca sai do papel não vale nada perto de um produto funcionando na mão do cliente. Prefiro algo simples e sólido a algo genial e frágil.</p>

           <p> Hoje trabalho com a stack moderna de JavaScript — React, Next.js e Node — construindo desde landing pages até sistemas de gestão completos, sempre com olho na performance e na experiência de quem usa.</p>
      </ScrollRevealText>

    
    </div>
  </div>
</section>

        {/* STACK */}
        <section >
 

  {/* carrossel full-width, fora do container central */}
  <Marquee className="rv my-12" speed={40}>
    {stack.map((s, i) => (
      <div
        key={`${s.icon}-${i}`}
        className="group mx-3 px-[26px] py-[26px] flex items-center gap-3.5  font-mono  cursor-default transition-all duration-300 ease-in-out hover:scale-140"
      >
        

      <img src={s.ico} alt={s.label} style={{ width: s.lag }} />
      
      </div>
    ))}
  </Marquee>

  {/* máscaras de fade nas bordas (opcional, fica elegante) */}
</section>

        {/* DIFERENCIAIS */}
        <section className="py-28 bg-[#0a0a0a10]">
  <div className="mx-auto max-w-[1200px] px-8">
    <span className="rv block font-mono text-[13px] text-purple-500/90 mb-5">// seção.diferenciais</span>
    <h2 className="rv text-[clamp(34px,5vw,60px)] font-bold tracking-tight leading-[1.05]">Diferenciais</h2>

    <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
      {diferenciais.map((d, i) => (
        <div
          key={d.titulo}
          className="rv group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent p-8 transition-all duration-500 hover:border-purple-500/40 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.35)]"
        >
          {/* glow que aparece no hover */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* linha de scan no topo */}
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* número de índice */}
          <span className="absolute right-6 top-6 font-mono text-[13px] text-white/15 transition-colors duration-500 group-hover:text-purple-400/70">
            0{i + 1}
          </span>

          {/* chip do ícone */}
          <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/[0.07] text-purple-300 transition-all duration-500 group-hover:border-purple-400/50 group-hover:bg-purple-500/15 group-hover:text-purple-200 group-hover:shadow-[0_0_25px_-4px_rgba(168,85,247,0.6)]">
            {d.icon}
          </div>

          <h4 className="mb-2 text-[19px] font-bold tracking-tight text-white">{d.titulo}</h4>
          <span className="mb-4 block font-mono text-[12.5px] text-purple-300/80">{`// ${d.sub}`}</span>
          <p className="text-[15px] leading-[1.7] text-neutral-400 transition-colors duration-500 group-hover:text-neutral-300">
            {d.texto}
          </p>

          {/* seta que surge no hover */}
         
        </div>
      ))}
    </div>
  </div>
</section>

        {/* PRINCÍPIOS */}
      
<section className="py-28 bg-[#0a0a0a10]">
  <div className="mx-auto max-w-[1200px] px-8">
    <span className="rv block font-mono text-[13px] text-purple-500/90 mb-5">// seção.limites</span>
    <h2 className="rv text-[clamp(34px,5vw,60px)] font-bold tracking-tight leading-[1.05]">O que eu não faço</h2>
    <p className="rv mt-2 font-mono text-[18px] text-neutral-400">
      Gosto de ser franco sobre isso. Economiza tempo para nós dois.
    </p>

    <div className="mt-11 max-w-[820px] flex flex-col gap-2">
      {naoFaco.map((item, i) => (
        <div
          key={item.b}
          className="rv group relative flex items-start gap-5 rounded-xl border border-transparent px-5 py-5 transition-all duration-300 hover:border-white/[0.07] hover:bg-white/[0.02]"
        >
          {/* barra roxa que cresce no hover */}
          <span className="absolute left-0 top-1/2 h-0 w-[2px] -translate-y-1/2 rounded-full bg-purple-500 transition-all duration-300 group-hover:h-[60%]" />

          {/* chip [x] */}
          <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/[0.06] font-mono text-[13px] text-purple-400 transition-all duration-300 group-hover:border-purple-400/50 group-hover:bg-purple-500/15 group-hover:text-purple-200">
            ✕
          </span>

          <p className="text-[16.5px] leading-[1.6] text-neutral-300">
            <b className="font-semibold text-white">{item.b}</b>{" "}
            <span className="text-neutral-400">{item.t}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
     

        {/* CTA */}
        <section className="text-center pt-14 pb-10">
          <div className="mx-auto max-w-[1200px] px-8">
           
            <h2 className="rv text-[clamp(34px,5vw,60px)] font-bold tracking-tight leading-[1.05] mb-7">
              Vamos construir algo
              <br />
              <span className="text-purple-400">juntos?</span>
            </h2>
           <div className="rv inline-block">
  <MagneticButton href="/contato">Entrar em contato</MagneticButton>
</div>
          </div>
        </section>

        {/* STATUS BAR */}
        <div className="mx-auto max-w-[1200px] mt-16 px-8 py-4 border-t border-white/[0.06] flex flex-wrap justify-between gap-2 font-mono text-[12px] text-neutral-500">
          
          <span>Mateus Celestino · Rio de Janeiro, Brasil</span>
        </div>
      </main>
    </div>
  );
}