"use client";

import React, { useEffect, useMemo } from "react";
import { PRAYERS, type PrayerKey } from "./RosaryDataset";

type Props = { open: boolean; onClose: () => void };

const ORDER: PrayerKey[] = [
  "openingBundle",
  "ourFather",
  "hailMary",
  "gloryFatima",
  "hailHolyQueen",
  "finalPrayer",
];

export default function PrayerManualModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  const items = useMemo(() => ORDER.filter((k) => Boolean(PRAYERS[k])), []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Manual das orações"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[calc(100%-2rem)] max-w-3xl
          bg-white rounded-3xl shadow-2xl border border-amber-200
          overflow-hidden max-h-[85vh] flex flex-col
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-amber-100 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Manual das orações
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Orações tradicionais para acompanhar o Santo Terço.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4 bg-white">
          {items.map((k) => {
            const p = PRAYERS[k];
            return (
              <section
                key={k}
                className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4 sm:p-5 font-reading"
                style={{ lineHeight: 1.9 }}
              >
                <h4 className="text-base font-extrabold text-amber-800">{p.title}</h4>
                <p className="mt-3 whitespace-pre-line text-gray-900">{p.text}</p>
              </section>
            );
          })}

          {items.length === 0 && (
            <div className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
              <p className="text-gray-900">
                Nenhuma oração encontrada no dataset.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t border-amber-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="button"
          >
            Voltar ao terço
          </button>
        </div>
      </div>
    </div>
  );
}
