// lib/web-stories/liturgia-source.ts

export type LiturgiaSection = {
  referencia?: string | null;
  texto?: string | null;
  textoHtml?: string | null;

  // usado no Salmo (sua normalize pode usar refrao/refraoSalmo/etc.)
  refrao?: string | null;

  // Permite campos extras sem quebrar tipagem
  [key: string]: unknown;
};

export type LiturgiaPayload = {
  primeiraLeitura?: LiturgiaSection | null;
  segundaLeitura?: LiturgiaSection | null;

  // se sua normalize retornar leituras em array
  leituras?: LiturgiaSection[] | null;

  salmo?: (LiturgiaSection & { refrao?: string | null }) | null;
  evangelho?: LiturgiaSection | null;

  // Permite outros campos que a API devolve
  [key: string]: unknown;
};
