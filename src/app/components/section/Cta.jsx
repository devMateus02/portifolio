"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "../MagneticButton";
export default function Cta() {
  const [activePixels, setActivePixels] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const quantity = Math.floor(Math.random() * 15) + 8;

      const pixels = Array.from({ length: quantity }, () =>
        Math.floor(Math.random() * 64),
      );

      setActivePixels(pixels);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className=" max-w-screen  flex flex-col justify-end bg-[#060608] overflow-hidden z-20 ">
        <div
        className="absolute inset-0 pointer-events-none w-[100vw] "
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative flex flex-col justify-center items-center w-[90vw] border border-purple-700 bg-purple-900/10 p-8 rounded-lg mx-auto mb-16 overflow-hidden pt-10">
        <span className="relative text-purple text-[.6em] text-purple-600 font-semibold uppercase tracking-widest mb-4 mt-4 z-20">
          <span
            className={`absolute top-[-10px] left-[-6px] w-2 h-2 border-l-1 border-t-1`}
          />
          <span
            className={`absolute top-[-10px] right-[-6px] w-2 h-2 border-r-1 border-t-1`}
          />
          <span
            className={`absolute bottom-[-10px] left-[-6px] w-2 h-2 border-l-1 border-b-1`}
          />
          <span
            className={`absolute bottom-[-10px] right-[-6px] w-2 h-2 border-r-1 border-b-1`}
          />
          PRONTO PARA COMEÇAR ?
        </span>

        <div className="flex flex-col justify-center items-center text-center mt-4">
          <h2 className="text-white text-3xl md:text-6xl font-extrabold leading-none tracking-tight mb-4">
            Vamos transforma{" "}
            <span className="block">
              sua ideia em{" "}
              <span className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-400 bg-clip-text text-transparent">
                realidade
              </span>{" "}
            </span>
          </h2>
          <p className="text-zinc-400 text-[1em] text-center md:w-[50ch]">
            Estou pronto para ajudar voce a criar soluções digitais modernas,
            funcionais e que geram resultados.
          </p>
        </div>

        <div className="rv inline-block my-7">
  <MagneticButton href="/contato">Entrar em contato</MagneticButton>
</div>

        <span
          className={`absolute top-[30px] left-[36px] w-4 h-4 border-l-2 border-t-2 border-purple-700`}
        />
        <span
          className={`absolute top-[30px] right-[36px] w-4 h-4 border-r-2 border-t-2 border-purple-700`}
        />
        <span
          className={`absolute bottom-[30px] left-[36px] w-4 h-4 border-l-2 border-b-2 border-purple-700`}
        />
        <span
          className={`absolute bottom-[30px] right-[36px] w-4 h-4 border-r-2 border-b-2 border-purple-700`}
        />


        <div className="absolute top-12 right-12">
  <div className="grid grid-cols-2 gap-2">
    {Array.from({ length: 10 }).map(
      (_, index) => (
        <div
          key={index}
          className={`
            w-1.5 h-1.5
            transition-all
            duration-500

            ${
              activePixels.includes(index)
                ? "bg-purple-500/25"
                : "bg-transparent"
            }
          `}
        />
      )
    )}
  </div>
</div>


<div className="absolute bottom-12 left-12">
  <div className="grid grid-cols-2 gap-2">
    {Array.from({ length: 10 }).map(
      (_, index) => (
        <div
          key={index}
          className={`
            w-1.5 h-1.5
            transition-all
            duration-500

            ${
              activePixels.includes(index)
                ? "bg-purple-500/30"
                : "bg-transparent"
            }
          `}
        />
      )
    )}
  </div>
</div>
      </div>
    </section>
  );
}
