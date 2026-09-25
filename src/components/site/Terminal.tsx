import { useEffect, useRef, useState } from "react";
import { setLang, useI18n } from "@/lib/i18n";

type Line = { kind: "in" | "out"; text: string };

const LINKS: Record<string, string> = {
  github: "https://github.com/kiparis-zx",
  github2: "https://github.com/Corrupted-Code",
  telegram: "https://t.me/ciskwn",
  steam: "https://steamcommunity.com/id/kiparis-/",
};

const HELP_EN = [
  "available commands:",
  "  help        — this list",
  "  whoami      — about kiparis",
  "  projects    — jump to projects",
  "  contact     — contact handles",
  "  socials     — open a link: socials github | telegram | steam",
  "  date        — current time",
  "  language    — switch site language: language en | ru",
  "  clear       — wipe the screen",
  "  exit        — close terminal (esc)",
].join("\n");

const HELP_RU = [
  "доступные команды:",
  "  help        — этот список",
  "  whoami      — о kiparis",
  "  projects    — перейти к проектам",
  "  contact     — контакты",
  "  socials     — открыть ссылку: socials github | telegram | steam",
  "  date        — текущее время",
  "  language    — язык сайта: language en | ru",
  "  clear       — очистить экран",
  "  exit        — закрыть консоль (esc)",
].join("\n");

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: "kiparis shell v1.0 — type 'help' to begin." },
  ]);
  const { lang, t } = useI18n();
  const ru = lang === "ru";
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines, open]);

  const run = (raw: string) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const push = (text: string) =>
      setLines((l) => [...l, { kind: "in", text: raw }, { kind: "out", text }]);

    switch (cmd) {
      case "":
        return;
      case "help":
        return push(ru ? HELP_RU : HELP_EN);
      case "whoami":
        return push(
          ru
            ? "kiparis — разработчик и любитель автоматизации.\nделает ботов, инструменты и веб-штуки на python, js и lua."
            : "kiparis — developer, tinkerer, automation enjoyer.\nbuilds bots, tools and small web things in python, js and lua.",
        );
      case "projects":
        push("navigating to /projects ...");
        onClose();
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        return;
      case "contact":
        return push("telegram: @ciskwn\ndiscord: .kiparis_\ngithub: kiparis-zx, Corrupted-Code");
      case "socials": {
        const key = (args[0] ?? "").toLowerCase();
        if (LINKS[key]) {
          window.open(LINKS[key], "_blank", "noreferrer");
          return push(`opening ${key} ...`);
        }
        return push(`usage: socials [${Object.keys(LINKS).join(" | ")}]`);
      }
      case "language":
      case "lang": {
        const l = (args[0] ?? "").toLowerCase();
        if (l === "en" || l === "ru") {
          setLang(l);
          return push(l === "ru" ? "язык переключён: русский" : "language set: english");
        }
        return push(ru ? "использование: language en | ru" : "usage: language en | ru");
      }
      case "date":
        return push(new Date().toString());
      case "clear":
        return setLines([]);
      case "exit":
        return onClose();
      default:
        return push(ru ? `команда не найдена: ${cmd}. попробуй 'help'.` : `command not found: ${cmd}. try 'help'.`);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-background/80 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="surface animate-fade-up flex h-[60vh] w-full max-w-2xl flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted-foreground">
          <span>kiparis@web — /bin/sh</span>
          <button onClick={onClose} className="hover:text-foreground">
            esc
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-4 text-xs leading-relaxed">
          {lines.map((l, i) => (
            <pre
              key={i}
              className={`font-mono whitespace-pre-wrap ${
                l.kind === "in" ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {l.kind === "in" ? `$ ${l.text}` : l.text}
            </pre>
          ))}
          <div ref={endRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            setValue("");
          }}
          className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm"
        >
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            className="w-full bg-transparent outline-none"
            placeholder={t.placeholder}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
