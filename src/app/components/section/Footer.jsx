import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Projetos", href: "/projetos" },
  { label: "Serviços", href: "/servicos" },
  { label: "Contato", href: "/contato" },
];

const SERVICOS = [
  {
    label: "Sistema web",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.95 8.95 0 0 0 4.5-1.207M12 21a8.95 8.95 0 0 1-4.5-1.207M3 12h18M12 3a13.36 13.36 0 0 1 0 18M12 3a13.36 13.36 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    label: "Sites profissionais",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
  },
  {
    label: "Landings pages",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
  {
    label: "Integrações",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: "Manutenção",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.751-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.241.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

const CONTATOS = [
  {
    label: "devmateusfullstack@gmail.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "+55 (21) 99875-0-1858",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
  },
  {
    label: "Mesquita, RJ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="w-full text-sm bg-[#060608] text-zinc-400 z-20">
      <div className="flex flex-col items-center border-purple-800/60 border-t border-l border-r rounded-t-[60px] md:rounded-t-[100px] w-[95vw] mx-auto px-6 py-12 md:py-16">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Coluna logo */}
          <div className="flex flex-col gap-4 items-start">
            <svg width="72" height="72" viewBox="0 0 520 286" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M273.2 7.79998V283.8H245.2V63.4L146.8 283.8H126.4L28 64.2V283.8H0V7.79998H29.6L136.4 247L243.2 7.79998H273.2Z" fill="white" />
              <path d="M247.262 142.8C247.262 115.333 253.263 90.8 265.263 69.2C277.263 47.3333 293.663 30.4 314.462 18.4C335.262 6.13333 358.462 0 384.062 0C415.263 0 441.929 7.46667 464.062 22.4C486.462 37.0667 502.729 57.8667 512.862 84.8H480.063C472.063 65.8667 459.796 51.0667 443.263 40.4C426.996 29.7333 407.263 24.4 384.062 24.4C363.529 24.4 344.996 29.2 328.462 38.8C312.196 48.4 299.396 62.2667 290.062 80.4C280.729 98.2667 276.062 119.067 276.062 142.8C276.062 166.533 280.729 187.333 290.062 205.2C299.396 223.067 312.196 236.8 328.462 246.4C344.996 256 363.529 260.8 384.062 260.8C407.263 260.8 426.996 255.6 443.263 245.2C459.796 234.533 472.063 219.867 480.063 201.2H512.862C502.729 227.867 486.462 248.533 464.062 263.2C441.663 277.867 414.996 285.2 384.062 285.2C358.462 285.2 335.262 279.2 314.462 267.2C293.663 254.933 277.263 238 265.263 216.4C253.263 194.8 247.262 170.267 247.262 142.8Z" fill="white" />
              <path d="M479.359 110.8C479.359 99.7543 488.314 90.8 499.359 90.8C510.405 90.8 519.359 99.7543 519.359 110.8C519.359 121.846 510.405 130.8 499.359 130.8C488.314 130.8 479.359 121.846 479.359 110.8Z" fill="#C90A89" />
            </svg>
            <p className="text-zinc-400 max-w-xs leading-relaxed">
              Desenvolvedor fullstack criando soluções digitais modernas e experiências excepcionais.
            </p>
            <div className="flex flex-row gap-3 mt-2">
              <button className="p-4 rounded-full backdrop-blur-lg border border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <img src="icon-instagram.png" alt="Instagram" className="w-7 h-7" />
                </div>
              </button>
              <button className="p-4 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="relative z-10">
                  <img src="icon-whatsapp.png" alt="WhatsApp" className="w-7 h-7" />
                </div>
              </button>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-purple-500 font-semibold mb-5 text-left tracking-[0.15em] text-xs uppercase">
              Navegação rápida
            </h3>
            <ul className="flex flex-col gap-3 text-left">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-3 hover:text-purple-400 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-purple-500 font-semibold mb-5 text-left tracking-[0.15em] text-xs uppercase">
              Serviços
            </h3>
            <ul className="flex flex-col gap-3 text-left">
              {SERVICOS.map((s) => (
                <li key={s.label} className="flex items-center gap-3 text-zinc-400">
                  <span className="text-purple-400 shrink-0">{s.icon}</span>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contatos */}
          <div>
            <h3 className="text-purple-500 font-semibold mb-5 text-left tracking-[0.15em] text-xs uppercase">
              Contatos
            </h3>
            <ul className="flex flex-col gap-3 text-left">
              {CONTATOS.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-zinc-400 break-all">
                  <span className="text-purple-400 shrink-0">{c.icon}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* divisor com glow central */}
        <div className="relative w-full max-w-5xl mt-12 mb-6">
          <div className="h-px w-full bg-purple-800/40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-px bg-purple-400 blur-[2px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-[3px] bg-purple-500 blur-md" />
        </div>

        {/* copyright */}
        <div className="flex items-center gap-2 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-purple-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
          <p className="text-center">© MC Dev, Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}