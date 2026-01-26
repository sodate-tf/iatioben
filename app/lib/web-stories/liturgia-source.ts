export type LiturgiaSection = {
  referencia?: string | null;
  texto?: string | null;
  textoHtml?: string | null;
};

export type LiturgiaPayload = {
  // Ajuste conforme sua estrutura real:
  leituras?: LiturgiaSection[]; // leituras (exclui salmo/evangelho se você separa)
  salmo?: (LiturgiaSection & { refrao?: string | null }) | null;
  evangelho?: LiturgiaSection | null;

  // se você já tiver campos prontos, melhor ainda:
  primeiraLeitura?: LiturgiaSection | null;
  segundaLeitura?: LiturgiaSection | null;
};

export async function fetchLiturgiaByDate(isoDate: string): Promise<LiturgiaPayload> {
  /**
   * OPÇÃO A (recomendado): chamar sua lib interna (sem HTTP)
   * return await getLiturgiaNormalized(isoDate)
   *
   * OPÇÃO B: chamar seu endpoint existente (HTTP)
   */
  const base = process.env.LITURGIA_INTERNAL_API_URL;
  if (!base) {
    // fallback seguro para você nunca ficar sem retorno em dev
    return {
      primeiraLeitura: { referencia: "Leitura", texto: "Conteúdo não configurado." },
      salmo: { referencia: "Salmo", refrao: "Refrão", texto: "Conteúdo não configurado." },
      evangelho: { referencia: "Evangelho", texto: "Conteúdo não configurado." }
    };
  }

  const url = base.replace("{date}", isoDate);
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao buscar liturgia (${res.status}) em ${url}: ${txt.slice(0, 200)}`);
  }
  return (await res.json()) as LiturgiaPayload;
}
