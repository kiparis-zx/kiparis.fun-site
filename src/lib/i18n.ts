import { useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "ru";
let current: Lang = "en";
const subs = new Set<() => void>();

export function setLang(l: Lang) {
  current = l;
  try {
    localStorage.setItem("lang", l);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = l;
  subs.forEach((f) => f());
}

const dict = {
  en: {
    about: "about", projects: "projects", contact: "contact", shell: "⌘K shell",
    tagline: "developer building bots, automation tools and small web things. python, javascript, lua.",
    quote: '"code should do the boring parts for you"',
    viewProjects: "view projects", openShell: "open shell",
    automation: "automation", web: "web", tooling: "tooling",
    automationD: "bots that play the grind for you — fishing bots, monitors, downloaders and schedulers.",
    webD: "fast, dark, no-nonsense sites and server pages built with modern js tooling.",
    toolingD: "small scripts that remove repetitive work: parsers, cli helpers, game utilities.",
    copy: "copy", copied: "copied", open: "open", footer: "press ` or ⌘K for the shell",
    reposLive: "repos · live from github", search: "search projects...",
    sortUpdated: "sort: updated", sortStars: "sort: stars", sortName: "sort: name",
    all: "all", noMatches: "no matches.", today: "today",
    placeholder: "type a command...",
  },
  ru: {
    about: "обо мне", projects: "проекты", contact: "контакты", shell: "⌘K консоль",
    tagline: "разработчик: боты, инструменты автоматизации и небольшие веб-штуки. python, javascript, lua.",
    quote: "«код должен делать скучную работу за тебя»",
    viewProjects: "к проектам", openShell: "открыть консоль",
    automation: "автоматизация", web: "веб", tooling: "инструменты",
    automationD: "боты, которые гриндят за тебя — рыболовные боты, мониторы, загрузчики и планировщики.",
    webD: "быстрые тёмные сайты и серверные страницы без лишнего, на современном js.",
    toolingD: "небольшие скрипты против рутины: парсеры, cli-хелперы, игровые утилиты.",
    copy: "копировать", copied: "скопировано", open: "открыть", footer: "нажми ` или ⌘K для консоли",
    reposLive: "репозиториев · live с github", search: "поиск проектов...",
    sortUpdated: "сорт.: обновлено", sortStars: "сорт.: звёзды", sortName: "сорт.: имя",
    all: "все", noMatches: "ничего не найдено.", today: "сегодня",
    placeholder: "введите команду...",
  },
} as const;

export type Dict = (typeof dict)["en"];

export function useI18n() {
  const lang = useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => current,
    () => "en" as Lang,
  );
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if ((saved === "ru" || saved === "en") && saved !== current) setLang(saved);
  }, []);
  return { lang, t: dict[lang] as Dict };
}
