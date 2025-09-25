import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import {
  createPopupComponents,
  fetchPopupNotes,
  transformWikiLinks,
} from "@/lib/wiki-links";

export const revalidate = 3600;

type Params = {
  slug: string[];
};

type PageProps = {
  params: Promise<Params>;
};

export async function generateStaticParams() {
  const summaries = await getNoteSummaries();
  return summaries.map((summary) => ({ slug: summary.slugSegments }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: slug.slice(-1).join(" "),
    };
  }

  return {
    title: note.title,
    description: note.description,
    openGraph: {
      title: note.title,
      description: note.description,
    },
  } satisfies Metadata;
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const summaries = await getNoteSummaries();
  const { content: markdown, referencedSlugs } = transformWikiLinks(
    note.content,
    summaries,
  );
  const popupNotes = await fetchPopupNotes(referencedSlugs);
  const markdownComponents = createPopupComponents(popupNotes);

  const currentIndex = summaries.findIndex((summary) => summary.slug === note.slug);
  const nextNote =
    currentIndex >= 0 && currentIndex < summaries.length - 1
      ? summaries[currentIndex + 1]
      : undefined;
  const previousNote =
    currentIndex > 0 ? summaries[currentIndex - 1] : undefined;

  const nextHref = nextNote
    ? {
        pathname: "/notes/[...slug]" as const,
        params: { slug: nextNote.slugSegments },
      }
    : undefined;
  const previousHref = previousNote
    ? {
        pathname: "/notes/[...slug]" as const,
        params: { slug: previousNote.slugSegments },
      }
    : undefined;

  const humanise = (segment: string) =>
    segment
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || segment;

  const breadcrumbSegments = note.slugSegments.map((segment, index) => {
    const href = `/notes/${note.slugSegments
      .slice(0, index + 1)
      .join("/")}` as `/notes/${string}`;
    return {
      segment,
      index,
      href,
      isLast: index === note.slugSegments.length - 1,
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.3em] text-foreground/60">
        <Link
          href="/"
          className="uppercase transition hover:text-foreground"
        >
          Vault
        </Link>
        {breadcrumbSegments.map(({ segment, href, isLast, index }) => (
          <span key={href} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {isLast ? (
              <span className="uppercase text-foreground">{note.title}</span>
            ) : (
              <Link
                href={href}
                className="uppercase text-foreground/70 transition hover:text-foreground"
              >
                {index === 0 ? segment : humanise(segment)}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 text-lg leading-relaxed text-foreground/85">
        <header className="flex flex-col gap-4">
          <h1 className="text-balance text-3xl font-semibold leading-tight uppercase sm:text-4xl">
            {note.title}
          </h1>
          {note.description && (
            <p className="text-pretty text-lg text-foreground/70">
              {note.description}
            </p>
          )}
        </header>

        <div className="markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {markdown}
          </ReactMarkdown>
        </div>

        {(previousNote || nextNote) && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              {previousHref ? (
                <Link
                  href={previousHref}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
                >
                  <span aria-hidden>←</span>
                  Edellinen
                </Link>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
                >
                  <span aria-hidden>←</span>
                  Etusivu
                </Link>
              )}
            </div>
            {nextHref && (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
              >
                Seuraava
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
