import Link from "next/link";

import { getNoteSummaries } from "@/lib/notes";

const SITE_NAV_LABEL = "Murhakaverit Vault";

type NavHref =
  | "/"
  | { pathname: "/"; hash: string }
  | { pathname: "/notes/[...slug]"; params: { slug: string[] } };

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
    const slugSegments = slug.split("/");
    items.push({
      label: "Read Overview",
      href: {
        pathname: "/notes/[...slug]",
        params: { slug: slugSegments },
      },
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
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
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
                  : "hash" in item.href
                    ? `${item.href.pathname}#${item.href.hash}`
                    : `${item.href.pathname}/${item.href.params.slug.join("/")}`
              }
              href={item.href}
              className="transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
