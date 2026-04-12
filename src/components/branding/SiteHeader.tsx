"use client";

import { usePathname } from "next/navigation";
import TihldeLogo from "./TihldeLogo";

export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "") {
    return null;
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-3 sm:px-6 pointer-events-none"
      role="banner"
    >
      <a
        href="https://tihlde.org"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon)]"
        aria-label="TIHLDE"
      >
        <TihldeLogo />
      </a>
      <a
        href="https://abakus.no"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon)]"
        aria-label="Abakus"
      >
        <img
          src="/abakus-logo-light.png"
          alt=""
          width={2000}
          height={404}
          className="h-[1.6rem] w-auto max-w-[min(33.6vw,8.8rem)] object-contain object-right"
          decoding="async"
        />
      </a>
    </header>
  );
}
