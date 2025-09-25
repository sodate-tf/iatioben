import { Metadata } from 'next';
import LiturgiaContent from '@/components/liturgiaClient';
import  createMetaData  from '@/components/createMetaData';

export const metadata: Metadata = createMetaData({
  title: 'Liturgia Diária - Tio Ben',
  description: 'Acompanhe a liturgia diária e mantenha-se em unidade com a Igreja, meditando as mesmas leituras proclamadas em todo o mundo.',
  url: 'https://www.iatioben.com.br/liturgia-diaria',
  image: 'https://www.iatioben.com.br/images/og_image_liturgia.png'
});

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-amber-400">
      <LiturgiaContent /> {/* CLIENT COMPONENT */}      
    </div>
  );
}
