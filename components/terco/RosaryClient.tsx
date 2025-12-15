"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  type MysterySetKey,
  type Mystery,
} from "./RosaryDataset";

import { buildRosarySteps, type RosaryMode } from "./RosaryEngine";
import RosaryTimeline from "./RosaryTimeline";
import RosaryProgress from "./RosaryProgress";
import MysteryPickerModal from "./MysteryPickerModal";
import PrayerManualModal from "./PrayerManualModal";

type Props = {
  /** Se informado, força o conjunto inicial (para rotas /misterios-*) */
  defaultSetKey?: MysterySetKey;
};

function weekdayLabelPT(d: Date) {
  return d.toLocaleDateString("pt-BR", { weekday: "long" });
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function themeBySet(setKey: MysterySetKey) {
  switch (setKey) {
    case "gozosos":
      return {
        chipBg: "bg-emerald-50",
        chipBorder: "border-emerald-200",
        chipText: "text-emerald-900",
        accentBg: "bg-emerald-600",
        accentText: "text-white",
        accentRing: "focus:ring-emerald-500",
        subtleLine: "from-emerald-200/70 via-amber-200/70 to-white/0",
      };
    case "dolorosos":
      return {
        chipBg: "bg-rose-50",
        chipBorder: "border-rose-200",
        chipText: "text-rose-900",
        accentBg: "bg-rose-700",
        accentText: "text-white",
        accentRing: "focus:ring-rose-500",
        subtleLine: "from-rose-200/70 via-amber-200/70 to-white/0",
      };
    case "gloriosos":
      return {
        chipBg: "bg-yellow-50",
        chipBorder: "border-yellow-200",
        chipText: "text-yellow-900",
        accentBg: "bg-amber-600",
        accentText: "text-white",
        accentRing: "focus:ring-amber-500",
        subtleLine: "from-yellow-200/70 via-amber-200/70 to-white/0",
      };
    case "luminosos":
    default:
      return {
        chipBg: "bg-sky-50",
        chipBorder: "border-sky-200",
        chipText: "text-sky-900",
        accentBg: "bg-sky-700",
        accentText: "text-white",
        accentRing: "focus:ring-sky-500",
        subtleLine: "from-sky-200/70 via-amber-200/70 to-white/0",
      };
  }
}

function meaningBySet(setKey: MysterySetKey) {
  switch (setKey) {
    case "gozosos":
      return {
        title: "O que são os Mistérios Gozosos?",
        text:
          "Eles contemplam a alegria discreta do início da salvação: o ‘sim’ de Maria, o nascimento de Jesus e a vida escondida em Nazaré. É um terço para pedir humildade, acolhimento da vontade de Deus e alegria interior que não depende das circunstâncias.",
        keywords:
          "alegria, humildade, obediência, vida familiar, simplicidade, confiança",
      };
    case "dolorosos":
      return {
        title: "O que são os Mistérios Dolorosos?",
        text:
          "Eles contemplam a Paixão do Senhor: a entrega, a obediência na dor e o amor que perdoa. É um terço para conversão, perseverança, reparação e para aprender a unir sofrimento e cruz ao amor redentor de Cristo.",
        keywords:
          "conversão, compaixão, penitência, perdão, entrega, perseverança",
      };
    case "gloriosos":
      return {
        title: "O que são os Mistérios Gloriosos?",
        text:
          "Eles contemplam a vitória de Deus: Ressurreição, Ascensão, Pentecostes e a esperança do céu. É um terço para renovar a fé na vida eterna, pedir alegria pascal, dons do Espírito Santo e coragem para viver como testemunha.",
        keywords: "esperança, vitória, Espírito Santo, missão, vida nova, céu",
      };
    case "luminosos":
    default:
      return {
        title: "O que são os Mistérios Luminosos?",
        text:
          "Eles contemplam a ‘luz’ da vida pública de Jesus: sua revelação, seus sinais e a Eucaristia. É um terço para buscar verdade, conversão, escuta do Evangelho e uma vida mais centrada em Cristo e na presença real na Eucaristia.",
        keywords:
          "luz, verdade, conversão, discipulado, Evangelho, Eucaristia",
      };
  }
}

export default function RosaryClient({ defaultSetKey }: Props) {
  const today = useMemo(() => new Date(), []);
  const weekday = useMemo(() => capitalize(weekdayLabelPT(today)), [today]);
  const autoDefaultSet = useMemo(
    () => getDefaultMysterySetForWeekday(today),
    [today]
  );

  // Se veio defaultSetKey (rota /misterios-*), ele manda.
  const initialSet = defaultSetKey ?? autoDefaultSet;

  const reflectionRef = useRef<HTMLDivElement | null>(null);

  const [setKey, setSetKey] = useState<MysterySetKey>(initialSet);
  const [mode, setMode] = useState<RosaryMode>("full");
  const [singleMysteryIndex, setSingleMysteryIndex] = useState<
    1 | 2 | 3 | 4 | 5
  >(1);
  const [includeClosing, setIncludeClosing] = useState(true);

  // Se mudar de rota e defaultSetKey mudar, reseta para o conjunto da rota.
  useEffect(() => {
    if (!defaultSetKey) return;
    setSetKey(defaultSetKey);
    setCurrent(0);
    // opcional: resetar modo
    // setMode("full");
  }, [defaultSetKey]);

  const theme = useMemo(() => themeBySet(setKey), [setKey]);
  const meaning = useMemo(() => meaningBySet(setKey), [setKey]);

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

  const [openPicker, setOpenPicker] = useState(false);
  const [openManual, setOpenManual] = useState(false);

  const currentStep = steps[current];
  const currentPrayer = PRAYERS[currentStep.prayer];

  const openingMeditation = useMemo(() => {
    if (currentStep.phase !== "opening") return null;

    const label = currentStep.label || "";
    if (label.includes("Ave-Maria 1/3"))
      return OPENING_HAIL_MARY_MEDITATIONS.faith;
    if (label.includes("Ave-Maria 2/3"))
      return OPENING_HAIL_MARY_MEDITATIONS.hope;
    if (label.includes("Ave-Maria 3/3"))
      return OPENING_HAIL_MARY_MEDITATIONS.charity;

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
    return (
      MYSTERIES[setKey].items.find((m) => m.index === mysteryIndexForDisplay) ||
      null
    );
  }, [setKey, mysteryIndexForDisplay]);

  useEffect(() => {
    if (currentStep.prayer === "gloryFatima" && currentStep.phase === "decade") {
      const timer = setTimeout(() => {
        reflectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStep.prayer, currentStep.phase]);

  const isLast = current === steps.length - 1;
  const finalSuggestion = useMemo(
    () => getFinalSuggestionBySet(setKey),
    [setKey]
  );

  function goNext() {
    setCurrent((c) => {
      let n = Math.min(c + 1, steps.length - 1);
      while (n < steps.length - 1 && steps[n]?.kind === "spacer") n++;
      return n;
    });
  }

  function goPrev() {
    setCurrent((c) => {
      let n = Math.max(c - 1, 0);
      while (n > 0 && steps[n]?.kind === "spacer") n--;
      return n;
    });
  }

  function reset() {
    setCurrent(0);
  }

  function onChangeSetKey(k: MysterySetKey) {
    setSetKey(k);
    setCurrent(0);
  }

  const router = useRouter();
const pathname = usePathname();
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

function navigateToSet(k: MysterySetKey) {
  const slug = slugFromSetKey(k);
  const target = `/santo-terco/${slug}`;

  // evita push redundante
  if (pathname === target) return;

  router.push(target);
}

  return (
    <div className="min-h-screen bg-amber-400 relative">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            Santo Terço Diário
          </h1>
          <p className="mt-2 text-gray-700">
            Reze passo a passo com orações visíveis, progresso e meditação do
            mistério.
          </p>
        </motion.div>

        <AdSensePro slot="2156366376" height={140} />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl shadow-lg p-4 md:p-8 w-full mt-6"
        >
          {/* CABEÇALHO (igual ao seu) */}
          <header className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-[#fffaf1]">
              <div className={`h-1 w-full bg-gradient-to-r ${theme.subtleLine}`} />

              <div className="p-5 md:p-7">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-800 tracking-wide">
                      Hoje
                    </p>

                    <h2 className="mt-1 text-xl md:text-2xl font-extrabold text-gray-900">
                      {weekday}
                    </h2>

                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-semibold">{MYSTERIES[setKey].label}</span>
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border ${theme.chipBg} ${theme.chipBorder}`}
                  >
                    <span className={`text-xs font-semibold ${theme.chipText}`}>
                      Terço do dia
                    </span>
                    <span className="text-xs text-gray-700">padrão aplicado</span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-800" style={{ lineHeight: "1.75" }}>
                  Reze com calma e presença. As orações ficam sempre visíveis e a
                  meditação do mistério permanece durante toda a dezena — inclusive
                  no <span className="font-semibold">Glória</span>.
                </p>

                <div className="mt-4 rounded-xl border border-amber-200 bg-white/60 p-4">
                  <p className="text-sm font-semibold text-gray-900">{meaning.title}</p>
                  <p className="mt-2 text-sm text-gray-800" style={{ lineHeight: "1.75" }}>
                    {meaning.text}
                  </p>
                  <p className="mt-2 text-xs text-gray-700">
                    Temas: <span className="font-semibold">{meaning.keywords}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <label className="text-xs font-semibold text-gray-800">
                  Escolha o terço para rezar
                </label>

                <div className="mt-2 flex flex-col md:flex-row gap-3 md:items-center">
                  <select
  value={setKey}
  onChange={(e) => {
    const k = e.target.value as MysterySetKey;

    // atualiza estado (mantém UI responsiva imediatamente)
    onChangeSetKey(k);

    // redireciona para a nova rota
    navigateToSet(k);
  }}
  className={`w-full md:flex-1 px-4 py-3 rounded-xl border border-amber-200 bg-[#fffaf1] text-gray-900 outline-none focus:ring-2 ${theme.accentRing}`}
>
  <option value="gozosos">Mistérios Gozosos</option>
  <option value="dolorosos">Mistérios Dolorosos</option>
  <option value="gloriosos">Mistérios Gloriosos</option>
  <option value="luminosos">Mistérios Luminosos</option>
</select>


                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link
                      href="/liturgia-diaria"
                      target="_blank"
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50"
                    >
                      Liturgia de hoje
                    </Link>

                    <button
                      onClick={() => setOpenManual(true)}
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50"
                      type="button"
                    >
                      Manual das orações
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-600">
                  Dica: por padrão, abrimos o terço do dia. Você pode mudar e rezar qualquer conjunto.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm text-gray-800">
                    <span className="font-semibold text-amber-800">Ritmo:</span>{" "}
                    avance quando terminar a oração atual.
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={goPrev}
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50"
                      type="button"
                    >
                      Voltar
                    </button>

                    <button
                      onClick={goNext}
                      className={`px-4 py-2 rounded-full ${theme.accentBg} ${theme.accentText} font-semibold text-sm`}
                      type="button"
                    >
                      Rezei / Próxima
                    </button>

                    <button
                      onClick={reset}
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-900 text-sm border border-gray-200 hover:bg-gray-50"
                      type="button"
                    >
                      Reiniciar
                    </button>

                    <label className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#fffaf1] border text-gray-900 border-amber-200 text-sm">
                      <input
                        type="checkbox"
                        checked={includeClosing}
                        onChange={(e) => setIncludeClosing(e.target.checked)}
                      />
                      Encerramento
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* PROGRESSO */}
          <div className="mt-6 p-4 bg-[#fffaf1] rounded-xl border border-amber-200">
            <p className="text-sm text-gray-900">
              <span className="font-semibold text-amber-800">Progresso:</span>{" "}
              <RosaryProgress steps={steps} current={current} />
            </p>
          </div>

          {/* ORAÇÃO ATUAL */}
          <div
            ref={reflectionRef}
            className="mt-4 p-6 bg-[#fffaf1] rounded-xl border border-amber-200 shadow-sm max-w-3xl mx-auto font-reading"
            style={{ lineHeight: "1.9" }}
          >
            <p className="text-xs font-semibold text-amber-800">Oração atual</p>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1">
              {currentStep.label}
            </h2>
            <p className="mt-3 whitespace-pre-line text-gray-700">{currentPrayer.text}</p>
          </div>

          {/* TIMELINE */}
          <div className="mt-4">
            <p className="text-xs text-gray-700 mb-2">
              Toque nas contas para navegar. A conta atual fica destacada.
            </p>

            <RosaryTimeline
              steps={steps}
              current={current}
              onSelect={setCurrent}
              setKey={setKey}
            />
          </div>

          {/* REFLEXÃO */}
          <div
            className="mt-4 p-6 bg-[#fffaf1] rounded-xl border border-amber-200 shadow-sm max-w-3xl mx-auto font-reading"
            style={{ lineHeight: "1.9" }}
          >
            <p className="text-xs font-semibold text-amber-800">Reflexão</p>

            {openingMeditation ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  {openingMeditation.title}
                </h3>

                <p className="mt-3 text-gray-900">{openingMeditation.short}</p>

                <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200">
                  <p className="font-semibold text-amber-800">Aprofundar</p>
                  <p className="mt-2 text-gray-900 whitespace-pre-line">
                    {openingMeditation.long}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-gray-900">
                    Referências bíblicas:
                  </p>
                  <ul className="list-disc pl-5 text-gray-900">
                    {openingMeditation.scriptures.map((s, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{s.ref}</span>
                        {s.text ? ` — ${s.text}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : mystery ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  {mystery.index}º Mistério • {mystery.title}
                </h3>

                <p className="mt-3 text-gray-900">{mystery.shortReflection}</p>

                <div className="mt-4 p-4 bg-white rounded-xl border border-amber-200">
                  <p className="font-semibold text-amber-800">Aprofundar</p>
                  <p className="mt-2 text-gray-900">{mystery.longReflection}</p>
                </div>

                <p className="mt-4 text-gray-900">
                  <span className="font-semibold">Intenção:</span>{" "}
                  {mystery.intention}
                </p>

                <div className="mt-4">
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
            ) : (
              <p className="mt-2 text-gray-900">
                Na abertura do terço, recolha o coração e reze com atenção. Ao
                iniciar a primeira dezena (Pai-Nosso), a meditação do mistério
                correspondente aparecerá aqui e permanecerá durante toda a
                dezena, incluindo o Glória + Oração de Fátima.
              </p>
            )}
          </div>

          {/* CTA FINAL */}
          {isLast && (
            <div
              className="mt-8 p-6 bg-[#fffaf1] rounded-xl border border-amber-300 text-gray-900 font-reading max-w-3xl mx-auto"
              style={{ lineHeight: "1.9" }}
            >
              <h4 className="font-bold text-amber-800 mb-2">
                Aprofunde com o Tio Ben
              </h4>
              <p className="mt-2">
                <span className="font-semibold">Sugestão de pesquisa:</span>{" "}
                {finalSuggestion}
              </p>
              <div className="mt-4">
                <Link
                  href="/"
                  className={`inline-flex items-center justify-center px-4 py-2 rounded-md ${theme.accentBg} ${theme.accentText} font-semibold`}
                >
                  Ir para a Home do Tio Ben IA
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        <AdSensePro slot="2672028232" height={140} />
      </div>

      {/* Modais */}
      <MysteryPickerModal
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        valueSet={setKey}
        onChangeSet={(k) => {
          setSetKey(k);
          setCurrent(0);
        }}
        mode={mode}
        onChangeMode={(m) => {
          setMode(m);
          setCurrent(0);
        }}
        singleMysteryIndex={singleMysteryIndex}
        onChangeSingleMysteryIndex={(i) => {
          setSingleMysteryIndex(i);
          setCurrent(0);
        }}
      />

      <PrayerManualModal open={openManual} onClose={() => setOpenManual(false)} />
    </div>
  );
}
