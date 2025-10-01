"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShareIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface CalendarioLiturgiaProps {
  handleShare: () => void;
  onFontSizeChange?: (size: number) => void;
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
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      const [yyyy, mm, dd] = date.split("-");
      router.push(`/liturgia-diaria/${dd}-${mm}-${yyyy}`);
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-white/90 p-2 rounded-lg shadow-md mb-4 space-x-2">
      
      {/* Botão Compartilhar */}
      <button
        onClick={handleShare}
        className="flex justify-center items-center p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        title="Compartilhar"
      >
        <ShareIcon className="h-5 w-5" />
      </button>

      {/* Controle de Fonte */}
      <div className="flex items-center space-x-1">
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

      {/* Input de Data */}
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="px-2 py-1 text-gray-950 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer text-sm"
        title="Escolher data"
      />
    </div>
  );
}
