import type { Metadata } from 'next';
import HomePageClient from '../app/page';

export const metadata: Metadata = {
  title: 'Pergunte ao Tio Ben - O Catequista Virtual Católico',
  description:
    'Use nossa inteligência artificial católica para tirar dúvidas sobre a fé e aprender com segurança. Baseada na Bíblia, Catecismo e Liturgia, nossa IA está pronta para responder suas perguntas.',
  keywords: [
    'inteligência artificial católica',
    'ia católica',
    'catequista virtual',
    'respostas católicas',
    'dúvidas católicas',
    'doutrina católica',
    'Bíblia',
    'Catecismo',
    'Liturgia',
    'Liturgia diária',
    'fé católica',
    'aprender sobre a fé',
  ],
  openGraph: {
    title: 'Pergunte ao Tio Ben - O Catequista Virtual Católico',
    description:
      'Use nossa inteligência artificial católica para tirar dúvidas sobre a fé e aprender com segurança. Baseada na Bíblia, Catecismo e Liturgia, nossa IA está pronta para responder suas perguntas.',
    url: 'https://www.iatioben.com.br',
    siteName: 'Pergunte ao Tio Ben',
    locale: 'pt_BR',
    type: 'website',
  },
};
export default function Home() {
  return <HomePageClient />;
}
