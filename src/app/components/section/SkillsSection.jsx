"use client";

import { useState, useEffect, useRef } from "react";

const skills = [
  {
    name: "React",
    icon: "/icons8-react-100.png",
    tag: "UI",
    color: "#014991",
    iconSize: 50,
    level: 92,
    description:
      "Biblioteca JavaScript para construção de interfaces modernas, componentizadas e performáticas.",
    exp: "3+ anos",
    projects: "15+",
    focus: "Hooks, Context API",
  },
  {
    name: "Next.js",
    icon: "/icons8-nextjs-100.png",
    tag: "Full",
    iconSize: 50,
    color: "#4d4d4d",
    level: 85,
    description:
      "Framework React focado em performance, SEO e renderização híbrida com SSR e SSG.",
    exp: "2+ anos",
    projects: "10+",
    focus: "App Router, SSR",
  },
  {
    name: "TypeScript",
    icon: "/icons8-typescript-100.png",
    tag: "Lang",
    iconSize: 50,
    color: "#005380",
    level: 80,

    description:
      "Superset do JavaScript que adiciona tipagem estática e melhora a manutenibilidade.",
    exp: "2+ anos",
    projects: "12+",
    focus: "Tipos, Generics",
  },
  {
    name: "Node.js",
    icon: "/icons8-node-js-100.png",
    tag: "Back",
    iconSize: 50,
    color: "#446948",
    level: 78,
    iconSize: 50,
    description:
      "Ambiente JavaScript para desenvolvimento backend robusto e escalável.",
    exp: "2+ anos",
    projects: "8+",
    focus: "APIs REST",
  },
  {
    name: "MySQL",
    icon: "/icons8-mysql-100.png",
    tag: "DB",
    color: "#ffffff",
    iconSize: 50,
    level: 70,
    description:
      "Banco de dados relacional utilizado em aplicações escaláveis com queries otimizadas.",
    exp: "2+ anos",
    projects: "7+",
    focus: "Queries, Joins",
  },
  {
    name: "MongoDB",
    icon: "/icons8-mongodb-100.png",
    tag: "DB",
    iconSize: 50,
    color: "#446948",
    level: 72,
    description:
      "Banco de dados NoSQL orientado a documentos, ideal para dados flexíveis.",
    exp: "1+ ano",
    projects: "5+",
    focus: "Atlas, Mongoose",
  },
];

