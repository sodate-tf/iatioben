// app/components/TermoResponsabilidade.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function TermoResponsabilidade() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-10">
        Termo de Responsabilidade
      </h1>

      <Card className="border border-amber-300 bg-amber-50 shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <p className="text-amber-900">
            <strong>Site:</strong> iatioben.com.br <br />
            <strong>Última atualização:</strong> Agosto de 2025
          </p>

          <h2 className="text-2xl font-semibold text-amber-800">1. Natureza do Serviço</h2>
          <p className="text-amber-900">
            O iatioben.com.br é um serviço de orientação espiritual baseado em inteligência artificial que oferece respostas fundamentadas exclusivamente na doutrina católica oficial, incluindo a Bíblia Sagrada, o Catecismo da Igreja Católica, documentos pontifícios e a Tradição apostólica.
          </p>
          <p className="text-amber-900 font-semibold">
            IMPORTANTE: Este serviço não substitui o acompanhamento presencial de um sacerdote, catequista qualificado, diretor espiritual ou profissionais da área da saúde. As respostas fornecidas têm caráter exclusivamente informativo e educativo sobre a fé católica.
          </p>

          <h2 className="text-2xl font-semibold text-amber-800">2. Limitações do Serviço</h2>
          <h3 className="text-xl font-semibold text-amber-800">2.1 Natureza Tecnológica</h3>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>O "Tio Ben" é um sistema de inteligência artificial e pode apresentar limitações ou erros interpretativos</li>
            <li>Respostas são geradas automaticamente com base em programação e bases de dados doutrinários</li>
            <li>Em caso de dúvidas complexas ou contradições, sempre consulte um sacerdote ou catequista presencial</li>
          </ul>

          <h3 className="text-xl font-semibold text-amber-800">2.2 Alcance das Orientações</h3>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>As respostas não constituem aconselhamento profissional médico, psicológico, jurídico ou financeiro</li>
            <li>Questões de foro íntimo, sacramental ou que exijam acompanhamento personalizado devem ser direcionadas a um sacerdote</li>
            <li>O serviço não realiza atendimento de emergência ou situações de risco iminente</li>
          </ul>

          <h2 className="text-2xl font-semibold text-amber-800">3. Situações que Exigem Ajuda Profissional</h2>
          <h3 className="text-xl font-semibold text-amber-800">3.1 Emergências</h3>
          <p className="text-amber-900">
            Em casos de:
          </p>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Pensamentos suicidas ou autolesão</li>
            <li>Violência doméstica ou abuso</li>
            <li>Crises psiquiátricas ou psicológicas graves</li>
            <li>Situações de risco à vida ou segurança</li>
          </ul>
          <p className="text-amber-900 font-semibold">PROCURE IMEDIATAMENTE:</p>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Centro de Valorização da Vida (CVV): 188</li>
            <li>SAMU: 192</li>
            <li>Polícia Militar: 190</li>
            <li>Bombeiros: 193</li>
            <li>Disque Direitos Humanos: 100</li>
          </ul>

          <h3 className="text-xl font-semibold text-amber-800">3.2 Acompanhamento Especializado</h3>
          <p className="text-amber-900">
            Para questões envolvendo saúde mental, relacionamentos complexos, vícios, luto patológico ou traumas, procure:
          </p>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Profissionais de saúde mental (psicólogos, psiquiatras)</li>
            <li>Seu pároco ou diretor espiritual</li>
            <li>Catequistas e agentes pastorais da sua comunidade</li>
            <li>Grupos de apoio especializados</li>
          </ul>

          <h2 className="text-2xl font-semibold text-amber-800">4. Uso Responsável</h2>
          <h3 className="text-xl font-semibold text-amber-800">4.1 Compromisso do Usuário</h3>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Ter mais de 18 anos ou contar com supervisão de responsável legal</li>
            <li>Compreender as limitações do serviço automatizado</li>
            <li>Não utilizar as respostas como única fonte para decisões importantes</li>
            <li>Buscar confirmação em fontes oficiais da Igreja quando necessário</li>
          </ul>

          <h3 className="text-xl font-semibold text-amber-800">4.2 Conteúdo das Perguntas</h3>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Mantenha o respeito e a dignidade cristã nas interações</li>
            <li>Evite conteúdo ofensivo, blasfemo ou contrário à moral católica</li>
            <li>Não compartilhe informações pessoais sensíveis desnecessariamente</li>
            <li>Lembre-se de que este não é um espaço para confissão sacramental</li>
          </ul>

          <h2 className="text-2xl font-semibold text-amber-800">5. Privacidade e Dados</h2>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li><strong>NÃO coletamos dados pessoais</strong> que permitam identificar usuários</li>
            <li><strong>NÃO armazenamos</strong> informações como nome, e-mail, telefone ou endereço</li>
            <li><strong>NÃO conseguimos identificar</strong> quem fez determinada pergunta</li>
            <li><strong>NÃO realizamos</strong> rastreamento individual de usuários</li>
          </ul>

          {/* Continue o mesmo padrão para os demais tópicos */}

          <p className="text-amber-900 mt-6 italic">
            *Que Nossa Senhora interceda por todos que buscam crescer na fé através desta ferramenta, e que o Espírito Santo conduza sempre nossos corações à verdade plena em Jesus Cristo.*
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
