"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function PageTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSeconds(0);
    intervalRef.current = window.setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/50">
      {formatTime(seconds)}
    </span>
  );
}
