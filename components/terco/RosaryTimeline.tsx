"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type { MysterySetKey } from "./RosaryDataset";
import type { RosaryStep } from "./RosaryEngine";
import { motion } from "framer-motion";

type Props = {
  steps: RosaryStep[];
  current: number;
  onSelect: (index: number) => void;
  setKey: MysterySetKey;
  highlight?: boolean;
  variant?: "sticky" | "hero" | "compact";
};

function palette(setKey: MysterySetKey) {
  switch (setKey) {
    case "gozosos":
      return { active: "bg-emerald-600 border-emerald-600", ring: "rgba(16,185,129,0.18)" };
    case "dolorosos":
      return { active: "bg-rose-700 border-rose-700", ring: "rgba(190,24,93,0.18)" };
    case "gloriosos":
      return { active: "bg-amber-600 border-amber-600", ring: "rgba(234,179,8,0.20)" };
    case "luminosos":
    default:
      return { active: "bg-sky-700 border-sky-700", ring: "rgba(14,165,233,0.18)" };
  }
}

function CrossIcon() {
  // SVG mais estável que spans absolutos
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 3h2v7h7v2h-7v9h-2v-9H4v-2h7V3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function RosaryTimeline({
  steps,
  current,
  onSelect,
  setKey,
  highlight = false,
  variant = "compact",
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { active, ring } = useMemo(() => palette(setKey), [setKey]);
  const beads = useMemo(() => steps.filter((s) => s.kind === "bead"), [steps]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>(`button[data-step="${current}"]`);
    if (!btn) return;

    const r1 = el.getBoundingClientRect();
    const r2 = btn.getBoundingClientRect();
    el.scrollBy({
      left: r2.left - r1.left - r1.width / 2 + r2.width / 2,
      behavior: "smooth",
    });
  }, [current]);

  const isSticky = variant === "sticky";
  const isHero = variant === "hero";

  // ✅ Reduz altura mínima para remover o “vazio” riscado
  const containerMinH = isHero
    ? "min-h-[42vh] sm:min-h-[320px]"
    : isSticky
    ? "min-h-[118px] sm:min-h-[128px]"
    : "min-h-[110px] sm:min-h-[120px]";

  const paddingY = isHero ? "py-7 sm:py-9" : isSticky ? "py-4" : "py-4";

  return (
    <div className={`relative w-full rounded-2xl border border-amber-200 bg-white overflow-hidden ${containerMinH}`}>
      {/* cordão */}
      <div className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-amber-200/70" />
      <div className="pointer-events-none absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] rounded-full bg-white/60" />

      <div
        ref={scrollerRef}
        className={`relative z-10 w-full overflow-x-auto scroll-smooth ${paddingY}`}
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}
        aria-label="Contas do terço"
      >
        <div className="flex items-center gap-3 min-w-max px-4 sm:px-6">
          {beads.map((s) => {
            const isActive = s.index === current;
            const isDone = s.index < current;

            const size =
              s.beadStyle === "cross"
                ? isHero
                  ? "h-20 w-20"
                  : isSticky
                  ? "h-16 w-16"
                  : "h-12 w-12"
                : s.prayer === "ourFather"
                ? isHero
                  ? "h-16 w-16"
                  : isSticky
                  ? "h-14 w-14"
                  : "h-10 w-10"
                : isHero
                ? "h-14 w-14"
                : isSticky
                ? "h-12 w-12"
                : "h-9 w-9";

            const base =
              "relative shrink-0 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-amber-500";

            const stateClass = isActive
              ? active
              : isDone
              ? "bg-amber-200 border-amber-200"
              : "bg-white border-amber-200 hover:bg-amber-50";

            const pulseOn = Boolean(highlight && isActive);

            return (
              <button
                key={`b-${s.index}`}
                type="button"
                data-step={s.index}
                onClick={() => onSelect(s.index)}
                className={`${base} ${size} ${stateClass}`}
                style={{
                  scrollSnapAlign: "center",
                  boxShadow: isActive ? `0 0 0 10px ${ring}` : undefined,
                }}
                aria-label={s.label}
                aria-current={isActive ? "step" : undefined}
              >
                {/* ✅ Cruz corrigida */}
                {s.beadStyle === "cross" ? (
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    <CrossIcon />
                  </span>
                ) : (
                  <span
                    className={
                      "absolute inset-0 flex items-center justify-center text-[11px] sm:text-xs font-extrabold " +
                      (isActive ? "text-white" : "text-amber-900")
                    }
                    aria-hidden
                  >
                    {s.prayer === "ourFather" ? "Pai" : s.prayer === "hailMary" ? "Ave" : "•"}
                  </span>
                )}

                {pulseOn && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.14, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ boxShadow: `0 0 0 18px ${ring}` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ✅ Removido o fade/gradiente do rodapé que estava criando o “vazio” */}
    </div>
  );
}
