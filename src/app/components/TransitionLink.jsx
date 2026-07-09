// src/app/components/TransitionLink.jsx
"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "@/app/components/TransitionProvider";

export default function TransitionLink({ href, children, className, ...props }) {
  const { navigateWithTransition } = useTransition();
  const pathname = usePathname();

  const handleClick = (e) => {
    // deixa o navegador cuidar de ctrl+click / cmd+click (abrir em nova aba)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();

    // já está na página? não roda a transição à toa
    if (pathname === href) return;

    navigateWithTransition(href);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}