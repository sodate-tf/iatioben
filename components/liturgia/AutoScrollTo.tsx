// components/liturgia/AutoScrollTo.tsx
"use client";

import { useEffect } from "react";

export default function AutoScrollTo({
  targetId,
  desktopHeaderPx = 80,
  extraOffsetPx = 12,
  behavior = "smooth",
}: {
  targetId: string;
  desktopHeaderPx?: number;
  extraOffsetPx?: number;
  behavior?: ScrollBehavior;
}) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches; // lg
    const offset = (isDesktop ? desktopHeaderPx : 0) + extraOffsetPx;

    const run = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
    };

    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [targetId, desktopHeaderPx, extraOffsetPx, behavior]);

  return null;
}
