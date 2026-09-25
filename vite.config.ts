// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GITHUB_PAGES=true -> fully static SPA build into dist/client (for GitHub Pages).
// BASE_PATH -> e.g. "/my-repo/" for project pages, "/" for username.github.io.
const isPages = process.env["GITHUB_PAGES"] === "true";
const base = process.env["BASE_PATH"] || "/";

export default defineConfig(
  isPages
    ? ({
        nitro: false,
        vite: { base },
        tanstackStart: {
          server: { entry: "server" },
          spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
        },
      } as any)
    : {
        tanstackStart: {
          // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
          // nitro/vite builds from this
          server: { entry: "server" },
        },
      },
);
