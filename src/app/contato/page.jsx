"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ContactParticles from "../components/3d/Contactparticles";
import Navbar from "../components/Navbar";

/**
 * Página de contato — 6 steps + partículas de vento que formam shapes.
 *
 * Camadas (z-index) — A ORDEM IMPORTA:
 *   z-0     → fundo branco + grid claro
 *   z-10    → conteúdo da intro (título + botão) — ABAIXO do overlay!
 *   z-[38]  → camada preta com clip-path + grid escuro (cobre a intro)
 *   z-[39]  → ContactParticles (canvas transparente, pointer-events-none)
 *   z-[45]  → conteúdo do formulário + botão fechar
 *
 * Além do z-index, a intro é animada (fade/slide) na abertura e volta
 * no fechamento — garantia dupla de que não aparece atrás do form.
 *
 * Ao fechar, o ContactParticles detecta dark true→false e dispara a
 * explosão radial antes das partículas voltarem ao vento livre.
 */

const STEPS = [
  { id: "sobre", categoria: "SOBRE VOCÊ", titulo: "Conte-nos sobre você." },
  { id: "servicos", categoria: "SERVIÇOS", titulo: "O que você está procurando?" },
  { id: "orcamento", categoria: "ORÇAMENTO", titulo: "Qual é o seu orçamento?" },
  { id: "prazo", categoria: "LINHA DO TEMPO", titulo: "Quando você precisa disso?" },
  { id: "detalhes", categoria: "DETALHES", titulo: "Conte-nos sobre o seu projeto." },
  { id: "analise", categoria: "ANÁLISE", titulo: "Confira seus dados." },
];

const SERVICOS = ["Site", "Aplicativo", "Desenvolvimento", "Projeto", "Manutenção"];

const ORCAMENTOS = [
  "Menos de R$ 1 mil",
  "R$ 1 mil — R$ 5 mil",
  "R$ 5 mil — R$ 10 mil",
  "R$ 10 mil — R$ 25 mil",
  "R$ 25 mil — R$ 50 mil",
];

const PRAZOS = ["O mais cedo possível", "Data específica", "Sem previsão de término"];

const gridBg = (cor) => ({
  backgroundImage: `
    linear-gradient(to right, ${cor} 1px, transparent 1px),
    linear-gradient(to bottom, ${cor} 1px, transparent 1px)
  `,
  backgroundSize: "68px 68px",
});

const pad = (n) => String(n).padStart(2, "0");

