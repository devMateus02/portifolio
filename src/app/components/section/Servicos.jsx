"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Cta from "./Cta";
import Footer from "./Footer";

function PixelIcon({ color, hovered }) {
  const [activePixels, setActivePixels] = useState([]);

  useEffect(() => {
    if (!hovered) {
      setActivePixels([]);
      return;
    }

    const interval = setInterval(() => {
      const quantity = Math.floor(Math.random() * 5) + 3;

      const pixels = Array.from({ length: quantity }, () =>
        Math.floor(Math.random() * 9),
      );

      setActivePixels(pixels);
    }, 250);

    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <div className="grid grid-cols-3 gap-1 w-fit">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className={`
            w-2.5 h-2.5 rounded-[2px]
            transition-all duration-300
            ${activePixels.includes(index) ? color : "bg-white/20 opacity-20"}
          `}
        />
      ))}
    </div>
  );
}

export default function Servicos() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const buttonRef = useRef(null);

  function handleMouseMove(e) {
    const element = buttonRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;

    const y = e.clientY - rect.top - rect.height / 1;

    const moveX = Math.max(-8, Math.min(8, x * 0.08));

    const moveY = Math.max(-15, Math.min(10, y * 0.20));

    element.style.transform = `
      translate(${moveX}px, ${moveY}px)
    `;
  }

  function handleMouseLeave() {
    if (!buttonRef.current) return;

    buttonRef.current.style.transform = "translate(0px,0px)";
  }

  const services = [
    {
      title: "Sistemas Web",
      description:
        "Desenvolvimento de sistemas personalizados para automatizar processos e otimizar a gestão do seu negócio.",
      color: "bg-purple-500",
      border: "hover:border-purple-500",
      span: "border-purple-500",
    },
    {
      title: "Sites Profissionais",
      description:
        "Sites modernos, rápidos e responsivos para fortalecer sua presença digital.",
      color: "bg-blue-500",
      border: "hover:border-blue-500",
      span: "border-blue-500",
    },
    {
      title: "Landing Pages",
      description:
        "Páginas focadas em conversão para captação de clientes e vendas.",
      color: "bg-yellow-500",
      border: "hover:border-yellow-500",
      span: "border-yellow-500",
    },
  ];

  return (
    <section className="relative pt-32 bg-[#060608] z-20">
      <div className="max-w-7xl mx-auto px-6 mb-15">
        <span className="absolute top-10 left-6 text-[6rem] font-bold text-purple-700/10">
          05
        </span>
           <div
        className="absolute inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

        <h2 className="text-4xl  md:text-5xl font-medium text-white">Como eu ajudo</h2>

        <p className="text-zinc-400 max-w-2xl mt-4">
          Soluções digitais criadas para transformar ideias em produtos,
          sistemas e experiências modernas.
        </p>

        <div className="flex justify-center gap-6 mt-16 flex-wrap">
          {services.map((service, index) => (
            <div
              key={service.title}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                group
                relative
                border border-zinc-800
                bg-white/[0.02]
                p-5
                w-[380px]
                h-[260px]
                transition-all
                duration-300
                hover:-translate-y-2
                ${service.border}
              `}
            >
              <span
                className={`hidden group-hover:block absolute top-[-6px] left-[-6px] w-3 h-3 border-l-2 border-t-2 ${service.span}`}
              />

              <span
                className={`hidden group-hover:block absolute top-[-6px] right-[-6px] w-3 h-3 border-r-2 border-t-2 ${service.span}`}
              />

              <span
                className={`hidden group-hover:block absolute bottom-[-6px] left-[-6px] w-3 h-3 border-l-2 border-b-2 ${service.span}`}
              />

              <span
                className={`hidden group-hover:block absolute bottom-[-6px] right-[-6px] w-3 h-3 border-r-2 border-b-2 ${service.span}`}
              />

              <PixelIcon
                color={service.color}
                hovered={hoveredCard === index}
              />

              <h3 className="text-[20px] font-semibold text-white mt-8">
                {service.title}
              </h3>

              <p className="text-zinc-400 mt-6 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center mt-20 "
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={buttonRef}
            className="
              transition-all
              duration-500
              ease-out
              group
            "
          >
            <span
              className={`hidden group-hover:block absolute top-[-22px] left-[-6px] w-3 h-3 border-l-2 border-t-2`}
            />

            <span
              className={`hidden group-hover:block absolute top-[-22px] right-[-6px] w-3 h-3 border-r-2 border-t-2`}
            />

            <span
              className={`hidden group-hover:block absolute bottom-[-22px] left-[-6px] w-3 h-3 border-l-2 border-b-2`}
            />

            <span
              className={`hidden group-hover:block absolute bottom-[-22px] right-[-6px] w-3 h-3 border-r-2 border-b-2`}
            />

    <Link
  href="/Servicos"
  className="
    group
    relative
    overflow-hidden

    px-8 py-4
    border border-zinc-700
    text-white
  "
>
  <span
    className="
      absolute
      left-0
      top-0
      h-full
      w-0

      bg-purple-500/10

      transition-all
      duration-500
      ease-out

      group-hover:w-full
    "
  />

  <span className="relative z-10">
    Vamos conversar
  </span>
</Link>
          </div>
        </div>
      </div>
<Cta/>
<Footer/>
    </section>
  );
}
