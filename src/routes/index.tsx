import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getRepos, type Repo } from "@/lib/github";
import { ClickGate } from "@/components/site/ClickGate";
import { Projects } from "@/components/site/Projects";
import { Terminal } from "@/components/site/Terminal";

export const Route = createFileRoute("/")({
  ssr: false,
  loader: async () => ({ repos: await getRepos() }),
  head: () => ({
    meta: [
      { title: "kiparis — dev, bots & tools" },
      {
        name: "description",
        content:
          "Personal site of kiparis: projects, bots, automation tools and contacts. Live GitHub feed from kiparis-zx and Corrupted-Code.",
      },
      { property: "og:title", content: "kiparis — dev, bots & tools" },
      {
        property: "og:description",
        content: "Projects, bots, automation tools and contacts by kiparis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CONTACTS = [
  { label: "github", value: "kiparis-zx", href: "https://github.com/kiparis-zx" },
  { label: "github", value: "Corrupted-Code", href: "https://github.com/Corrupted-Code" },
  { label: "telegram", value: "@ciskwn", href: "https://t.me/ciskwn" },
  { label: "steam", value: "kiparis-", href: "https://steamcommunity.com/id/kiparis-/" },
  { label: "discord", value: ".kiparis_", href: null },
];

function useTypewriter(text: string, active: boolean, speed = 55) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) return;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return out;
}

function Index() {
  const { repos } = Route.useLoaderData() as { repos: Repo[] };
  const [entered, setEntered] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const typed = useTypewriter("kiparis", entered);
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!entered) return;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "`") {
        e.preventDefault();
        setTermOpen((v) => !v);
      }
      if (e.key === "Escape") setTermOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!entered) return <ClickGate onEnter={() => setEntered(true)} />;

  return (
    <div className="grid-bg min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0/0.75))]" />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 text-xs">
          <span className="font-semibold tracking-[0.2em] uppercase">kiparis</span>
          <nav className="flex items-center gap-5 text-muted-foreground">
            <a href="#about" className="hover:text-foreground">
              {t.about}
            </a>
            <a href="#projects" className="hover:text-foreground">
              {t.projects}
            </a>
            <a href="#contact" className="hover:text-foreground">
              {t.contact}
            </a>
            <button
              onClick={() => setTermOpen(true)}
              className="border border-border px-2 py-1 text-accent transition-colors hover:border-accent"
            >
              {t.shell}
            </button>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto flex min-h-[78vh] w-full max-w-5xl flex-col justify-center px-5">
        <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">// kiparis.fun</p>
        <h1 className="glow-text mt-4 text-6xl font-bold tracking-tight sm:text-8xl">
          {typed}
          <span className="animate-blink ml-1 inline-block h-[0.85em] w-[0.05em] translate-y-[0.06em] bg-foreground align-middle" />
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t.quote}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {t.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-xs">
          <a
            href="#projects"
            className="border border-accent px-4 py-2 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t.viewProjects}
          </a>
          <button
            onClick={() => setTermOpen(true)}
            className="border border-border px-4 py-2 transition-colors hover:border-foreground"
          >
            {t.openShell}
          </button>
        </div>

      </section>

      {/* about */}
      <section id="about" className="mx-auto w-full max-w-5xl px-5 py-24">
        <header className="mb-8 border-b border-border pb-4">
          <p className="text-xs text-accent glow-accent">$ cat ./about.md</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">/about</h2>
        </header>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: t.automation,
              d: t.automationD,
            },
            {
              t: t.web,
              d: t.webD,
            },
            {
              t: t.tooling,
              d: t.toolingD,
            },
          ].map((c) => (
            <div key={c.t} className="surface p-5">
              <h3 className="text-sm font-semibold text-accent">{c.t}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Projects repos={repos} />

      {/* contact */}
      <section id="contact" className="mx-auto w-full max-w-5xl px-5 py-24">
        <header className="mb-8 border-b border-border pb-4">
          <p className="text-xs text-accent glow-accent">$ ./contact --list</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">/contact</h2>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTACTS.map((c) => (
            <div
              key={c.label + c.value}
              className="surface flex items-center justify-between gap-4 px-4 py-3"
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {c.label}
                </p>
                <p className="text-sm">{c.value}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => copy(c.value)}
                  className="border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {copied === c.value ? t.copied : t.copy}
                </button>
                {c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-border px-2 py-1 transition-colors hover:border-accent hover:text-accent"
                  >
                    {t.open}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} <span className="text-foreground">kiparis</span>._{" "}
            <span className="animate-blink">EOF</span>
          </span>
          <span>{t.footer}</span>
        </div>
      </footer>

      <Terminal open={termOpen} onClose={() => setTermOpen(false)} />
    </div>
  );
}
