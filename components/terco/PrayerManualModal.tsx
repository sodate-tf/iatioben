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
  // Fecha com ESC
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Trava scroll do body enquanto aberto
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // Evita "pulo" de layout ao sumir a scrollbar
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  const items = useMemo(() => ORDER.filter((k) => Boolean(PRAYERS[k])), []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Manual das orações"
      onMouseDown={(e) => {
        // clique no backdrop fecha
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal centralizado NO VIEWPORT (independente do scroll da página) */}
      <div
        className="
          fixed
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[calc(100%-2rem)]
          max-w-3xl
          bg-white
          rounded-2xl
          shadow-2xl
          border border-amber-200
          overflow-hidden
          max-h-[85vh]
          flex flex-col
        "
        onMouseDown={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
      >
        {/* Cabeçalho */}
        <div className="p-4 border-b border-amber-100 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-extrabold text-gray-900">
                Manual das orações
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Orações tradicionais para acompanhar o Santo Terço.
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                shrink-0
                h-10 w-10
                rounded-full
                bg-gray-100 border border-gray-200
                text-gray-900
                hover:bg-gray-50
                flex items-center justify-center
              "
              aria-label="Fechar"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        {/* Conteúdo (scroll SOMENTE aqui) */}
        <div
          className="
            p-4
            overflow-y-auto
            overscroll-contain
            space-y-4
            bg-white
          "
        >
          {items.map((k) => {
            const p = PRAYERS[k];
            return (
              <section
                key={k}
                className="p-4 bg-[#fffaf1] rounded-2xl border border-amber-200"
                style={{ lineHeight: "1.9" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-extrabold text-amber-800">{p.title}</h4>
                </div>

                <p className="whitespace-pre-line text-gray-900 mt-3">
                  {p.text}
                </p>
              </section>
            );
          })}

          {items.length === 0 && (
            <div className="p-4 bg-[#fffaf1] rounded-2xl border border-amber-200">
              <p className="text-gray-900">
                Nenhuma oração encontrada no dataset. Verifique as chaves em
                PRAYERS (ex.:{" "}
                <span className="font-semibold">openingBundle</span> e{" "}
                <span className="font-semibold">gloryFatima</span>).
              </p>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-amber-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700"
            type="button"
          >
            Voltar ao terço
          </button>
        </div>
      </div>
    </div>
  );
}
