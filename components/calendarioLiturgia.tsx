"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShareIcon,
  MinusIcon,
  PlusIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

/* ================= PROPS ================= */

interface CalendarioLiturgiaProps {
  handleShare: () => void;
  onFontSizeChange?: (size: number) => void;

  /** slug de hoje: dd-mm-yyyy */
  todaySlug: string;

  /** label de hoje: ex. "Terça-feira, 30 de dezembro de 2025" */
  todayLabel: string;

  /** força o input iniciar em hoje */
  defaultToToday?: boolean;
}

/* ================= HELPERS ================= */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isoToSlug(iso: string) {
  // yyyy-mm-dd -> dd-mm-yyyy
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

/* ================= COMPONENTE ================= */

export default function CalendarioLiturgia({
  handleShare,
  onFontSizeChange,
  todaySlug,
  todayLabel,
  defaultToToday = true,
}: CalendarioLiturgiaProps) {
  const router = useRouter();

  const MIN_FONT = 14;
  const MAX_FONT = 24;

  const [fontSize, setFontSize] = useState(16);
  const [selectedISO, setSelectedISO] = useState<string>("");

  /* ===== Inicializa sempre em HOJE ===== */
  useEffect(() => {
    if (!defaultToToday) return;
    setSelectedISO(todayISO());
  }, [defaultToToday]);

  const selectedSlug = useMemo(
    () => (selectedISO ? isoToSlug(selectedISO) : ""),
    [selectedISO]
  );

  const isTodaySelected = selectedSlug === todaySlug;

  /* ================= ACTIONS ================= */

  const updateFontSize = (size: number) => {
    const clamped = Math.min(MAX_FONT, Math.max(MIN_FONT, size));
    setFontSize(clamped);
    onFontSizeChange?.(clamped);
  };

  const goToISO = (iso: string) => {
    const slug = isoToSlug(iso);
    router.push(`/liturgia-diaria/${slug}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value;
    setSelectedISO(iso);
    if (iso) goToISO(iso);
  };

  const handleGoToday = () => {
    setSelectedISO(todayISO());
    router.push("/liturgia-diaria");
  };

  /* ================= RENDER ================= */

  return (
    <div
      className="
        w-full
        rounded-2xl
        border border-amber-100
        bg-white/90
        backdrop-blur-sm
        shadow-sm
        px-3 py-2
        text-gray-900
      "
      aria-label="Ferramentas da liturgia diária"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Ações principais */}
        <div className="flex items-center gap-2">
          {/* Compartilhar */}
          <button
            onClick={handleShare}
            className="
              h-10 w-10
              inline-flex items-center justify-center
              rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white
              transition
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
            title="Compartilhar liturgia"
            aria-label="Compartilhar liturgia"
          >
            <ShareIcon className="h-5 w-5" />
          </button>

          {/* Fonte */}
          <div className="inline-flex items-center rounded-xl border border-amber-100 bg-white overflow-hidden">
            <button
              onClick={() => updateFontSize(fontSize - 2)}
              disabled={fontSize <= MIN_FONT}
              className="h-10 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 disabled:opacity-50"
              aria-label="Diminuir fonte"
            >
              <MinusIcon className="h-5 w-5" />
            </button>

            <span className="px-2 text-xs font-semibold text-gray-900 select-none">
              {fontSize}px
            </span>

            <button
              onClick={() => updateFontSize(fontSize + 2)}
              disabled={fontSize >= MAX_FONT}
              className="h-10 w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 disabled:opacity-50"
              aria-label="Aumentar fonte"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="flex items-center gap-2">
          {/* Hoje */}
          <button
            onClick={handleGoToday}
            className={[
              "h-10 px-3 rounded-xl border font-semibold transition whitespace-nowrap inline-flex items-center gap-2",
              isTodaySelected
                ? "bg-amber-200 border-amber-300 text-gray-900"
                : "bg-white border-amber-200 text-gray-800 hover:bg-amber-50",
            ].join(" ")}
            aria-label={`Ir para a liturgia de hoje (${todayLabel})`}
            title={`Hoje — ${todayLabel}`}
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Hoje
          </button>

          {/* Input date */}
          <input
            type="date"
            value={selectedISO}
            onChange={handleDateChange}
            className="
              h-10
              px-3
              rounded-xl
              border border-amber-100
              bg-gray-50 hover:bg-gray-100
              text-gray-900
              cursor-pointer
              text-sm
              focus:outline-none focus:ring-2 focus:ring-amber-200
            "
            aria-label="Escolher data da liturgia"
            title="Escolher data da liturgia"
          />
        </div>
      </div>

      {/* Hint com label do dia (UX) */}
      <p className="mt-2 text-xs text-gray-700">
        <span className="font-semibold text-gray-900">Hoje:</span> {todayLabel}
      </p>
    </div>
  );
}
