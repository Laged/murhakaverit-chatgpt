"use client";

import { useEffect, useState } from "react";

function calculateProgress(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (docHeight <= 0) {
    return 0;
  }

  return Math.min(scrollTop / docHeight, 1);
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setProgress(calculateProgress());
    };

    handleUpdate();

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, []);

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className="h-full origin-left bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
