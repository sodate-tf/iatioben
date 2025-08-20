"use client"

import { Card, CardContent } from "@/components/ui/card"
import React from "react"
import TestBanner from "./testBanner"

export default function FaqTioBenEstilizado() {
  const blocos = [
    {
      titulo: "Quem é o Tio Ben? 👨‍🏫",
      texto: [
        "Oi! Eu sou o Tio Ben, seu catequista virtual! 😊 Tenho entre 20 e 30 anos e estou aqui para te acompanhar na sua caminhada de fé. Minha missão é responder suas dúvidas sempre com base na nossa rica tradição católica: a Bíblia Sagrada, o Catecismo da Igreja Católica, os documentos oficiais da Igreja e nossa bela Tradição apostólica.",
        "Gosto de conversar de forma simples e direta, como se já nos conhecêssemos há tempo! 😄 Acredito que a fé deve ser acessível a todos, então sempre procuro explicar as coisas de um jeito que você possa entender facilmente, seja qual for o seu nível de conhecimento sobre nossa religião.",
        "No final das nossas conversas, sempre sugiro materiais para você continuar estudando e crescendo na fé. Afinal, conhecer mais sobre Jesus e nossa Igreja é uma jornada linda que nunca termina! 📚✨",
      ],
    },
    {
      titulo: "Como você responde às perguntas? 🤔",
      texto: [
        "Todas as minhas respostas são fundamentadas exclusivamente no que nossa Igreja Católica ensina oficialmente! 📖 Uso a Bíblia Sagrada como fonte principal, complementada pelo Catecismo da Igreja Católica, documentos papais, concílios e nossa rica Tradição apostólica que vem desde os tempos dos apóstolos.",
        "Procuro sempre organizar minhas respostas em 3 ou 4 parágrafos para ficar bem claro e didático. Gosto de usar emojis para deixar nossa conversa mais calorosa e próxima! 😊 E no final, sempre indico leituras, documentos ou estudos que podem te ajudar a se aprofundar mais no assunto.",
        "Se você me perguntar algo que eu ainda não sei como responder com base na doutrina católica, sou honesto contigo: digo que 'não sei ainda como responder isso e vou pesquisar'. Prefiro a sinceridade do que dar uma resposta sem fundamento sólido na nossa fé.",
      ],
    },
    {
      titulo: "Que tipos de perguntas posso fazer? 🙏",
      texto: [
        "Você pode me perguntar sobre qualquer coisa relacionada à nossa fé católica! 🌟 Dúvidas sobre a Bíblia, os sacramentos, vida de santos, orações, liturgia, moral católica, vida espiritual, devoções... Enfim, tudo que envolve nossa rica tradição!",
        "Também posso te ajudar com questões do dia a dia vistas pela ótica católica: relacionamentos, família, trabalho, decisões importantes... A nossa fé ilumina todos os aspectos da vida! ✨ Gosto muito quando você traz situações práticas, porque assim posso mostrar como os ensinamentos de Jesus se aplicam no nosso cotidiano.",
        "Se você estiver passando por momentos difíceis ou delicados como luto, depressão, conflitos familiares, sempre te oriento com muito carinho, mas também sugiro que busque apoio de profissionais de saúde, um catequista presencial ou uma pessoa de confiança. A fé é fundamental, mas às vezes precisamos de ajuda especializada também! 🤗",
        "📖 Para estudar mais: Recomendo começar pelo Compêndio do Catecismo da Igreja Católica e pela leitura diária da Bíblia!",
      ],
    },
    {
      titulo: "Como você trata assuntos delicados? 💙",
      texto: [
        "Quando você me procura com questões sensíveis como depressão, pensamentos suicidas, abuso, violência ou qualquer situação que envolve sofrimento profundo, meu coração se enche de cuidado por você! 💙 Sempre respondo com base na doutrina católica, mas com todo carinho e delicadeza que essas situações pedem.",
        "Nossa Igreja tem uma riqueza imensa sobre o valor da vida humana, a dignidade da pessoa e o amor misericordioso de Deus. Compartilho esses ensinamentos sempre lembrando que você é amado infinitamente por Deus! ✨ Mas também tenho a responsabilidade de te orientar a buscar ajuda profissional adequada.",
        "Sempre sugiro que, além de fortalecer sua fé e oração, procure apoio de um psicólogo, psiquiatra, um catequista presencial ou uma pessoa de confiança que possa te acompanhar de perto. Deus age através das pessoas e dos profissionais que Ele coloca no nosso caminho! 🙏",
        "📖 Para estudar mais: Encíclica 'Evangelium Vitae' do Papa João Paulo II sobre o valor e a sacralidade da vida humana.",
      ],
    },
    {
      titulo: "Por que sempre falo como se já te conhecesse? 😊",
      texto: [
        "Porque acredito que na família de Deus não existem estranhos! 👨‍👩‍👧‍👦 Quando você me procura, sei que está buscando crescer na fé, e isso já nos conecta como irmãos em Cristo. Por isso falo contigo sempre na primeira pessoa, como um amigo que se importa genuinamente com você!",
        "Essa proximidade reflete o jeito de Jesus, que tratava as pessoas com intimidade e carinho, chamando-as pelo nome e conhecendo suas necessidades. Quero que você se sinta à vontade para compartilhar suas dúvidas, alegrias e preocupações comigo! 🤗",
        "Nossa conversa flui naturalmente porque estamos unidos pela mesma fé e pelo desejo de conhecer mais sobre Deus. É como conversar com aquele amigo catequista que está sempre disposto a te ouvir e orientar com base no que aprendemos de Jesus e da nossa Igreja! ✨",
        "📖 Para estudar mais: Evangelho de João, capítulos 14-17, onde Jesus fala da intimidade que Ele quer ter conosco!",
      ],
    },
    {
      titulo: "Como posso aproveitar melhor nossas conversas? 🌱",
      texto: [
        "Primeiro, venha sempre com o coração aberto e disposto a aprender! 💗 Não existe pergunta boba quando se trata da nossa fé. Seja específico nas suas dúvidas e compartilhe o contexto da sua situação - assim posso te dar orientações mais precisas e práticas.",
        "Aproveite as sugestões de estudo que sempre deixo no final! 📚 Elas são cuidadosamente escolhidas para complementar nossa conversa e te ajudar a se aprofundar no assunto. A fé cresce com conhecimento e oração, então quanto mais você estudar, mais rica será nossa próxima conversa!",
        "E lembre-se: eu estou aqui para te acompanhar nessa linda jornada de fé, mas nada substitui sua participação na comunidade católica local, nos sacramentos e no relacionamento pessoal com Jesus na oração! Somos uma Igreja, uma família, e crescemos juntos! 🏛️✨",
        "📖 Para estudar mais: 'Introdução ao Cristianismo' do Papa Emérito Bento XVI e participação ativa na sua paróquia local!",
      ],
    },
  ]

  return (
 <section className="max-w-6xl mx-auto px-4 py-12">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-10">
    Perguntas e Respostas sobre o Tio Ben 🙋‍♂️
  </h2>

  <div className="grid gap-6 md:grid-cols-2">
    {blocos.map((bloco, index) => (
      <>
        <Card className="border border-amber-300 bg-amber-50 shadow-lg hover:shadow-xl transition rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-amber-800 mb-3">{bloco.titulo}</h3>
            {bloco.texto.map((par, i) => (
              <p key={i} className="text-amber-900 mb-3 leading-relaxed">
                {par}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Inserir o TestBanner a cada 2 cards */}
        {(index + 1) % 2 === 0 && <TestBanner />}
      </>
    ))}
  </div>
</section>

  )
}
