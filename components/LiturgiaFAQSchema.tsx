import Script from "next/script";

interface LiturgiaFAQSchemaProps {
  dateFormatted: string; // ex: "terça-feira, 12 de dezembro de 2025"
  liturgiaTitulo: string;
}

export default function LiturgiaFAQSchema({
  dateFormatted,
  liturgiaTitulo,
}: LiturgiaFAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Qual é o Evangelho de hoje (${dateFormatted})?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `O Evangelho de hoje faz parte da liturgia "${liturgiaTitulo}". Você pode conferir a leitura completa do dia no site do Tio Ben.`
        }
      },
      {
        "@type": "Question",
        "name": "Onde posso ler a Liturgia Diária completa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Você pode ler a Liturgia Diária completa, com Evangelho, Salmo e Leituras, gratuitamente no site do Tio Ben, todos os dias."
        }
      },
      {
        "@type": "Question",
        "name": "O que é a Liturgia Diária?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Liturgia Diária é o conjunto de leituras bíblicas proclamadas diariamente pela Igreja Católica, incluindo Evangelho, Salmo e demais leituras."
        }
      },
      {
        "@type": "Question",
        "name": "A Liturgia Diária muda todos os dias?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim. A Liturgia Diária possui leituras próprias para cada dia do calendário litúrgico da Igreja."
        }
      },
      {
        "@type": "Question",
        "name": "O conteúdo do site do Tio Ben é atualizado diariamente?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim. O site do Tio Ben atualiza a Liturgia Diária automaticamente todos os dias, garantindo sempre o conteúdo correto e atualizado."
        }
      }
    ]
  };

  return (
    <Script
      id="liturgia-faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}
