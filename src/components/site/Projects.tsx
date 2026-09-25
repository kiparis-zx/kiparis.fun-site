import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Repo } from "@/lib/github";

type Sort = "updated" | "stars" | "name";

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - +new Date(iso)) / 86400000);
  if (d <= 0) return "today";
  if (d === 1) return "1d ago";
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.floor(m / 12)}y ago`;
}

export function Projects({ repos }: { repos: Repo[] }) {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("updated");

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean) as string[]);
    return ["all", ...Array.from(set).sort()];
  }, [repos]);

  const list = useMemo(() => {
    let out = repos.filter((r) => {
      const hay = `${r.name} ${r.description ?? ""} ${r.language ?? ""} ${r.owner}`.toLowerCase();
      return hay.includes(q.toLowerCase()) && (lang === "all" || r.language === lang);
    });
    out = [...out].sort((a, b) =>
      sort === "stars"
        ? b.stars - a.stars
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : +new Date(b.updatedAt) - +new Date(a.updatedAt),
    );
    return out;
  }, [repos, q, lang, sort]);

  return (
    <section id="projects" className="mx-auto w-full max-w-5xl px-5 py-24">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs text-accent glow-accent">$ cd ./projects</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">/projects</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          {list.length}/{repos.length} {t.reposLive}
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="surface flex min-w-[220px] flex-1 items-center gap-2 px-3 py-2">
          <span className="text-accent">&gt;</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="surface px-3 py-2 text-xs uppercase outline-none"
        >
          <option value="updated">{t.sortUpdated}</option>
          <option value="stars">{t.sortStars}</option>
          <option value="name">{t.sortName}</option>
        </select>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {languages.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`border px-3 py-1 text-xs transition-colors ${
              lang === l
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {l === "all" ? t.all : l.toLowerCase()}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {t.noMatches} <span className="animate-blink">_</span>
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((r, i) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              className="surface animate-fade-up group flex flex-col gap-3 p-4 transition-colors hover:border-accent/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">{r.owner}/</p>
                  <h3 className="text-base font-semibold transition-colors group-hover:text-accent">
                    {r.name}
                  </h3>
                </div>
                <span className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent">
                  &gt;
                </span>
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {r.description ?? "no description provided."}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                {r.language && <span className="text-foreground">{r.language}</span>}
                <span>★ {r.stars}</span>
                <span>⑂ {r.forks}</span>
                <span className="ml-auto">{timeAgo(r.updatedAt) === "today" ? t.today : timeAgo(r.updatedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
