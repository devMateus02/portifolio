"use client";

import { useEffect, useState } from "react";
import { getFeaturedProjects } from "@/services/projects";
import Link from "next/link";

export default function PrincipaisTrabalhos() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProjects() {
      const data = await getFeaturedProjects();

      setProjects(data);
    }

    loadProjects();
  }, []);

  return (
    <section className="relative py-4 bg-[#060608] z-20">
      <h1 className="absolute top-19 left-5 text-[6em] text-purple-700/10 font-semibold">
        04
      </h1>
            <div
        className="absolute inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <h2 className=" text-4xl md:text-4xl font-medium flex flex-col items-start justify-start text-white md:w-[22ch] mb-12 mt-3">
          <span className="text-purple-500  mb-[5px] text-[.4em] hidden md:block pb-3 decoration-bullet">
            {" "}
            • Principais Trabalhos
          </span>
          Projetos que unem{" "}
          <span className="block">
            {" "}
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-transparent bg-clip-text">
              designer e codigo
            </span>{" "}
            e resultado
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/projetos/${project.slug}`}
              className="w-[330px]"
            >
              <div
                key={project._id}
                className="transition-all duration-300 rounded-3xl overflow-hidden w-[280px] md:w-[330px] flex flex-col items-center justify-center backdrop-blur-[5px] border border-zinc-900 bg-white/1 hover:translate-y-[-10px] hover:shadow-[0_0_20px_rgba(168,85,247,0.2),0_0_40px_rgba(59,130,246,0.15),0_0_60px_rgba(236,72,153,0.1)] relative "
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-[330px]  object-contain rounded-[25px] px-2 py-2"
                />

                <div className="px-4 pt-3">
                  <h3 className="text-2xl text-white font-medium">
                    {project.title}
                  </h3>

                  <p className="text-zinc-400 mt-2">{project.subtitle}</p>

                  <div className="flex flex-wrap  py-3 mb-6">
                    {project.stack?.map((tech) => (
                      <span
                        key={tech}
                        className="transition-all duration-500 bg-zinc-700/20 text-zinc-300 border border-zinc-500/50 text-sm px-3 py-1 rounded-full my-[2px] mx-[2px]  hover:scale-[1.1]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
