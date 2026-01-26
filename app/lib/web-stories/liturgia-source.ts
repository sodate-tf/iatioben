// app/lib/web-stories/liturgia-source.ts
// Tipos flexíveis: suportam tanto o RAW da API quanto seu normalizado (leiturasFull).

export type LiturgiaSection = {
  referencia?: string;
  titulo?: string;
  texto?: string;
  textoHtml?: string;
  refrao?: string; // salmo
};

export type LiturgiaLeiturasBlock = {
  primeiraLeitura?: LiturgiaSection[];
  segundaLeitura?: LiturgiaSection[];
  salmo?: LiturgiaSection[];
  evangelho?: LiturgiaSection[];
  extras?: LiturgiaSection[];
};

export type LiturgiaLike = {
  // Normalizado (seu tipo LiturgiaNormalized)
  dateISO?: string;
  dateLabel?: string;
  celebration?: string;
  color?: string;

  primeiraRef?: string;
  salmoRef?: string;
  segundaRef?: string;
  evangelhoRef?: string;

  leiturasFull?: LiturgiaLeiturasBlock;

  // RAW (liturgia.up.railway)
  liturgia?: string;
  cor?: string;
  leituras?: LiturgiaLeiturasBlock;

  // fallback “solto”
  primeiraLeitura?: LiturgiaSection[];
  segundaLeitura?: LiturgiaSection[];
  salmo?: LiturgiaSection[];
  evangelho?: LiturgiaSection[];

  [key: string]: unknown;
};

// ✅ Para compatibilidade com o builder antigo
export type LiturgiaPayload = LiturgiaLike;
