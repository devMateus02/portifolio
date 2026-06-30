"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "../components/MagneticButton";
import Navbar from "@/app/components/Navbar";
import ScrambleText from "../components/gsapcomponets/ScrambleText";
// Se você já criou o MagneticButton, descomente a linha abaixo e troque o <Link> do CTA.
// import MagneticButton from "@/app/components/MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);



/* ---------------- DADOS ---------------- */

const servicos = [
  {
    id: "01",
    titulo: "Sites & Landing Pages",
    sub: "presença que converte",
    preco: "a partir de R$ 1.500",
    descricao:
      "Sites institucionais e landing pages rápidas, responsivas e pensadas para converter visitantes em clientes.",
    inclui: ["Design sob medida", "100% responsivo", "Otimização de performance", "SEO técnico básico"],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 8h18M7 12h6" />
      </svg>
    ),
  },
  {
    id: "02",
    titulo: "Sistemas Web & SaaS",
    sub: "software sob medida",
    preco: "a partir de R$ 6.000",
    descricao:
      "Sistemas de gestão e plataformas SaaS completas — do banco de dados à interface — feitos para o seu processo.",
    inclui: ["Painel administrativo", "Autenticação e permissões", "Integrações e API", "Relatórios e dashboards"],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "03",
    titulo: "Lojas & E-commerce",
    sub: "venda online de verdade",
    preco: "a partir de R$ 4.000",
    descricao:
      "Lojas virtuais com checkout, pagamentos e catálogo — ou integração com WhatsApp para vendas diretas.",
    inclui: ["Catálogo de produtos", "Pagamento integrado", "Carrinho e checkout", "Integração WhatsApp"],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h2l2.4 12.3a1 1 0 0 0 1 .7h9.7a1 1 0 0 0 1-.8L21 7H6" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
    ),
  },
  {
    id: "04",
    titulo: "Apps Mobile & PWA",
    sub: "seu produto no bolso",
    preco: "a partir de R$ 5.000",
    descricao:
      "Aplicativos multiplataforma e Progressive Web Apps que rodam no celular com experiência nativa.",
    inclui: ["Android e iOS", "Funciona offline (PWA)", "Notificações push", "Publicação nas lojas"],
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18h2" />
      </svg>
    ),
  },
];

const processo = [
  {
    n: "01",
    titulo: "Conversa & Descoberta",
    texto:
      "Entendo seu negócio, seus objetivos e o problema real a resolver. Sem entender o contexto, não escrevo uma linha de código.",
  },
  {
    n: "02",
    titulo: "Proposta & Escopo",
    texto:
      "Defino o que será entregue, prazos e investimento de forma transparente. Você sabe exatamente o que esperar antes de começar.",
  },
  {
    n: "03",
    titulo: "Design & Protótipo",
    texto:
      "Desenho a interface e a arquitetura. Você valida a direção visual e o fluxo antes de partirmos para o desenvolvimento.",
  },
  {
    n: "04",
    titulo: "Desenvolvimento",
    texto:
      "Construo o produto com entregas parciais e atualizações frequentes. Você acompanha a evolução, não só o resultado final.",
  },
  {
    n: "05",
    titulo: "Entrega & Suporte",
    texto:
      "Publico o projeto, faço os ajustes finais e ofereço suporte. O lançamento é o começo da parceria, não o fim.",
  },
];

/* ---------------- PÁGINA ---------------- */

