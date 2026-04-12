import TihldeLogo from "./TihldeLogo";

export default function OrganizerContestRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
      <a
        href="https://tihlde.org"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon)]"
        aria-label="TIHLDE"
      >
        <TihldeLogo />
      </a>
      <span
        className="arcade-title text-[0.45rem] sm:text-[0.55rem] text-neon/90 tabular-nums px-0.5"
        aria-hidden
      >
        vs
      </span>
      <a
        href="https://abakus.no"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon)]"
        aria-label="Abakus"
      >
        <img
          src="/abakus-logo-light.png"
          alt=""
          width={2000}
          height={404}
          className="h-8 w-auto max-w-[min(40vw,10rem)] object-contain object-center"
          decoding="async"
        />
      </a>
    </div>
  );
}
