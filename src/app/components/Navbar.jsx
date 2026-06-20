"use client";

import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="fixed  perspective-[1000px] top-5 w-[80vw] left-[10%] flex justify-between items-center z-[10000] px-[40px] backdrop-blur-[5px] transition-all duration-500 ease-out ">
      {/* Logo */}
      <svg
        width="40"
        height="80"
        viewBox="0 0 520 286"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SVG */}
      </svg>

      {/* Menu */}
      <ul className="flex gap-8 text-sm font-medium text-white/50 uppercase">
        <li>
          <Link
            className="
      block
      transition-transform
      duration-700
     hover:rotate-x-[360deg] hover:text-white
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
    hover:rotate-x-[360deg] hover:text-white
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
     hover:rotate-x-[360deg] hover:text-white
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
     hover:rotate-x-[360deg] hover:text-white
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
     hover:rotate-x-[360deg] hover:text-white
    "
            href="/contato"
          >
            Contato
          </Link>
        </li>
      </ul>

      <button>Vamos conversar</button>
    </nav>
  );
}
