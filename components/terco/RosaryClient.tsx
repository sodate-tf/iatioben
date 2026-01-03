"use client";

import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import AdSensePro from "../adsensePro";

import {
  MYSTERIES,
  PRAYERS,
  OPENING_HAIL_MARY_MEDITATIONS,
  getDefaultMysterySetForWeekday,
  getFinalSuggestionBySet,
  type Mystery,
  type MysterySetKey,
} from "./RosaryDataset";

import { buildRosarySteps, type RosaryMode } from "./RosaryEngine";
import RosaryTimeline from "./RosaryTimeline";
import MysteryPickerModal from "./MysteryPickerModal";
import PrayerManualModal from "./PrayerManualModal";
import RosaryBottomSheet from "./RosaryBottomSheet";

type Props = { defaultSetKey?: MysterySetKey };

function weekdayLabelPT(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}
function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function slugFromSetKey(k: MysterySetKey) {
  switch (k) {
    case "gozosos":
      return "misterios-gozosos";
    case "dolorosos":
      return "misterios-dolorosos";
    case "gloriosos":
      return "misterios-gloriosos";
    case "luminosos":
    default:
      return "misterios-luminosos";
  }
}
function actionLabelFor(prayerKey: keyof typeof PRAYERS, isLast: boolean) {
  if (isLast) return "Finalizar";
  if (prayerKey === "openingBundle") return "Começar";
  if (prayerKey === "hailMary") return "Rezei";
  if (prayerKey === "gloryFatima") return "Concluir dezena";
  if (prayerKey === "hailHolyQueen" || prayerKey === "finalPrayer") return "Finalizar";
  return "Rezei / Próxima";
}

