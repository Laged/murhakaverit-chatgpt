import Link from "next/link";
import type { Route } from "next";

import { getNoteSummaries } from "@/lib/notes";
import { ScrollProgress } from "@/components/scroll-progress";

const SITE_NAV_LABEL = "Murhakaverit Vault";

type NavHref = Route | { pathname: "/"; hash: string };

type NavItem = {
  label: string;
  href: NavHref;
};

function buildNavItems(slug?: string): NavItem[] {
  const items: NavItem[] = [
    {
      label: "Home",
      href: "/" as Route,
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
      href: `/notes/${slug}` as Route,
    });
  }

  return items;
}

export async function SiteHeader() {
  const summaries = await getNoteSummaries();
  const overviewSlug = summaries.find((note) => note.slug.startsWith("1/0"))
    ?.slug;
  const navItems = buildNavItems(overviewSlug ?? summaries[0]?.slug);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.35em] text-foreground"
          >
            {SITE_NAV_LABEL}
          </Link>
          <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/70 sm:gap-6">
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
          </nav>
        </div>
        <ScrollProgress />
      </div>
    </header>
  );
}