export default function ServicosPage() {
  const root = useRef(null);
  const lineRef = useRef(null);

  useGSAP(
  () => {
    // ---- HERO: título + texto entram em sequência ----
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero-tag", { y: 20, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.3")
      .from(".hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5");

    // ---- Rótulos de seção (// ...) + headings: reveal simples ----
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ---- CARDS (serviços + por que eu): batch com stagger ----
    ScrollTrigger.batch(".card-anim", {
      start: "top 85%",
      onEnter: (batch) =>
        gsap.from(batch, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          overwrite: true,
        }),
    });

    // ---- LINHA do processo acendendo no scroll ----
    const line = lineRef.current;
    if (line) {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#processo-track",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    }

    // ---- PASSOS do processo: número, ponto e texto em sequência ----
    gsap.utils.toArray(".passo").forEach((el) => {
      const num = el.querySelector(".passo-num");
      const dot = el.querySelector(".passo-dot");
      const txt = el.querySelector(".passo-txt");

      gsap
        .timeline({
          scrollTrigger: { trigger: txt, start: "top 80%", toggleActions: "play none none reverse" },
        })
        .from(num, { x: -40, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(dot, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.35")
        .from(txt, { x: 40, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    });

    // ---- CTA: card sobe + brilho ----
    gsap.from(".cta-card", {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".cta-card", start: "top 85%" },
    });
  },
  { scope: root }
);

  return (
    <div ref={root} className="relative min-h-screen overflow-x-hidden bg-[#060608] text-neutral-200">
      {/* grid de fundo */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      {/* glows */}
      <div className="fixed -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-700/[0.12] pointer-events-none z-0" />
      <div className="fixed top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-500/[0.08] pointer-events-none z-0" />
      <div className="fixed -bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-700/[0.07] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10">
        {/* HERO */}
        <section className="pt-28 pb-20">
          <div className="mx-auto max-w-[1200px] px-8">
          <span className="hero-tag block font-mono text-[13px] text-purple-500/90 mb-5">serviços</span>
           <h1 className="hero-title text-5xl font-extrabold tracking-tight leading-none">Serviços</h1>

                       <ScrambleText
             className="mt-7 md:max-w-[640px] text-[clamp(20px,2.4vw,30px)] leading-snug text-neutral-300"
             stagger={0.02}
             cycles={14}
             segments={[
               { text: "Do site simples ao sistema completo. Construo produtos digitais " },
               { text: "sob medida,", className: "text-purple-400" },
               { text: " para resolver problemas reais do seu negócio." },
             ]}
           />
          
          </div>
        </section>

        {/* GRID DE SERVIÇOS */}
        <section className="py-20">
          <div className="mx-auto max-w-[1200px] px-8">
            <span className="rv block font-mono text-[13px] text-purple-500/90 mb-5">// o.que.eu.faço</span>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {servicos.map((s) => (
                <div
                  key={s.id}
                  className="rv group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent p-8 transition-all duration-500 hover:border-purple-500/40 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.35)]"
                >
                  <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/[0.07] text-purple-300 transition-all duration-500 group-hover:border-purple-400/50 group-hover:bg-purple-500/15 group-hover:shadow-[0_0_25px_-4px_rgba(168,85,247,0.6)]">
                      {s.icon}
                    </div>
                    <span className="font-mono text-[13px] text-white/15 transition-colors duration-500 group-hover:text-purple-400/70">
                      {s.id}
                    </span>
                  </div>

                  <h3 className="relative mt-6 mb-1 text-[22px] font-bold tracking-tight text-white">{s.titulo}</h3>
                  <span className="relative mb-4 block font-mono text-[12.5px] text-purple-300/80">{`// ${s.sub}`}</span>
                  <p className="relative text-[15px] leading-[1.7] text-neutral-400">{s.descricao}</p>

                  <ul className="relative mt-5 grid grid-cols-2 gap-y-2.5 gap-x-3">
                    {s.inclui.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[13.5px] text-neutral-300">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-purple-400 flex-shrink-0">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <span className="font-mono text-[15px] text-white">{s.preco}</span>
                    <Link href="/contato" className="font-mono text-[12px] text-purple-400 flex items-center gap-1.5 transition-transform hover:translate-x-1">
                      orçar <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA — processo sticky com linha SVG */}
        <section className="py-28 bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1200px] px-8">
            <span className="rv block font-mono text-[13px] text-purple-500/90 mb-5">// como.funciona</span>
            <h2 className="rv text-[clamp(34px,5vw,60px)] font-bold tracking-tight leading-[1.05] mb-4">
              Como funciona o processo
            </h2>
            <p className="rv max-w-[560px] text-[16px] text-neutral-400 mb-16">
              Um caminho claro do primeiro contato até a entrega. Sem surpresas, com você acompanhando cada etapa.
            </p>

            {/* layout: número (esq) | linha (centro) | descrição (dir) */}
            <div id="processo-track" className="relative grid grid-cols-[auto_40px_1fr] md:grid-cols-[140px_60px_1fr]">
              {/* COLUNA CENTRAL: linha SVG que acende */}
              <div className="absolute left-[calc(theme(spacing.0))] top-0 h-full" />
              <svg
                className="pointer-events-none absolute top-0 h-full"
                style={{ left: "140px", width: "60px" }}
                preserveAspectRatio="none"
                viewBox="0 0 60 1000"
              >
                {/* trilho apagado */}
                <line x1="30" y1="0" x2="30" y2="1000" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                {/* linha que acende */}
                <line
                  ref={lineRef}
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="1000"
                  stroke="#a855f7"
                  strokeWidth="2"
                  style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.8))" }}
                />
              </svg>

              {/* PASSOS */}
              {processo.map((p) => (
                <div key={p.n} className="passo contents">
                  {/* número à esquerda */}
                  <div className="flex items-start justify-end pr-2 md:pr-6 pb-24">
                    <span className="font-mono font-light text-[clamp(40px,6vw,72px)] leading-none text-purple-500/80">
                      {p.n}
                    </span>
                  </div>
                  {/* espaço da linha (col central) + ponto */}
                  <div className="relative flex justify-center pb-24">
                    <span className="mt-3 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10" />
                  </div>
                  {/* descrição à direita */}
                  <div className="pb-24 pl-2 md:pl-6">
                    <h3 className="text-[20px] md:text-[24px] font-bold tracking-tight text-white mb-2.5 mt-1">
                      {p.titulo}
                    </h3>
                    <p className="max-w-[460px] text-[15px] leading-[1.75] text-neutral-400">{p.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUE TRABALHAR COMIGO */}
<section className="py-28">
  <div className="mx-auto max-w-[1200px] px-8">
    <span className="rv block font-mono text-[13px] text-purple-500/90 mb-5">// por.que.eu</span>
    <h2 className="rv text-[clamp(34px,5vw,60px)] font-bold tracking-tight leading-[1.05] mb-4">
      Por que trabalhar comigo
    </h2>
    <p className="rv max-w-[560px] text-[16px] text-neutral-400 mb-14">
      Mais do que entregar código, eu entrego um produto que resolve o seu problema e cresce com o seu negócio.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[
        {
          t: "Comunicação direta",
          d: "Você fala comigo, não com um intermediário. Atualizações frequentes e linguagem que você entende.",
          icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
        },
        {
          t: "Full stack de verdade",
          d: "Do banco de dados à interface, cuido do projeto inteiro. Você não precisa juntar vários profissionais.",
          icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
        },
        {
          t: "Foco em resultado",
          d: "Antes de codar, eu pergunto o que isso resolve para o seu negócio. Tecnologia é meio, não fim.",
          icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
        },
        {
          t: "Performance no DNA",
          d: "Sites e sistemas rápidos por padrão. Cada milissegundo conta para a experiência e para a conversão.",
          icon: <path d="M13 2 3 14h8l-1 8 10-12h-8z" />,
        },
        {
          t: "Entrega no prazo",
          d: "Escopo e prazos definidos desde o início, com entregas parciais para você acompanhar a evolução.",
          icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
        },
        {
          t: "Suporte contínuo",
          d: "O lançamento é o começo da parceria. Continuo por perto para ajustes, melhorias e o que surgir.",
          icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
        },
      ].map((item) => (
        <div
          key={item.t}
          className="rv group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent p-7 transition-all duration-500 hover:border-purple-500/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-18px_rgba(168,85,247,0.4)]"
        >
          <div className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-purple-600/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-500/[0.07] text-purple-300 transition-all duration-500 group-hover:border-purple-400/50 group-hover:bg-purple-500/15 group-hover:shadow-[0_0_22px_-4px_rgba(168,85,247,0.6)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {item.icon}
            </svg>
          </div>
          <h3 className="relative mb-2.5 text-[18px] font-bold tracking-tight text-white">{item.t}</h3>
          <p className="relative text-[14.5px] leading-[1.7] text-neutral-400 transition-colors duration-500 group-hover:text-neutral-300">
            {item.d}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

        {/* CTA */}
        <section className="relative overflow-hidden pt-20 pb-28">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
          <div className="relative mx-auto max-w-[900px] px-8">
            <div className="rv relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] px-8 py-16 text-center backdrop-blur-sm sm:px-16">
              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
              <span className="block font-mono text-[13px] text-purple-400/90 mb-5">// vamos.começar</span>
              <h2 className="text-[clamp(34px,5vw,60px)] font-extrabold tracking-tight leading-[1.05] mb-5">
                Tem um projeto
                <br />
                <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent">
                  em mente?
                </span>
              </h2>
              <p className="mx-auto mb-10 max-w-[460px] text-[16px] leading-relaxed text-neutral-400">
                Me conta sua ideia. A primeira conversa é sem compromisso e eu respondo rápido.
              </p>
            <MagneticButton href="/contato" >Entre em contato </MagneticButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}