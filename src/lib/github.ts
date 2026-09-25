export type Repo = {
  id: number;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
  topics: string[];
};

const ACCOUNTS = ["kiparis-zx", "Corrupted-Code"];

export async function getRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };

  const all: Repo[] = [];
  for (const user of ACCOUNTS) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
        { headers },
      );
      if (!res.ok) continue;
      const data = (await res.json()) as any[];
      for (const r of data) {
        if (r.fork) continue;
        all.push({
          id: r.id,
          name: r.name,
          owner: user,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
          url: r.html_url,
          homepage: r.homepage || null,
          updatedAt: r.pushed_at ?? r.updated_at,
          topics: r.topics ?? [],
        });
      }
    } catch {
      // ignore a failing account, still render the rest
    }
  }

  return all.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}
