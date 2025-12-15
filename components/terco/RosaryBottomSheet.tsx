"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRAYERS, type Mystery, type PrayerKey } from "./RosaryDataset";

type Props = {
  prayerKey: PrayerKey;
  progressLabel: string;

  mystery: Mystery | null;

  onPrev: () => void;
  onNext: () => void;

  isFirst: boolean;
  isLast: boolean;

  showFinalCTA?: boolean;
  finalSuggestion?: string;
};

export default function RosaryBottomSheet({
  prayerKey,
  progressLabel,
  mystery,
  onPrev,
  onNext,
  isFirst,
  isLast,
  showFinalCTA,
  finalSuggestion,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const prayer = useMemo(() => PRAYERS[prayerKey], [prayerKey]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-4xl px-3 pb-3">
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden"
          initial={false}
          animate={{ height: expanded ? 520 : 170 }}
          transition={{ duration: 0.25 }}
        >
          {/* handle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex flex-col items-center py-2 bg-[#fffaf1] border-b border-amber-100"
            aria-label="Expandir ou recolher"
          >
            <div className="w-12 h-1.5 bg-amber-300 rounded-full mb-1" />
            <div className="text-xs text-gray-700">
              {expanded ? "Toque para recolher" : "Toque para expandir"}
            </div>
          </button>

          {/* content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {prayer.title}
                </h2>
                <p className="text-sm text-gray-700 mt-1">{progressLabel}</p>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-900"
                  onClick={onPrev}
                  disabled={isFirst}
                >
                  Voltar
                </button>
                <button
                  className="px-3 py-2 rounded-md bg-amber-600 text-white font-semibold"
                  onClick={onNext}
                  disabled={isLast}
                >
                  Rezei / Próxima
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 space-y-4"
                >
                  {/* oração completa */}
                  <div
                    className="p-4 bg-[#fffaf1] rounded-xl border border-amber-200"
                    style={{ lineHeight: "1.9" }}
                  >
                    <p className="whitespace-pre-line text-gray-900">
                      {prayer.text}
                    </p>
                  </div>

                  {/* reflexão */}
                  <div
                    className="p-4 bg-[#fffaf1] rounded-xl border border-amber-300"
                    style={{ lineHeight: "1.9" }}
                  >
                    <h3 className="font-bold text-amber-800">
                      Reflexão do Mistério
                    </h3>

                    {!mystery ? (
                      <p className="text-gray-900 mt-2">
                        Avance para entrar nas dezenas e meditar os mistérios.
                      </p>
                    ) : (
                      <>
                        <p className="mt-2 font-semibold text-gray-900">
                          {mystery.index}º Mistério: {mystery.title}
                        </p>
                        <p className="mt-2 text-gray-900">{mystery.shortReflection}</p>

                        <details className="mt-3">
                          <summary className="cursor-pointer font-semibold text-amber-800">
                            Aprofundar
                          </summary>
                          <p className="mt-2 text-gray-900">{mystery.longReflection}</p>
                        </details>

                        <p className="mt-3 text-gray-900">
                          <span className="font-semibold">Intenção:</span>{" "}
                          {mystery.intention}
                        </p>

                        <div className="mt-3">
                          <p className="font-semibold text-gray-900">
                            Referências bíblicas:
                          </p>
                          <ul className="list-disc pl-5 text-gray-900">
                            {mystery.scriptures.map((s, idx) => (
                              <li key={idx}>
                                <span className="font-semibold">{s.ref}</span>
                                {s.text ? ` — ${s.text}` : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA final */}
                  {showFinalCTA && finalSuggestion && (
                    <div
                      className="p-4 bg-[#fffaf1] rounded-xl border border-amber-300"
                      style={{ lineHeight: "1.9" }}
                    >
                      <h3 className="font-bold text-amber-800">Aprofunde com o Tio Ben</h3>
                      <p className="mt-2 text-gray-900">
                        <span className="font-semibold">Sugestão de pesquisa:</span>{" "}
                        {finalSuggestion}
                      </p>
                      <a
                        href="/"
                        className="inline-flex mt-3 px-4 py-2 rounded-md bg-amber-600 text-white font-semibold"
                      >
                        Ir para a Home do Tio Ben IA
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
