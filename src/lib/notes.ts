import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

export type NoteSummary = {
  slug: string;
  slugSegments: string[];
  title: string;
  description?: string;
  relativePath: string;
};

export type Note = NoteSummary & {
  content: string;
};

const MARKDOWN_EXTENSION = ".md";

const NUMBERED_PREFIX = /^(\d+(?:[.\-]\d+)*)(?:\s*[)\-])?\s*/;

function stripNumberedPrefix(value: string): string {
  const trimmed = value.trim();
  const closingParenIndex = trimmed.indexOf(")");

  if (closingParenIndex > 0) {
    const prefix = trimmed.slice(0, closingParenIndex);
    const identifier = prefix.replace(/\s+/g, "");
    if (/^\d+(?:[.\-]\d+)*$/.test(identifier)) {
      return trimmed.slice(closingParenIndex + 1).trim();
    }
  }

  const match = trimmed.match(NUMBERED_PREFIX);
  if (
    match &&
    (match[1].includes(".") ||
      match[1].includes("-") ||
      match[0].includes(")") ||
      match[0].includes("-"))
  ) {
    return trimmed.slice(match[0].length).trim();
  }

  return trimmed;
}

function isMarkdownFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(MARKDOWN_EXTENSION);
}

function sanitiseSegment(segment: string): string {
  const normalised = segment
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalised.length > 0 ? normalised : "note";
}

function explodeSegment(rawSegment: string): string[] {
  const trimmed = rawSegment.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const slugParts: string[] = [];
  const match = trimmed.match(NUMBERED_PREFIX);

  if (match) {
    const numbers = match[1].split(/[.\-]/).filter(Boolean);
    slugParts.push(...numbers.map(sanitiseSegment));
  }

  const remainder = trimmed.slice(match ? match[0].length : 0).trim();
  if (remainder.length > 0) {
    slugParts.push(sanitiseSegment(remainder));
  }

  if (slugParts.length === 0) {
    slugParts.push(sanitiseSegment(trimmed));
  }

  return slugParts;
}

function humaniseFileStem(stem: string): string {
  const cleaned = stem
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stripped = stripNumberedPrefix(cleaned);
  return stripped.length > 0 ? stripped : cleaned || stem;
}

function extractTitle(markdown: string): string | undefined {
  const headingMatch = markdown.match(/^#\s+(.+)/m);
  if (headingMatch) {
    return stripNumberedPrefix(headingMatch[1]);
  }

  return undefined;
}

function extractDescription(markdown: string): string | undefined {
  const lines = markdown.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.length === 0) {
      continue;
    }

    if (line.startsWith("#")) {
      continue;
    }

    return line;
  }

  return undefined;
}

function ensureUniqueSlug(
  baseSegments: string[],
  seen: Set<string>,
): string[] {
  let candidateSegments = [...baseSegments];
  let candidateKey = candidateSegments.join("/");
  let suffix = 1;

  while (seen.has(candidateKey)) {
    const segments = [...baseSegments];
    const last = segments.pop() ?? "note";
    segments.push(`${last}-${suffix}`);
    candidateSegments = segments;
    candidateKey = candidateSegments.join("/");
    suffix += 1;
  }

  seen.add(candidateKey);
  return candidateSegments;
}

async function collectNotes(seenSlugs: Set<string>): Promise<NoteSummary[]> {
  let directoryEntries;

  try {
    directoryEntries = await fs.readdir(CONTENT_DIRECTORY, {
      withFileTypes: true,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const summaries: NoteSummary[] = [];

  for (const entry of directoryEntries) {
    if (!entry.isFile() || !isMarkdownFile(entry.name)) {
      continue;
    }

    const relativePath = entry.name;
    const filePath = path.join(CONTENT_DIRECTORY, relativePath);
    const rawContent = await fs.readFile(filePath, "utf-8");

    const stem = path.parse(entry.name).name;
    const slugSegments = ensureUniqueSlug(explodeSegment(stem), seenSlugs);

    const isExcludedNote =
      slugSegments.length >= 2 &&
      slugSegments[0] === "1" &&
      slugSegments[1] === "9";

    if (isExcludedNote) {
      continue;
    }

    const summary: NoteSummary = {
      slug: slugSegments.join("/"),
      slugSegments,
      title: (extractTitle(rawContent) ?? humaniseFileStem(stem)).trim(),
      description: extractDescription(rawContent),
      relativePath,
    };

    summaries.push(summary);
  }

  return summaries.sort((left, right) =>
    left.relativePath.localeCompare(right.relativePath),
  );
}

export const getNoteSummaries = cache(async (): Promise<NoteSummary[]> => {
  return collectNotes(new Set());
});

export const getNoteBySlug = cache(
  async (slugOrSegments: string | string[]): Promise<Note | undefined> => {
    const slugSegments = Array.isArray(slugOrSegments)
      ? slugOrSegments
      : slugOrSegments.split("/");
    const slug = slugSegments.join("/");
    const summaries = await getNoteSummaries();
    const match = summaries.find((summary) => summary.slug === slug);

    if (!match) {
      return undefined;
    }

    const filePath = path.join(CONTENT_DIRECTORY, match.relativePath);
    const content = await fs.readFile(filePath, "utf-8");

    return {
      ...match,
      content,
    };
  },
);
