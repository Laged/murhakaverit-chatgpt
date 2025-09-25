import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";

type NavHref = "/" | { pathname: "/"; hash: string } | string;

type NavItem = {
  label: string;
  href: NavHref;
};

function buildNavItems(slug?: string): NavItem[] {
  const items: NavItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "All Notes",
      href: {
        pathname: "/",
        hash: "notes",
      },
    },
  ];

  if (slug) {
    items.push({
      label: "Read Overview",
      href: `/notes/${slug}`,
    });
  }

  return items;
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
      label: summary.title,
      href: `/notes/${summary.slug}`,
    }));
}

export async function SiteHeader() {
  const summaries = await getNoteSummaries();
  const overviewSlug = summaries.find((note) => note.slug.startsWith("1/0"))
    ?.slug;
  const navItems = buildNavItems(overviewSlug ?? summaries[0]?.slug);
  const characterItems = buildCharacterItems(summaries);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="panel mx-auto flex w-full max-w-5xl flex-col gap-2 bg-background/85 px-4 py-3 sm:gap-3 sm:px-8 sm:py-4">
        <div className="flex w-full items-center gap-3 sm:gap-4">
          <span className="hidden flex-1 border-t border-dashed border-foreground/25 sm:block" aria-hidden />
          <nav className="nav-scroll flex flex-1 items-center justify-between gap-3 overflow-x-auto whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.26em] text-foreground/70 sm:flex-wrap sm:justify-center sm:gap-5 sm:overflow-visible sm:whitespace-normal">
            {[...navItems, ...characterItems].map((item) => (
              <Link
                key={
                  typeof item.href === "string"
                    ? item.href
                    : `${item.href.pathname}#${item.href.hash}`
                }
                href={item.href}
                className="transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="hidden flex-1 border-t border-dashed border-foreground/25 sm:block" aria-hidden />
        </div>
        <ScrollProgress />
      </div>
    </header>
  );
}
