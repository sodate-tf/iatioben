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

  nextLabel?: string;
  onOpenMore?: () => void;

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
  nextLabel,
  onOpenMore,
  showFinalCTA,
  finalSuggestion,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const prayer = useMemo(() => PRAYERS[prayerKey], [prayerKey]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-4xl px-3 pb-3">
        <motion.div
          className="rounded-2xl border border-amber-200 bg-white shadow-xl overflow-hidden"
          initial={false}
          animate={{ height: expanded ? 560 : 176 }}
          transition={{ duration: 0.22 }}
        >
          {/* Handle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex flex-col items-center py-2 bg-[#fffaf1] border-b border-amber-100"
            aria-label={expanded ? "Recolher detalhes" : "Expandir detalhes"}
            type="button"
          >
            <div className="w-12 h-1.5 bg-amber-300 rounded-full mb-1" />
            <div className="text-[11px] text-gray-700">
              {expanded ? "Toque para recolher" : "Toque para expandir"}
            </div>
          </button>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900 truncate">
                  {prayer.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 mt-1">
                  {progressLabel}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {onOpenMore && (
                  <button
                    type="button"
                    onClick={onOpenMore}
                    className="px-3 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50"
                  >
                    Mais
                  </button>
                )}

                <button
                  className="px-3 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                  onClick={onPrev}
                  disabled={isFirst}
                  type="button"
                >
                  Voltar
                </button>

                <button
                  className="px-3 py-2 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 disabled:opacity-50"
                  onClick={onNext}
                  disabled={isLast}
                  type="button"
                >
                  {nextLabel ?? "Rezei / Próxima"}
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
                  transition={{ duration: 0.18 }}
                  className="mt-4 space-y-4"
                >
                  {/* Oração completa */}
                  <div
                    className="p-4 bg-[#fffaf1] rounded-2xl border border-amber-200 font-reading"
                    style={{ lineHeight: "1.9" }}
                  >
                    <p className="whitespace-pre-line text-gray-900">
                      {prayer.text}
                    </p>
                  </div>

                  {/* Reflexão */}
                  <div
                    className="p-4 bg-[#fffaf1] rounded-2xl border border-amber-200 font-reading"
                    style={{ lineHeight: "1.9" }}
                  >
                    <h3 className="font-extrabold text-amber-900">
                      Meditação do mistério
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
                        <p className="mt-2 text-gray-900">
                          {mystery.shortReflection}
                        </p>

                        <details className="mt-3">
                          <summary className="cursor-pointer font-semibold text-amber-900">
                            Aprofundar
                          </summary>
                          <p className="mt-2 text-gray-900">
                            {mystery.longReflection}
                          </p>
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
                      className="p-4 bg-white rounded-2xl border border-amber-200"
                      style={{ lineHeight: "1.85" }}
                    >
                      <h3 className="font-extrabold text-gray-900">
                        Aprofunde com o Tio Ben
                      </h3>
                      <p className="mt-2 text-sm text-gray-800">
                        Sugestão de leitura/pesquisa no blog:{" "}
                        <span className="font-semibold">{finalSuggestion}</span>
                      </p>
                      <a
                        href="/blog"
                        className="inline-flex mt-3 px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700"
                      >
                        Ver conteúdos
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