export default function RosaryClient({ defaultSetKey }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const today = useMemo(() => new Date(), []);
  const weekday = useMemo(() => capitalize(weekdayLabelPT(today)), [today]);
  const autoDefaultSet = useMemo(() => getDefaultMysterySetForWeekday(today), [today]);
  const initialSet = defaultSetKey ?? autoDefaultSet;

  const [setKey, setSetKey] = useState<MysterySetKey>(initialSet);
  const [mode, setMode] = useState<RosaryMode>("full");
  const [singleMysteryIndex, setSingleMysteryIndex] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [includeClosing, setIncludeClosing] = useState(true);

  const [hasInteracted, setHasInteracted] = useState(false);

  // Modais
  const [openPicker, setOpenPicker] = useState(false);
  const [openManual, setOpenManual] = useState(false);

  // Mobile: alterna Oração / Meditação
  const [mobileTab, setMobileTab] = useState<"prayer" | "reflection">("prayer");

  // Sticky height measurement (evita conteúdo ficar “por baixo” das contas fixas)
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [stickyH, setStickyH] = useState(0);

  useLayoutEffect(() => {
    if (!stickyRef.current) return;

    const el = stickyRef.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setStickyH(Math.max(0, Math.round(rect.height)));
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!defaultSetKey) return;
    setSetKey(defaultSetKey);
    setCurrent(0);
    setHasInteracted(false);
    setMobileTab("prayer");
  }, [defaultSetKey]);

  const steps = useMemo(
    () =>
      buildRosarySteps({
        set: setKey,
        mode,
        singleMysteryIndex,
        includeClosing,
      }),
    [setKey, mode, singleMysteryIndex, includeClosing]
  );

  const [current, setCurrent] = useState(0);
  const currentStep = steps[current];
  const currentPrayer = PRAYERS[currentStep.prayer];

  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  const nextLabel = useMemo(() => actionLabelFor(currentStep.prayer, isLast), [currentStep.prayer, isLast]);

  const progressLabel = useMemo(() => {
    const step = steps[current];
    const base = `Passo ${current + 1}/${steps.length}`;
    if (step.phase === "opening") return `${base} • Abertura`;
    if (step.phase === "closing") return `${base} • Encerramento`;
    const dec = step.decadeIndex ?? 1;
    const bead = step.beadInDecade;
    if (bead) return `${base} • Dezena ${dec}/5 • Ave-Maria ${bead}/10`;
    return `${base} • Dezena ${dec}/5`;
  }, [steps, current]);

  const openingMeditation = useMemo(() => {
    if (currentStep.phase !== "opening") return null;
    const label = currentStep.label || "";
    if (label.includes("Ave-Maria 1/3")) return OPENING_HAIL_MARY_MEDITATIONS.faith;
    if (label.includes("Ave-Maria 2/3")) return OPENING_HAIL_MARY_MEDITATIONS.hope;
    if (label.includes("Ave-Maria 3/3")) return OPENING_HAIL_MARY_MEDITATIONS.charity;
    return null;
  }, [currentStep.phase, currentStep.label]);

  const mysteryIndexForDisplay = useMemo<1 | 2 | 3 | 4 | 5 | null>(() => {
    if (currentStep.mysteryIndex) return currentStep.mysteryIndex;
    if (currentStep.decadeIndex) return currentStep.decadeIndex;

    for (let i = current; i >= 0; i--) {
      const mi = steps[i]?.mysteryIndex;
      if (mi) return mi;
      const di = steps[i]?.decadeIndex;
      if (di) return di;
    }
    return null;
  }, [current, currentStep.mysteryIndex, currentStep.decadeIndex, steps]);

  const mystery: Mystery | null = useMemo(() => {
    if (!mysteryIndexForDisplay) return null;
    return MYSTERIES[setKey].items.find((m) => m.index === mysteryIndexForDisplay) ?? null;
  }, [setKey, mysteryIndexForDisplay]);

  const finalSuggestion = useMemo(() => getFinalSuggestionBySet(setKey), [setKey]);

  function goNext() {
    setHasInteracted(true);
    setCurrent((c) => {
      let n = Math.min(c + 1, steps.length - 1);
      while (n < steps.length - 1 && steps[n]?.kind === "spacer") n++;
      return n;
    });
  }
  function goPrev() {
    setHasInteracted(true);
    setCurrent((c) => {
      let n = Math.max(c - 1, 0);
      while (n > 0 && steps[n]?.kind === "spacer") n--;
      return n;
    });
  }
  function reset() {
    setCurrent(0);
    setHasInteracted(false);
    setMobileTab("prayer");
  }

  function onChangeSetKey(k: MysterySetKey) {
    setSetKey(k);
    setCurrent(0);
    setHasInteracted(false);
    setMobileTab("prayer");
  }

  function navigateToSet(k: MysterySetKey) {
    const slug = slugFromSetKey(k);
    const target = `/santo-terco/${slug}`;
    if (pathname === target) return;
    router.push(target);
  }

  return (
    <div className="min-h-screen bg-amber-400">
      {/* Sticky topo: Contas + Tabs + atalhos */}
      <div ref={stickyRef} className="sticky top-0 z-40">
        {/* fundo para “tapar” conteúdo passando por baixo */}
        <div className="bg-amber-400 px-3 sm:px-6 pt-3">
          <section className="mx-auto w-full max-w-6xl rounded-2xl border border-amber-200 bg-white shadow-xl overflow-hidden">
            <div className="p-4 sm:p-5 bg-[#fffaf1] border-b border-amber-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-amber-800">Hoje</p>
                  <h1 className="mt-1 font-reading text-2xl sm:text-3xl font-extrabold text-gray-900 truncate">
                    {weekday}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-amber-900">
                      {MYSTERIES[setKey].label}
                    </span>
                    <Link
                      href="/liturgia-diaria"
                      className="inline-flex items-center rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-900 hover:bg-amber-50"
                    >
                      Liturgia
                    </Link>
                    <Link
                      href="/santo-terco"
                      className="inline-flex items-center rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-900 hover:bg-amber-50"
                    >
                      Hub do Terço
                    </Link>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => setOpenPicker(true)}
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-amber-50"
                    type="button"
                  >
                    Mistérios
                  </button>
                  <button
                    onClick={() => setOpenManual(true)}
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-amber-50"
                    type="button"
                  >
                    Orações
                  </button>
                </div>
              </div>
            </div>

            {/* Contas ocupando “tela” (sem causar vazio): sticky usa altura estável */}
            <div className="p-3 sm:p-5">
              <RosaryTimeline
                steps={steps}
                current={current}
                onSelect={(i) => {
                  setHasInteracted(true);
                  setCurrent(i);
                  // IMPORTANTÍSSIMO: sem scroll vertical
                }}
                setKey={setKey}
                highlight={!hasInteracted}
                variant="sticky"
              />

              {/* Menu fixo (mobile first): tabs + progresso + reiniciar */}
              <div className="mt-3">
                <div className="rounded-2xl border border-amber-200 bg-white p-2 shadow-sm">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileTab("prayer")}
                      className={
                        "flex-1 rounded-xl px-3 py-2 text-sm font-extrabold " +
                        (mobileTab === "prayer"
                          ? "bg-amber-600 text-white"
                          : "bg-[#fffaf1] text-gray-900 border border-amber-200")
                      }
                    >
                      Oração
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileTab("reflection")}
                      className={
                        "flex-1 rounded-xl px-3 py-2 text-sm font-extrabold " +
                        (mobileTab === "reflection"
                          ? "bg-amber-600 text-white"
                          : "bg-[#fffaf1] text-gray-900 border border-amber-200")
                      }
                    >
                      Meditação
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-gray-700">
                    <span className="truncate">{progressLabel}</span>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Reiniciar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pequena sombra/recorte para destacar sticky */}
          <div className="mx-auto max-w-6xl">
            <div className="h-3 bg-gradient-to-b from-amber-400/0 to-amber-400" />
          </div>
        </div>
      </div>

      {/* Conteúdo: empurrado para baixo da área sticky (sem espaço vazio) */}
      <div
        className="mx-auto w-full max-w-6xl px-3 sm:px-6 pb-28"
        style={{ paddingTop: Math.max(8, stickyH ? stickyH * 0.02 : 8) }}
      >
        {/* Acessibilidade */}
        <p className="sr-only" aria-live="polite">
          Etapa atual: {currentStep.label}. {progressLabel}.
        </p>

        {/* MOBILE: painel fluido (1 por vez) */}
        <div className="lg:hidden mt-4">
          {mobileTab === "prayer" ? (
            <motion.section
              key="prayer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="p-4 bg-[#fffaf1] border-b border-amber-100">
                <p className="text-xs font-semibold text-amber-800">Oração do momento</p>
                <h2 className="mt-1 text-lg font-extrabold text-gray-900">{currentStep.label}</h2>
              </div>
              <div className="p-4 font-reading" style={{ lineHeight: 1.9 }}>
                <div className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
                  <p className="whitespace-pre-line text-gray-950">{currentPrayer.text}</p>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="reflection"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="p-4 bg-[#fffaf1] border-b border-amber-100">
                <p className="text-xs font-semibold text-amber-800">Meditação</p>
                <h3 className="mt-1 text-lg font-extrabold text-gray-900">
                  {openingMeditation
                    ? openingMeditation.title
                    : mystery
                    ? `${mystery.index}º Mistério — ${mystery.title}`
                    : "Prepare o coração"}
                </h3>
              </div>
              <div className="p-4 font-reading" style={{ lineHeight: 1.9 }}>
                <div className="rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
                  {openingMeditation ? (
                    <>
                      <p className="text-gray-900">{openingMeditation.short}</p>
                      <details className="mt-3">
                        <summary className="cursor-pointer font-semibold text-amber-900">Aprofundar</summary>
                        <p className="mt-2 whitespace-pre-line text-gray-900">{openingMeditation.long}</p>
                      </details>
                    </>
                  ) : !mystery ? (
                    <p className="text-gray-900">Avance para entrar nas dezenas e meditar os mistérios.</p>
                  ) : (
                    <>
                      <p className="text-gray-900">{mystery.shortReflection}</p>
                      <details className="mt-3">
                        <summary className="cursor-pointer font-semibold text-amber-900">Aprofundar</summary>
                        <p className="mt-2 text-gray-900">{mystery.longReflection}</p>
                      </details>
                    </>
                  )}
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">Caminho de aprofundamento</p>
                  <p className="mt-2 text-sm text-gray-800" style={{ lineHeight: 1.75 }}>
                    Sugestão do Tio Ben para buscar no blog:{" "}
                    <span className="font-semibold">{finalSuggestion}</span>.
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex mt-3 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Ver no blog
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </div>

        {/* DESKTOP: 2 cards lado a lado */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 mt-6">
          <section className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 bg-[#fffaf1] border-b border-amber-100">
              <p className="text-xs font-semibold text-amber-800">Oração do momento</p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-900">{currentStep.label}</h2>
            </div>
            <div className="p-5 font-reading" style={{ lineHeight: 1.9 }}>
              <p className="whitespace-pre-line text-gray-950">{currentPrayer.text}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 bg-[#fffaf1] border-b border-amber-100">
              <p className="text-xs font-semibold text-amber-800">Meditação</p>
              <h3 className="mt-1 text-xl font-extrabold text-gray-900">
                {openingMeditation
                  ? openingMeditation.title
                  : mystery
                  ? `${mystery.index}º Mistério — ${mystery.title}`
                  : "Prepare o coração"}
              </h3>
            </div>
            <div className="p-5 font-reading" style={{ lineHeight: 1.9 }}>
              {openingMeditation ? (
                <>
                  <p className="text-gray-900">{openingMeditation.short}</p>
                  <details className="mt-4 rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
                    <summary className="cursor-pointer font-semibold text-amber-900">Aprofundar</summary>
                    <p className="mt-3 whitespace-pre-line text-gray-900">{openingMeditation.long}</p>
                  </details>
                </>
              ) : !mystery ? (
                <p className="text-gray-900">Avance para entrar nas dezenas e meditar os mistérios.</p>
              ) : (
                <>
                  <p className="text-gray-900">{mystery.shortReflection}</p>
                  <details className="mt-4 rounded-2xl border border-amber-200 bg-[#fffaf1] p-4">
                    <summary className="cursor-pointer font-semibold text-amber-900">Aprofundar</summary>
                    <p className="mt-3 text-gray-900">{mystery.longReflection}</p>
                    <p className="mt-3 text-gray-900">
                      <span className="font-semibold">Intenção:</span> {mystery.intention}
                    </p>
                  </details>
                </>
              )}

              <div className="mt-4 rounded-2xl border border-amber-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">Aprofunde com o Tio Ben</p>
                <p className="mt-2 text-sm text-gray-800" style={{ lineHeight: 1.75 }}>
                  Sugestão para buscar no blog: <span className="font-semibold">{finalSuggestion}</span>.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex mt-3 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                >
                  Ver no blog
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* ✅ ANÚNCIO: SEMPRE ABAIXO DO BLOCO (remove o “vazio” do meio) */}
        <div className="mt-4">
          <AdSensePro slot="2156366376" height={140} />
        </div>

        <div className="mt-4">
          <AdSensePro slot="2672028232" height={140} />
        </div>
      </div>

      {/* Bottom: navegação principal (continua ótima para UX) */}
      <RosaryBottomSheet
        prayerKey={currentStep.prayer}
        progressLabel={progressLabel}
        mystery={mystery}
        onPrev={goPrev}
        onNext={goNext}
        isFirst={isFirst}
        isLast={isLast}
        nextLabel={nextLabel}
        // Mantive “Mais” como atalho útil: abre Mistérios (rápido)
        onOpenMore={() => setOpenPicker(true)}
        showFinalCTA={isLast}
        finalSuggestion={finalSuggestion}
      />

      <MysteryPickerModal
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        valueSet={setKey}
        onChangeSet={(k) => {
          onChangeSetKey(k);
          navigateToSet(k);
        }}
        mode={mode}
        onChangeMode={(m) => {
          setMode(m);
          setCurrent(0);
          setHasInteracted(false);
        }}
        singleMysteryIndex={singleMysteryIndex}
        onChangeSingleMysteryIndex={(i) => {
          setSingleMysteryIndex(i);
          setCurrent(0);
          setHasInteracted(false);
        }}
      />

      <PrayerManualModal open={openManual} onClose={() => setOpenManual(false)} />
    </div>
  );
}
