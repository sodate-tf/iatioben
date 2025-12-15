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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="w-full max-w-4xl bg-white rounded-t-2xl shadow-xl border border-amber-200">
        <div className="p-4 border-b border-amber-100">
          <h3 className="text-lg font-bold text-gray-900">Escolher Mistérios</h3>
          <p className="text-sm text-gray-700 mt-1">
            Selecione o conjunto e o modo de oração.
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="font-semibold text-gray-900 mb-2">Conjunto</p>
            <div className="flex flex-wrap gap-2">
              {SETS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => onChangeSet(s.key)}
                  className={`px-4 py-2 rounded-full ${
                    valueSet === s.key ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-2">Modo</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChangeMode("full")}
                className={`px-4 py-2 rounded-full ${
                  mode === "full" ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                Terço completo (5 dezenas)
              </button>
              <button
                onClick={() => onChangeMode("single")}
                className={`px-4 py-2 rounded-full ${
                  mode === "single" ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-900"
                }`}
              >
                Apenas 1 mistério (1 dezena)
              </button>
            </div>
          </div>

          {mode === "single" && (
            <div>
              <p className="font-semibold text-gray-900 mb-2">Qual mistério?</p>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => onChangeSingleMysteryIndex(n as any)}
                    className={`px-4 py-2 rounded-full ${
                      singleMysteryIndex === n ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {n}º
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-amber-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-900"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
