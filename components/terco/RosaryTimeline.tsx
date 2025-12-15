"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type { MysterySetKey } from "./RosaryDataset";
import type { RosaryStep } from "./RosaryEngine";

function themeBySet(setKey: MysterySetKey) {
  switch (setKey) {
    case "gozosos":
      return {
        wood1: "#a38f63",
        wood2: "#7f6a3f",
        rope: "rgba(107, 94, 59, 0.75)",
        glow: "rgba(34,197,94,0.35)",
      };
    case "dolorosos":
      return {
        wood1: "#7a3e3e",
        wood2: "#562424",
        rope: "rgba(74, 31, 31, 0.75)",
        glow: "rgba(190,24,93,0.35)",
      };
    case "gloriosos":
      return {
        wood1: "#c9a24d",
        wood2: "#9f7c2f",
        rope: "rgba(122, 93, 30, 0.75)",
        glow: "rgba(234,179,8,0.45)",
      };
    case "luminosos":
    default:
      return {
        wood1: "#6b7c8f",
        wood2: "#4b5c6f",
        rope: "rgba(59, 74, 89, 0.75)",
        glow: "rgba(14,165,233,0.35)",
      };
  }
}

function beadWood(isActive: boolean, size: number, setKey: MysterySetKey) {
  const { wood1, wood2, glow } = themeBySet(setKey);

  return {
    width: size,
    height: size,
    borderRadius: "9999px",
    backgroundImage: `
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), transparent 60%),
      repeating-linear-gradient(120deg, rgba(0,0,0,0.14) 0px, rgba(255,255,255,0.05) 10px),
      linear-gradient(160deg, ${wood1}, ${wood2})
    `,
    boxShadow: isActive
      ? `0 0 0 3px ${glow}, 0 10px 18px rgba(0,0,0,0.22)`
      : `0 6px 14px rgba(0,0,0,0.20)`,
    transform: isActive ? "translateY(-1px)" : "none",
    transition: "all .18s ease",
  } as React.CSSProperties;
}

function knotStyle(isActive: boolean, setKey: MysterySetKey) {
  const { rope, glow } = themeBySet(setKey);

  return {
    width: 60,
    height: 16,
    borderRadius: 999,
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(0,0,0,0.12) 14px)",
    backgroundColor: rope,
    boxShadow: isActive
      ? `0 0 0 3px ${glow}, 0 6px 12px rgba(0,0,0,0.18)`
      : `0 4px 10px rgba(0,0,0,0.16)`,
    transition: "all .18s ease",
  } as React.CSSProperties;
}

function CrossInside() {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <span className="relative block w-5 h-5">
        <span
          className="absolute left-1/2 top-[1px] -translate-x-1/2 w-[4px] h-[18px] rounded-full"
          style={{ background: "rgba(255,255,255,0.92)" }}
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[4px] rounded-full"
          style={{ background: "rgba(255,255,255,0.92)" }}
        />
      </span>
    </span>
  );
}

type Props = {
  steps: RosaryStep[];
  current: number; // steps[index].index
  onSelect: (index: number) => void;
  setKey: MysterySetKey;
};

export default function RosaryTimeline({ steps, current, onSelect, setKey }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { rope } = useMemo(() => themeBySet(setKey), [setKey]);

  const TRACK_H = 96;
  const TRACK_H_MOBILE = 86;

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

  function nudge(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <div className="relative w-full">
      {/* Setas desktop */}
      <div className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <button
          type="button"
          onClick={() => nudge(-1)}
          className="h-10 w-10 rounded-full bg-white/90 border border-amber-200 shadow-sm text-gray-900 hover:bg-white"
          aria-label="Rolar para a esquerda"
        >
          ←
        </button>
      </div>

      <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <button
          type="button"
          onClick={() => nudge(1)}
          className="h-10 w-10 rounded-full bg-white/90 border border-amber-200 shadow-sm text-gray-900 hover:bg-white"
          aria-label="Rolar para a direita"
        >
          →
        </button>
      </div>

      {/* Wrapper */}
      <div className="bg-[#fffaf1] border border-amber-200 rounded-xl shadow-sm px-2 md:px-12">
        <div className="relative" style={{ height: TRACK_H_MOBILE }}>
          <style jsx>{`
            @media (min-width: 768px) {
              div[data-track="1"] {
                height: ${TRACK_H}px !important;
              }
            }
          `}</style>

          {/* Corda */}
          <div
            className="pointer-events-none absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[4px] rounded-full"
            style={{
              backgroundColor: rope,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0px, rgba(0,0,0,0.10) 14px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          />

          <div data-track="1" className="h-[86px] md:h-[96px]">
            <div
              ref={scrollerRef}
              className="h-full overflow-x-auto scroll-smooth px-1 md:px-2"
              style={{ scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}
            >
              {/* Slots com largura fixa: isso impede encavalamento */}
              <div className="h-full flex items-center min-w-max">
                {steps.map((s) => {
                  // Spacer
                  if (s.kind !== "bead") {
                    return (
                      <div
                        key={`sp-${s.index}`}
                        className="relative shrink-0"
                        style={{ width: 44, height: "100%" }}
                      />
                    );
                  }

                  const active = s.index === current;
                  const isCrossBead = s.beadStyle === "cross";
                  const isKnot = s.beadStyle === "knot";
                  const isOurFather = s.prayer === "ourFather";

                  const beadSize = isCrossBead ? 54 : isOurFather ? 52 : 46;
                  const beadWidth = isKnot ? 60 : beadSize;

                  // Espaço “real” entre contas = definido pelo SLOT
                  // (quanto maior o slot, mais afastadas ficam)
                  const slotPadding = isCrossBead ? 34 : isOurFather ? 30 : isKnot ? 26 : 20;

                  const slotWidth = beadWidth + slotPadding;

                  return (
                    <div
                      key={`slot-${s.index}`}
                      className="relative shrink-0"
                      style={{
                        height: "100%",
                        width: slotWidth,
                      }}
                    >
                      <button
                        data-step={s.index}
                        onClick={() => onSelect(s.index)}
                        title={s.label}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        style={{ scrollSnapAlign: "center" }}
                        type="button"
                      >
                        {isKnot ? (
                          <div style={knotStyle(active, setKey)} />
                        ) : (
                          <div style={beadWood(active, beadSize, setKey)} />
                        )}

                        {isCrossBead && <CrossInside />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="hidden md:block mt-2 text-xs text-gray-700">
        Dica: use as setas para rolar ou o scroll horizontal do mouse/trackpad.
      </p>
    </div>
  );
}
