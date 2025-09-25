import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getNoteBySlug, getNoteSummaries } from "@/lib/notes";
import {
  createPopupComponents,
  fetchPopupNotes,
  transformWikiLinks,
} from "@/lib/wiki-links";

export const revalidate = 3600;

const LANDING_NOTE_MATCHER = (slugSegments: string[]) =>
  slugSegments.length >= 3 && slugSegments[0] === "1" && slugSegments[1] === "0";

export default async function Home() {
  const summaries = await getNoteSummaries();

  const landingSummary = summaries.find((note) =>
    LANDING_NOTE_MATCHER(note.slugSegments),
  );

  const landingNote = landingSummary
    ? await getNoteBySlug(landingSummary.slugSegments)
    : undefined;

  const landingWiki = landingNote
    ? transformWikiLinks(landingNote.content, summaries)
    : undefined;
  const landingPopups = landingWiki
    ? await fetchPopupNotes(landingWiki.referencedSlugs)
    : undefined;
  const landingComponents = landingPopups
    ? createPopupComponents(landingPopups)
    : undefined;

  const notes = summaries.filter((note) => {
    if (LANDING_NOTE_MATCHER(note.slugSegments)) {
      return false;
    }

    if (
      note.slugSegments.length >= 2 &&
      note.slugSegments[0] === "1" &&
      note.slugSegments[1] === "9"
    ) {
      return false;
    }

    return true;
  });

  const showEmptyState = !landingNote && notes.length === 0;
  const nextAfterLanding = landingSummary ? notes.at(0) : undefined;
  const nextAfterLandingHref = nextAfterLanding
    ? `/notes/${nextAfterLanding.slug}`
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      {landingNote && landingWiki && (
        <article className="rounded-3xl border border-foreground/15 bg-background/80 px-8 py-10 shadow-sm shadow-foreground/5">
          <header className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-balance text-4xl font-semibold leading-tight uppercase sm:text-5xl">
              {landingNote.title}
            </h1>
          </header>
          <div className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={landingComponents}
            >
              {landingWiki.content}
            </ReactMarkdown>
          </div>
          {nextAfterLandingHref && (
            <div className="mt-10 flex justify-end">
              <Link
                href={nextAfterLandingHref}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground transition hover:border-foreground/50"
              >
                Seuraava
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </article>
      )}

      {showEmptyState ? (
        <p className="rounded-2xl border border-dashed border-foreground/20 bg-background/40 p-6 text-base leading-relaxed text-foreground/70">
          No markdown files found yet. Drop `.md` files into `content/` and rerun
          the build.
        </p>
      ) : (
        <section id="notes" className="flex flex-col gap-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold leading-tight">All notes</h2>
            <span className="text-sm text-foreground/55">
              {notes.length} file{notes.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {notes.map((note) => {
              return (
                <li key={note.slug}>
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group block h-full rounded-2xl border border-foreground/12 bg-background/80 p-6 shadow-sm shadow-foreground/5 transition hover:-translate-y-0.5 hover:border-foreground/40 hover:shadow-lg hover:shadow-foreground/10"
                  >
                    <h3 className="text-lg font-semibold leading-snug uppercase text-foreground group-hover:text-foreground">
                      {note.title}
                    </h3>
                    {note.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                        {note.description}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-foreground/40">
                        No preview available
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
