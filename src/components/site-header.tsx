import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";

const SITE_NAV_LABEL = "Murhakaverit Vault";

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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.35em] text-foreground"
          >
            {SITE_NAV_LABEL}
          </Link>
          <nav className="nav-scroll flex items-center gap-4 overflow-x-auto whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground/70 sm:flex-wrap sm:gap-6 sm:overflow-visible sm:whitespace-normal">
            {navItems.map((item) => (
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
            {characterItems.length > 0 && (
              <span className="hidden h-4 w-px bg-foreground/20 sm:block" aria-hidden />
            )}
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
        <ScrollProgress />
      </div>
    </header>
  );
}
