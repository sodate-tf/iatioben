"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShareIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"; // Heroicons mais bonitos

interface CalendarioLiturgiaProps {
  handleShare: () => void;
  onFontSizeChange?: (size: number) => void; // opcional: controlar fonte fora do componente
}

export default function CalendarioLiturgia({ handleShare, onFontSizeChange }: CalendarioLiturgiaProps) {
  const [fontSize, setFontSize] = useState(16);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const router = useRouter();

  const updateFontSize = (newSize: number) => {
    setFontSize(newSize);
    if (onFontSizeChange) onFontSizeChange(newSize);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // formato yyyy-mm-dd
    setSelectedDate(date);       // marca a data no calendário
    if (date) {
      const [yyyy, mm, dd] = date.split("-");
      router.push(`/liturgia-diaria/${dd}-${mm}-${yyyy}`);
    }
  };

  return (
    <div className="absolute -right-6 -top-8 flex flex-col items-center space-y-3 bg-white/90 p-4 rounded-lg shadow-lg w-38">
      {/* Botões em linha horizontal */}
      <div className="flex flex-col space-y-1 w-full">
        <button
          onClick={handleShare}
          className="flex justify-center items-center p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          title="Compartilhar"
        >
          <ShareIcon className="h-3 w-3" />
        </button>
        <div className="flex justify-between w-full">
          <button
            onClick={() => updateFontSize(Math.max(12, fontSize - 2))}
            className="flex justify-center items-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Diminuir fonte"
          >
            <MinusIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => updateFontSize(Math.min(24, fontSize + 2))}
            className="flex justify-center items-center p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Aumentar fonte"
          >
            <PlusIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Calendário */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="mt-1 w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer text-sm"
        title="Escolher data"
      />
    </div>
  );
}
