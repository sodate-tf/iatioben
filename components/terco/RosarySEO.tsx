export default function RosarySEO() {
  const canonical = "https://www.iatioben.com.br/santo-terco";

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Santo Terço Diário",
    url: canonical,
    description:
      "Reze o Santo Terço passo a passo no celular: contas interativas, mistérios do dia, reflexões com referências bíblicas e manual de orações.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quais são os mistérios do terço de hoje?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Tradicionalmente: segunda e sábado (Gozosos), terça e sexta (Dolorosos), quarta e domingo (Gloriosos), quinta (Luminosos). Você pode escolher manualmente na página.",
        },
      },
      {
        "@type": "Question",
        name: "Como rezar o Santo Terço passo a passo?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Abertura: Sinal da Cruz, Creio, Pai-Nosso, 3 Ave-Marias e Glória ao Pai. Depois, em cada dezena: Pai-Nosso, 10 Ave-Marias, Glória ao Pai e Oração de Fátima. Ao final: Salve Rainha e oração final.",
        },
      },
      {
        "@type": "Question",
        name: "A Oração de Fátima é obrigatória?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Não. É uma oração tradicionalmente acrescentada após o Glória ao Pai no fim de cada dezena. Aqui ela está incluída no fluxo completo.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
