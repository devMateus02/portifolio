import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex   text-center text-sm bg-[#060608] text-zinc-500 z-20">
        <div
        className="fixed inset-0 pointer-events-none w-[100vw]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
        <div className="flex flex-col justify-center items-center border-purple-800 border-t border-l border-r rounded-t-[100px]  w-[95vw] mx-auto py-8 ">
             <div className="max-w-6xl mx-auto flex flex-row flex-wrap justify-evenly items-center  ">
        <div className="flex-col gap-4 text-justify w-[20%] items-start mr-16">
          {" "}
          <svg
            width="80"
            height="80"
            viewBox="0 0 520 286"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M273.2 7.79998V283.8H245.2V63.4L146.8 283.8H126.4L28 64.2V283.8H0V7.79998H29.6L136.4 247L243.2 7.79998H273.2Z"
              fill="white"
            />
            <path
              d="M247.262 142.8C247.262 115.333 253.263 90.8 265.263 69.2C277.263 47.3333 293.663 30.4 314.462 18.4C335.262 6.13333 358.462 0 384.062 0C415.263 0 441.929 7.46667 464.062 22.4C486.462 37.0667 502.729 57.8667 512.862 84.8H480.063C472.063 65.8667 459.796 51.0667 443.263 40.4C426.996 29.7333 407.263 24.4 384.062 24.4C363.529 24.4 344.996 29.2 328.462 38.8C312.196 48.4 299.396 62.2667 290.062 80.4C280.729 98.2667 276.062 119.067 276.062 142.8C276.062 166.533 280.729 187.333 290.062 205.2C299.396 223.067 312.196 236.8 328.462 246.4C344.996 256 363.529 260.8 384.062 260.8C407.263 260.8 426.996 255.6 443.263 245.2C459.796 234.533 472.063 219.867 480.063 201.2H512.862C502.729 227.867 486.462 248.533 464.062 263.2C441.663 277.867 414.996 285.2 384.062 285.2C358.462 285.2 335.262 279.2 314.462 267.2C293.663 254.933 277.263 238 265.263 216.4C253.263 194.8 247.262 170.267 247.262 142.8Z"
              fill="white"
            />
            <path
              d="M479.359 110.8C479.359 99.7543 488.314 90.8 499.359 90.8C510.405 90.8 519.359 99.7543 519.359 110.8C519.359 121.846 510.405 130.8 499.359 130.8C488.314 130.8 479.359 121.846 479.359 110.8Z"
              fill="#C90A89"
            />
          </svg>
          <p className="w-[100%] text-zinc-400">
            Desenvolvedor fullstack criando soluções digitais modernas e
            experiências excepcionais
          </p>
          <div class="flex flex-row gap-3 mt-2">
            <button class="p-5 rounded-full backdrop-blur-lg border  border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-black/40 group relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <div class="relative z-10">
                <img src="icon-instagram.png" className="w-8 h-8"></img>
              </div>
            </button>

            <button class="p-5 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 hover:to-black/40 group relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

              <div class="relative z-10">
                <img
                  src="icon-whatsapp.png"
                  alt="WhatsApp"
                  class="w-7 h-7 fill-current text-green-500 group-hover:text-green-400 transition-colors duration-300"
                ></img>
              </div>
            </button>
          </div>
        </div>

       <div className="flex flex-row items-start justify-around gap-36">
         <div>
          <h3 className="text-purple-500 font-semibold mb-3 text-left">Navegação rapida</h3>
          <ul className="text-left">
            <li>
              <Link
                className="
      block
      transition-transform
      duration-700
      hover:text-purple-700
    "
                href="/"
              >
                Home
              </Link>
            </li>

        <li>
              <Link
                className="
      block
      transition-transform
      duration-700
     hover:text-purple-700
    "
                href="/sobre"
              >
                Sobre
              </Link>
            </li>

            <li>
              <Link
                className="
      block
      transition-transform
      duration-700
      hover:text-purple-700
    "
                href="/projetos"
              >
                Projetos
              </Link>
            </li>

            <li>
              <Link
                className="
      block
      transition-transform
      duration-700
      hover:text-purple-700
    "
                href="/servicos"
              >
                Serviços
              </Link>
            </li>

            <li>
              <Link
                className="
      block
      transition-transform
      duration-700
      hover:text-purple-700
    "
                href="/contato"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>

       
        <div>
          <h3 className="text-purple-500 font-semibold mb-3 text-left">Serviços</h3>
          <ul className="text-left">
            <li>Sistema web</li>

            <li>Sites profissionais</li>

            <li>Landings pages</li>

            <li>Integrações</li>

            <li>Manutenção</li>
          </ul>
        </div>
        
         <div>
          <h3 className="text-purple-500 font-semibold mb-3 text-left">Contatos</h3>
          <ul className="flex flex-col gap-2 text-left">
            <li>devmateusfullstack@gmail.com</li>

            <li>+55 (21) 998750-1858</li>

            <li>Mesquita, RJ</li>

          
          </ul>
        </div>
       </div>
      </div>

      <div className="border-t-1 border-purple-800 w-[75vw] mt-2.5 pt-3">
        <p>© MC Dev, Todos os direitos reservados</p>
      </div>  
        </div>
   
    </footer>
  );
}
