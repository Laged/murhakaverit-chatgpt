"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { PopupNoteData } from "@/lib/wiki-links";

type PopupNoteLinkProps = {
  children: React.ReactNode;
  note?: PopupNoteData;
};

export function PopupNoteLink({ children, note }: PopupNoteLinkProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!note) {
    return <span className="font-semibold text-foreground">{children}</span>;
  }

  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-foreground underline decoration-dotted decoration-foreground/40 underline-offset-[0.35em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        onClick={() => setOpen((state) => !state)}
        aria-expanded={open}
        aria-controls={`popup-${note.slug}`}
      >
        {children}
      </button>

      {open ? (
        <div
          id={`popup-${note.slug}`}
          role="dialog"
          aria-modal="false"
          className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-lg shadow-foreground/10 backdrop-blur"
        >
          <div className="flex flex-col gap-2 text-left">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-foreground/50">
                Note preview
              </p>
              <h3 className="text-sm font-semibold leading-snug text-foreground">
                {note.title}
              </h3>
            </div>
            {note.excerpt && (
              <p className="text-xs leading-relaxed text-foreground/70">
                {note.excerpt}
              </p>
            )}
            <Link
              href={`/notes/${note.slug}`}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground underline decoration-transparent transition hover:decoration-foreground"
              onClick={() => setOpen(false)}
            >
              Open full note →
            </Link>
          </div>
        </div>
      ) : null}
    </span>
  );
}
