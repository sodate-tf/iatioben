import React from 'react';

const AdsenseScriptLoader = () => {
  // Apenas renderiza o componente no ambiente do navegador (client-side)
  // para evitar problemas de compilação no servidor.
  if (typeof window === 'undefined') {
    return null;
  }

  // A tag <script> padrão não tem o atributo "strategy".
  // Usamos apenas "async" para carregar o script de forma assíncrona.
  return (
    <>
      <script
        id="adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
      />
      
    </>
  );
};

export default AdsenseScriptLoader;
