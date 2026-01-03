"use client";

import React from "react";
import type { MysterySetKey } from "./RosaryDataset";

type Props = {
  open: boolean;
  onClose: () => void;

  valueSet: MysterySetKey;
  onChangeSet: (k: MysterySetKey) => void;

  mode: "full" | "single";
  onChangeMode: (m: "full" | "single") => void;

  singleMysteryIndex: 1 | 2 | 3 | 4 | 5;
  onChangeSingleMysteryIndex: (i: 1 | 2 | 3 | 4 | 5) => void;
};

const SETS: { key: MysterySetKey; label: string }[] = [
  { key: "gozosos", label: "Gozosos" },
  { key: "dolorosos", label: "Dolorosos" },
  { key: "gloriosos", label: "Gloriosos" },
  { key: "luminosos", label: "Luminosos" },
];

export default function MysteryPickerModal(props: Props) {
  const {
    open,
    onClose,
    valueSet,
    onChangeSet,
    mode,
    onChangeMode,
    singleMysteryIndex,
    onChangeSingleMysteryIndex,
  } = props;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Escolher Mistérios"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-5xl rounded-t-3xl border border-amber-200 bg-white shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-amber-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Escolher mistérios
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                Selecione o conjunto e o modo de oração.
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

        <div className="p-4 sm:p-6 space-y-5">
          <section className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
            <p className="text-sm font-semibold text-gray-900">Conjunto</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SETS.map((s) => {
                const active = valueSet === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onChangeSet(s.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      active
                        ? "bg-amber-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
            <p className="text-sm font-semibold text-gray-900">Modo</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onChangeMode("full")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  mode === "full"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Terço completo (5 dezenas)
              </button>

              <button
                type="button"
                onClick={() => onChangeMode("single")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  mode === "single"
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Apenas 1 mistério (1 dezena)
              </button>
            </div>

            {mode === "single" && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-900">Qual mistério?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = singleMysteryIndex === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onChangeSingleMysteryIndex(n as any)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          active
                            ? "bg-amber-600 text-white"
                            : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {n}º
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="p-4 sm:p-6 border-t border-amber-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
