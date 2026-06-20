import LogoMC3D from "../LogoMC3D";

export default function Sobre() {
  return (
    <section className="relative md:h-[80vh] bg-[#060608] text-white flex items-center px-6 lg:px-16 py-20 z-20  font-sans">
      <div
        className="fixed inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <h1 className="absolute top-10 right-5 text-[6em] text-purple-700/10 font-semibold">
        03
      </h1>

      <div
        className="z-10 max-w-7xl mx-auto w-full md:h-[50vh] border border-zinc-500/20 backdrop-blur-[3px] flex flex-col  items-center gap-6 text-left md:flex-row overflow-hidden sobre-conteudo"
      >
        <div className="relative flex flex-col justify-start items-start gap-2.5 mt-[0px] ">
          <span className="text-zinc-500/50 pl-[25px] mb-[5px] hidden md:block">// Sobre</span>
          <h2 className="text-5xl text-left pl-[25px] mb-[20px] pt-3 ">
            Quem sou eu?
          </h2>
          <p className="text-[1.2em] text-left pl-[25px] text-zinc-500 md:w-[60ch] ">
            Desenvolvedor Full Stack focado em criar sites, sistemas web e
            soluções digitais que ajudam empresas a crescer. Transformo ideias
            em produtos modernos, performáticos e pensados para gerar
            resultados.
          </p>

          <button className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group ml-[25px] mt-[30px] cursor-pointer">
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-purple-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="absolute bottom-0 left-0 h-full -ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-auto h-full opacity-100 object-stretch"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                ></path>
              </svg>
            </span>
            <span class="absolute top-0 right-0 w-12 h-full -mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="object-cover w-full h-full"
                viewBox="0 0 487 487"
              >
                <path
                  fill-opacity=".1"
                  fill-rule="nonzero"
                  fill="#FFF"
                  d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                ></path>
              </svg>
            </span>
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"></span>
            <span className="relative text-base font-semibold">
              Conheçer mais
            </span>
          </button>
        </div>

        <LogoMC3D />
      </div>
    </section>
  );
}
