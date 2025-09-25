import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";

type NavHref = "/" | { pathname: "/"; hash: string } | string;

type NavItem = {
  label: string;
  href: NavHref;
};

function buildNavItems(suomiSlug?: string): NavItem[] {
  return [
    {
      label: "Alku",
      href: "/",
    },
    {
      label: "Suomi 2068",
      href: suomiSlug ? `/notes/${suomiSlug}` : "/#notes",
    },
  ];
}

type CharacterNavItem = {
  label: string;
  href: string;
};

function buildCharacterItems(
  summaries: Awaited<ReturnType<typeof getNoteSummaries>>,
): CharacterNavItem[] {
  return summaries
    .filter((summary) => /^hahmo\s/i.test(summary.title))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((summary) => ({
      label: summary.title.replace(/^hahmo\s*/i, ""),
      href: `/notes/${summary.slug}`,
    }));
}

export async function SiteHeader() {
  const summaries = await getNoteSummaries();
  const suomiNote = summaries.find((note) =>
    note.slugSegments.slice(0, 2).join("/") === "1/1",
  );
  const navItems = buildNavItems(suomiNote?.slug);
  const characterItems = buildCharacterItems(summaries);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="panel mx-auto flex w-full max-w-5xl flex-col gap-2 bg-background/85 px-4 py-3 sm:gap-3 sm:px-8 sm:py-4">
        <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground sm:justify-start">
            {navItems.map((item, index) => {
              const key =
                typeof item.href === "string"
                  ? item.href
                  : `${item.href.pathname}#${item.href.hash}`;

              return (
                <span key={key} className="flex items-center gap-2">
                  <Link href={item.href} className="transition hover:text-foreground/70">
                    {item.label}
                  </Link>
                  {index === 0 && (
                    <span className="text-foreground/40" aria-hidden>
                      |
                    </span>
                  )}
                </span>
              );
            })}
          </nav>
          <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.26em] text-foreground/60 sm:justify-end">
            <span className="hidden text-foreground/40 sm:inline">Hahmot:</span>
            <nav className="nav-scroll flex items-center gap-2 overflow-x-auto whitespace-nowrap sm:overflow-visible">
              {characterItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <ScrollProgress />
      </div>
    </header>
  );
}
