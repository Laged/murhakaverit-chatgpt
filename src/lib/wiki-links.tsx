import type { Components } from "react-markdown";

import { PopupNoteLink } from "@/components/popup-note-link";
import { getNoteBySlug, type Note, type NoteSummary } from "@/lib/notes";

export type PopupNoteData = {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
};

type WikiLinkTransformResult = {
  content: string;
  referencedSlugs: string[];
};

const WIKILINK_PATTERN = /\[\[([^\[\]|]+?)(?:\|([^\[\]]+))?\]\]/g;

function slugifyTerm(term: string): string {
  return term
    .trim()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9/]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function resolveReference(
  rawTarget: string,
  summaries: NoteSummary[],
): NoteSummary | undefined {
  const target = rawTarget.trim();
  const slugCandidate = slugifyTerm(target);

  return summaries.find((summary) => {
    const lastSegment = summary.slugSegments.at(-1);
    return (
      summary.slug === slugCandidate ||
      lastSegment === slugCandidate ||
      summary.title.trim().toLowerCase() === target.toLowerCase()
    );
  });
}

function createExcerpt(note: Note): string | undefined {
  if (note.description) {
    return note.description;
  }

  const paragraphs = note.content
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs[0]?.slice(0, 280);
}

export function transformWikiLinks(
  content: string,
  summaries: NoteSummary[],
): WikiLinkTransformResult {
  const referenced = new Set<string>();

  const transformed = content.replace(
    WIKILINK_PATTERN,
    (fullMatch, targetRaw: string, aliasRaw?: string) => {
      const displayLabel = (aliasRaw ?? targetRaw).trim();
      const resolved = resolveReference(targetRaw, summaries);

      if (!resolved) {
        return `**${displayLabel}**`;
      }

      referenced.add(resolved.slug);
      return `**[${displayLabel}](note:${resolved.slug})**`;
    },
  );

  return {
    content: transformed,
    referencedSlugs: Array.from(referenced),
  };
}

export async function fetchPopupNotes(
  slugs: Iterable<string>,
): Promise<Record<string, PopupNoteData>> {
  const lookup: Record<string, PopupNoteData> = {};

  for (const slug of new Set(slugs)) {
    const note = await getNoteBySlug(slug);
    if (!note) {
      continue;
    }

    lookup[slug] = {
      slug: note.slug,
      title: note.title,
      description: note.description,
      excerpt: createExcerpt(note),
    };
  }

  return lookup;
}

export function createPopupComponents(
  popupNotes: Record<string, PopupNoteData>,
): Components {
  return {
    a({ href, children, ...rest }) {
      const anchorProps = { ...rest } as Record<string, unknown>;
      if ("node" in anchorProps) {
        delete anchorProps.node;
      }

      if (href?.startsWith("note:")) {
        const slug = href.replace(/^note:/, "");
        const note = popupNotes[slug];

        return <PopupNoteLink note={note}>{children}</PopupNoteLink>;
      }

      if (!href) {
        return <span {...anchorProps}>{children}</span>;
      }

      return (
        <a href={href} {...anchorProps}>
          {children}
        </a>
      );
    },
  };
}
