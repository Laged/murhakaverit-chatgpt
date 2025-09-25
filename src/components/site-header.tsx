import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";
import { PageTimer } from "@/components/page-timer";

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
        <div className="nav-scroll flex items-center gap-3 overflow-x-auto whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/70 sm:justify-between sm:overflow-visible">
          <div className="flex items-center gap-2 text-foreground">
            <Link href={navItems[0]?.href ?? "/"} className="transition hover:text-foreground/60">
              {navItems[0]?.label}
            </Link>
            <span className="text-foreground/40" aria-hidden>
              |
            </span>
            {navItems[1] && (
              <Link href={navItems[1].href} className="transition hover:text-foreground/60">
                {navItems[1].label}
              </Link>
            )}
          </div>
          {characterItems.length > 0 && (
            <div className="flex items-center gap-2 text-foreground/60">
              <span className="hidden text-foreground/40 sm:inline">Hahmot:</span>
              <span className="inline sm:hidden text-foreground/40">Hahmot</span>
              <nav className="flex items-center gap-2">
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
          )}
        </div>
        <div className="flex items-center justify-between">
          <PageTimer />
          <div className="flex-1 pl-3">
            <ScrollProgress />
          </div>
        </div>
      </div>
    </header>
  );
}