export default function ContactPage() {
  const [fase, setFase] = useState("intro"); // intro | abrindo | form | fechando
  const [step, setStep] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    empresa: "",
    servicos: [],
    orcamento: "",
    prazo: "",
    descricao: "",
  });

  const botaoRef = useRef(null);
  const introRef = useRef(null);
  const overlayRef = useRef(null);
  const conteudoRef = useRef(null);
  const panelRef = useRef(null);
  const animating = useRef(false);

  // ── Estado das partículas derivado da fase do form ──
  const isDark = fase === "abrindo" || fase === "form";
  const particleStep = !isDark ? -1 : enviado ? 6 : step;

  const update = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const toggleServico = (s) =>
    setForm((f) => ({
      ...f,
      servicos: f.servicos.includes(s)
        ? f.servicos.filter((x) => x !== s)
        : [...f.servicos, s],
    }));

  const stepValido = () => {
    if (step === 0)
      return (
        form.nome.trim().length >= 2 &&
        form.telefone.replace(/\D/g, "").length >= 10 &&
        /^\S+@\S+\.\S+$/.test(form.email)
      );
    if (step === 1) return form.servicos.length > 0;
    if (step === 2) return form.orcamento !== "";
    if (step === 3) return form.prazo !== "";
    if (step === 4) return form.descricao.trim().length >= 10;
    return true;
  };

  // ── Abrir: preto expande a partir do botão Iniciar ──
  const iniciar = () => {
    if (fase !== "intro") return;
    setFase("abrindo"); // as partículas já começam a virar roxas junto

    const btn = botaoRef.current.getBoundingClientRect();
    const cx = btn.left + btn.width / 2;
    const cy = btn.top + btn.height / 2;
    const raio = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const tl = gsap.timeline({ onComplete: () => setFase("form") });
    tl.set(overlayRef.current, {
      clipPath: `circle(0px at ${cx}px ${cy}px)`,
      autoAlpha: 1,
    });
    // a intro some junto com a expansão (autoAlpha 0 = invisível + sem clique)
    tl.to(
      introRef.current,
      { autoAlpha: 0, y: -24, scale: 0.97, duration: 0.4, ease: "power2.in" },
      0
    );
    tl.to(
      overlayRef.current,
      {
        clipPath: `circle(${raio}px at ${cx}px ${cy}px)`,
        duration: 0.9,
        ease: "power4.inOut",
      },
      0
    );
    tl.fromTo(
      conteudoRef.current,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
      "-=0.2"
    );
  };

  // ── Fechar: reverte pro estado inicial (tela branca) ──
  const fechar = () => {
    if (fase !== "form") return;
    setFase("fechando"); // dark → false: dispara a EXPLOSÃO no ContactParticles

    const btn = botaoRef.current.getBoundingClientRect();
    const cx = btn.left + btn.width / 2;
    const cy = btn.top + btn.height / 2;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        setFase("intro");
      },
    });
    tl.to(conteudoRef.current, {
      autoAlpha: 0,
      y: 20,
      duration: 0.25,
      ease: "power2.in",
    });
    tl.to(overlayRef.current, {
      clipPath: `circle(0px at ${cx}px ${cy}px)`,
      duration: 0.7,
      ease: "power4.inOut",
    });
    // a intro volta enquanto o círculo colapsa
    tl.fromTo(
      introRef.current,
      { autoAlpha: 0, y: 24, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      "-=0.35"
    );
  };

  // ── Steps: sai pra esquerda, entra pela direita ──
  const goTo = (next) => {
    if (animating.current || next === step) return;
    animating.current = true;

    const el = panelRef.current;
    const voltando = next < step;
    const saiX = voltando ? 60 : -60;
    const entraX = voltando ? -60 : 60;

    gsap.to(el, {
      x: saiX,
      autoAlpha: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setStep(next); // o morph das partículas dispara junto (useEffect no componente)
        gsap.fromTo(
          el,
          { x: entraX, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.4,
            ease: "power3.out",
            onComplete: () => (animating.current = false),
          }
        );
      },
    });
  };

  const avancar = () => {
    if (!stepValido()) return;
    if (step < STEPS.length - 1) goTo(step + 1);
    else enviar();
  };

  const voltar = () => step > 0 && goTo(step - 1);

  const enviar = () => {
    // TODO: integrar com sua API / e-mail
    console.log("Formulário de contato:", form);
    setEnviado(true); // partículas → assinatura MC
  };

  useEffect(() => {
    if (fase !== "form") return;
    panelRef.current?.querySelector("input, textarea")?.focus();
  }, [step, fase]);

  // Inputs estilo "linha" (border-bottom), como na referência
  const lineInput =
    "w-full bg-transparent border-0 border-b border-white/25 px-0 py-3 " +
    "text-white placeholder-white/35 outline-none transition " +
    "focus:border-white";

  // Opção de lista (serviços / orçamento / prazo)
  const OptionRow = ({ texto, indice, ativo, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-md px-5 py-4
                  text-left transition border
                  ${
                    ativo
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.05] text-white border-transparent hover:bg-white/10"
                  }`}
    >
      <span>{texto}</span>
      <span className={ativo ? "text-black/50" : "text-white/30"}>{indice}</span>
    </button>
  );

  // Bloco de revisão (step 06 — Análise)
  const Revisao = ({ label, children, irPara }) => (
    <div className="border-b border-white/15 pb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </span>
        <button
          type="button"
          onClick={() => goTo(irPara)}
          className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition"
        >
          Editar
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <Navbar />

      {/* ── FASE BRANCA (z-0 fundo, z-10 conteúdo) ── */}
      <div
        className="absolute inset-0"
        style={gridBg("rgba(0, 0, 0, 0.06)")}
        aria-hidden="true"
      />
      {/* intro em z-10: ABAIXO do overlay preto (z-38). Nunca usar z maior
          que o overlay aqui, senão o botão/frases vazam por cima do form */}
      <div
        ref={introRef}
        className="relative z-40 min-h-screen flex flex-col items-center justify-center px-4 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-semibold text-black max-w-2xl leading-tight">
          Está preparado para fazer um projeto comigo?
        </h1>
        <p className="mt-6 text-lg font-light text-black/70 max-w-xl">
          Compartilhe o que você está desenvolvendo e nós ajudaremos a moldar o
          caminho da ideia ao lançamento.
        </p>
        <button
          ref={botaoRef}
          type="button"
          onClick={iniciar}
          className="mt-10 rounded-[15px]  bg-black text-white text-lg font-medium
                     px-12 py-3 transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          Comece aqui
        </button>
      </div>

      {/* ── CAMADA PRETA — só o fundo com clip-path ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[38] bg-black opacity-0"
        style={{ visibility: "hidden" }}
      >
        <div
          className="absolute inset-0"
          style={gridBg("rgba(255, 255, 255, 0.07)")}
          aria-hidden="true"
        />
      </div>

      {/* ── PARTÍCULAS: acima dos fundos, abaixo do form ── */}
      <ContactParticles stepIndex={particleStep} dark={isDark} className="z-[39]" />

      {/* ── CONTEÚDO DO FORMULÁRIO ── */}
      <div
        ref={conteudoRef}
        className="fixed inset-0 z-[45] flex items-center justify-center px-2 opacity-0 pointer-events-none"
        style={{ visibility: fase === "intro" ? "hidden" : "visible" }}
      >
        {/* Fechar → volta pro estado inicial */}
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar formulário"
          className="absolute top-6 right-6 md:top-[4.5rem] md:right-96 h-11 w-11
                     rounded-[10px] bg-white/[0.06] text-white/70 text-xl
                     hover:bg-white/15 hover:text-white transition cursor-pointer
                     pointer-events-auto"
        >
          ✕
        </button>

        <div className="max-w-xl w-[450px] mt-3 backdrop-blur-[1px] bg-black/70 p-3 rounded-[5px] pointer-events-auto">
          {enviado ? (
            <div className="text-center py-10">
              <h2 className="text-3xl font-semibold text-white">
                Mensagem enviada ✓
              </h2>
              <p className="mt-3 text-white/60">
                Obrigado, {form.nome.split(" ")[0]}. Entro em contato pelo
                e-mail {form.email}.
              </p>
            </div>
          ) : (
            <>
              {/* Cabeçalho: categoria + contador */}
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40 mb-3">
                <span>{STEPS[step].categoria}</span>
                <span>
                  {pad(step + 1)}/{pad(STEPS.length)}
                </span>
              </div>

              {/* Painel animado */}
              <div ref={panelRef}>
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                  {STEPS[step].titulo}
                </h2>

                {/* 01 — Sobre você */}
                {step === 0 && (
                  <div className="space-y-6">
                    <input
                      className={lineInput}
                      placeholder="Seu nome"
                      value={form.nome}
                      onChange={update("nome")}
                    />
                    <input
                      type="tel"
                      className={lineInput}
                      placeholder="Número para contato (com DDD)"
                      value={form.telefone}
                      onChange={update("telefone")}
                    />
                    <input
                      type="email"
                      className={lineInput}
                      placeholder="Seu e-mail"
                      value={form.email}
                      onChange={update("email")}
                    />
                    <input
                      className={lineInput}
                      placeholder="Empresa (opcional)"
                      value={form.empresa}
                      onChange={update("empresa")}
                    />
                  </div>
                )}

                {/* 02 — Serviços (multi-seleção) */}
                {step === 1 && (
                  <div className="space-y-3">
                    {SERVICOS.map((s, i) => (
                      <OptionRow
                        key={s}
                        texto={s}
                        indice={i + 1}
                        ativo={form.servicos.includes(s)}
                        onClick={() => toggleServico(s)}
                      />
                    ))}
                  </div>
                )}

                {/* 03 — Orçamento (R$) */}
                {step === 2 && (
                  <div className="space-y-3">
                    {ORCAMENTOS.map((o, i) => (
                      <OptionRow
                        key={o}
                        texto={o}
                        indice={i + 1}
                        ativo={form.orcamento === o}
                        onClick={() => setForm((f) => ({ ...f, orcamento: o }))}
                      />
                    ))}
                  </div>
                )}

                {/* 04 — Linha do tempo */}
                {step === 3 && (
                  <div className="space-y-3">
                    {PRAZOS.map((p, i) => (
                      <OptionRow
                        key={p}
                        texto={p}
                        indice={i + 1}
                        ativo={form.prazo === p}
                        onClick={() => setForm((f) => ({ ...f, prazo: p }))}
                      />
                    ))}
                  </div>
                )}

                {/* 05 — Detalhes */}
                {step === 4 && (
                  <textarea
                    rows={4}
                    className={`${lineInput} resize-none`}
                    placeholder="Descreva seu projeto"
                    value={form.descricao}
                    onChange={update("descricao")}
                  />
                )}

                {/* 06 — Análise / revisão */}
                {step === 5 && (
                  <div className="space-y-5">
                    <Revisao label="Sobre você" irPara={0}>
                      <p className="text-xl text-white font-semibold">
                        {form.nome}
                      </p>
                      <p className="text-white/70">{form.email}</p>
                      <p className="text-white/70">{form.telefone}</p>
                      {form.empresa && (
                        <p className="text-white/70">{form.empresa}</p>
                      )}
                    </Revisao>

                    <Revisao label="Serviços solicitados" irPara={1}>
                      <p className="text-white/90">
                        {form.servicos.join(", ")}
                      </p>
                    </Revisao>

                    <div className="grid grid-cols-2 gap-6">
                      <Revisao label="Orçamento" irPara={2}>
                        <p className="text-white/90">{form.orcamento}</p>
                      </Revisao>
                      <Revisao label="Linha do tempo" irPara={3}>
                        <p className="text-white/90">{form.prazo}</p>
                      </Revisao>
                    </div>

                    <Revisao label="Detalhes" irPara={4}>
                      <p className="text-white/90 whitespace-pre-wrap">
                        {form.descricao}
                      </p>
                    </Revisao>
                  </div>
                )}
              </div>

              {/* Navegação */}
              <div className="mt-10 flex items-stretch gap-3">
                <button
                  type="button"
                  onClick={voltar}
                  disabled={step === 0}
                  aria-label="Voltar"
                  className="h-14 w-16 rounded-md bg-white/[0.06] text-white text-xl
                             hover:bg-white/15 transition
                             disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={avancar}
                  disabled={!stepValido()}
                  className="h-14 flex-1 rounded-md bg-white text-black font-medium
                             transition hover:bg-white/85
                             disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {step === STEPS.length - 1 ? "Enviar mensagem" : "Continuar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}