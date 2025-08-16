import React from 'react';
import Image from 'next/image';

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Container do loading circular */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Animação circular */}
        <div className="absolute w-full h-full border-4 border-t-amber-950 border-gray-300 rounded-full animate-spin" />

        {/* Imagem do Tio Ben no centro */}
        <Image
          src="/images/ben-pesquisando-transparente.png" // caminho da imagem
          alt="Tio Ben estudando"
          width={96}
          height={96}
          className="rounded-full object-cover"
        />
      </div>

      {/* Texto abaixo */}
      <p className="text-lg font-medium text-gray-700">Pesquisando sua resposta...</p>
    </div>
  );
}