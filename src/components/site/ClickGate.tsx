import { useEffect, useState } from "react";

export function ClickGate({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 420);
  };

  useEffect(() => {
    const onKey = () => enter();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      onClick={enter}
      className={`fixed inset-0 z-50 grid-bg flex cursor-pointer select-none flex-col items-center justify-center bg-background transition-all duration-400 ${
        leaving ? "pointer-events-none scale-105 opacity-0 blur-sm" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-6 border border-border/40" />
      <p className="mb-4 text-xs tracking-[0.35em] text-muted-foreground uppercase">
        // kiparis
      </p>
      <h1 className="glow-text animate-flicker text-6xl font-bold tracking-tight sm:text-8xl">
        <span className="glitch" data-text="click">
          <span className="glitch-core">click</span>
        </span>
        <span className="animate-blink ml-1 inline-block h-[0.9em] w-[0.06em] translate-y-[0.08em] bg-foreground align-middle" />
      </h1>
      <p className="mt-8 text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
        press anywhere
      </p>
    </div>
  );
}