export default function SkillsSection() {
  const [selected, setSelected] = useState(skills[0]);
  const [displayed, setDisplayed] = useState("");
  const [barWidth, setBarWidth] = useState(0);
  const [tick, setTick] = useState(true);
  const typingRef = useRef(null);

  const terminalRef = useRef(null);

  const current = useRef({
    x: -4,
    y: -25,
  });

  const target = useRef({
    x: -4,
    y: -25,
  });

  const dragging = useRef(false);

  useEffect(() => {
    let frame;

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;

      current.current.y += (target.current.y - current.current.y) * 0.08;

      if (terminalRef.current) {
        terminalRef.current.style.transform = `
        perspective(1200px)
        rotateX(${current.current.x}deg)
        rotateY(${current.current.y}deg)
      `;
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, []);

  const start = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    dragging.current = true;

    start.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;

      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;

      target.current = {
        x: 4 - dy * 0.05,
        y: -25 + dx * 0.05,
      };
    };

    const up = () => {
      dragging.current = false;

      target.current = {
        x: 4,
        y: -25,
      };
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  useEffect(() => {
    setDisplayed("");
    setBarWidth(0);
    let i = 0;
    clearInterval(typingRef.current);
    typingRef.current = setInterval(() => {
      i++;
      setDisplayed(selected.description.slice(0, i));
      if (i >= selected.description.length) clearInterval(typingRef.current);
    }, 18);
    const t = setTimeout(() => setBarWidth(selected.level), 80);
    return () => {
      clearInterval(typingRef.current);
      clearTimeout(t);
    };
  }, [selected]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => !t), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen z-20 bg-[#060608] text-white flex items-center px-6 lg:px-16 py-20 overflow-hidden font-sans">
      <h1 className="absolute top-10 left-5 text-[6em] text-purple-700/10 font-semibold">
        02
      </h1>

      <div
        className="fixed inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">
        {/* ── LEFT ── */}
        <div>
          {/* Heading */}
          <h2 className="text-6xl font-black leading-none uppercase tracking-tight">
            MINHAS
            <span className="text-transparent block bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent  ">
              SKILLS
            </span>
          </h2>

          <p className="mt-7 text-zinc-500 font-mono text-sm leading-relaxed max-w-sm">
            Ferramentas que uso para transformar ideias em soluções digitais de
            alto impacto.
          </p>

          {/* Keyboard */}
          <div className="mt-14" style={{ perspective: "1000px" }}>
            <div className="grid grid-cols-3 gap-3 w-fit">
              {skills.map((skill) => {
                const isActive = selected.name === skill.name;
                return (
                  <button
                    key={skill.name}
                    onClick={() => setSelected(skill)}
                    className=" flex items-center justify-center cursor-pointer
    w-20 h-20
    rounded-2xl
   border-white/10 border
    transition-all
    duration-300
    
  "
                    style={{
                      backgroundColor: isActive ? skill.color : "transparent",
                    }}
                  >
                    <img
                      style={{
                        width: `${skill.iconSize}px`,
                      }}
                      src={skill.icon}
                      alt={skill.name}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Terminal ── */}
        <div className="flex items-center justify-center">
          <div
            ref={terminalRef}
            onMouseDown={handleMouseDown}
            className="cursor-grab active:cursor-grabbing
             w-full max-w-[560px]
             rounded-[20px]
             border border-zinc-500/20
             bg-[#0b0b0d]
             overflow-hidden"
            style={{
              transform: "perspective(1200px) rotateY(-25deg) rotateX(4deg)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Chrome */}
            <div className="flex items-center justify-between bg-[#141416] border-b border-zinc-900 px-5 py-3.5">
              <div className="flex gap-2">
                {["bg-purple-500", "bg-purple-400", "bg-purple-300"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${c} opacity-90`}
                    />
                  ),
                )}
              </div>
              <span className="font-mono text-[10px] text-zinc-300 tracking-widest">
                skills.config.js
              </span>
              <span className="font-mono text-[10px] text-purple-500/50">
                ● LIVE
              </span>
            </div>

            {/* Body */}
            <div className="p-8 font-mono bg-[#141416]">
              {/* Prompt */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="text-zinc-400 text-xs">~/portfolio</span>
                <span className="text-zinc-600 text-xs">$</span>
                <span className="text-zinc-200 text-xs">
                  inspect{" "}
                  <span className="text-zinc-400">
                    {selected.name.toLowerCase()}
                  </span>
                </span>
              </div>

              {/* Skill header */}
              <div className="flex items-center gap-5 pb-6 mb-6 border-b border-zinc-800">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ">
                  <img
                    style={{
                      width: `${selected.iconSize}px`,
                    }}
                    src={selected.icon}
                    alt={selected.name}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-600 tracking-[0.2em] mb-1">
                    SKILL CARREGADA
                  </p>
                  <p
                    className="text-2xl font-black tracking-tight"
                    style={{ fontFamily: "inherit" }}
                  >
                    {selected.name}
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-1">
                    ✓ loaded successfully
                  </p>
                </div>
              </div>

              {/* Description typewriter */}
              <div className="mb-7 min-h-[52px]">
                <p className="text-zinc-400 text-[13px] leading-[1.8]">
                  {displayed}
                  <span
                    className={`text-zinc-500 ${tick ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
                  >
                    █
                  </span>
                </p>
              </div>

              {/* Level bar */}
              <div className="mb-7">
                <div className="flex justify-between mb-2">
                  <span className="text-[9px] text-zinc-600 tracking-[0.15em]">
                    PROFICIÊNCIA
                  </span>
                  <span className="text-[10px] text-purple-500/50">
                    {selected.level}%
                  </span>
                </div>
                <div className="h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-[800ms] ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { label: "Experiência", value: selected.exp },
                  { label: "Projetos", value: selected.projects },
                  { label: "Foco", value: selected.focus },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#141416] border border-zinc-900 rounded-xl px-3.5 py-3"
                  >
                    <p className="text-[9px] text-zinc-700 tracking-[0.15em] mb-1.5">
                      {stat.label.toUpperCase()}
                    </p>
                    <p className="text-xs font-bold text-zinc-200">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cursor */}
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-xs">$</span>
                <div
                  className={`w-2 h-4 bg-zinc-500  transition-opacity duration-100 ${tick ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
