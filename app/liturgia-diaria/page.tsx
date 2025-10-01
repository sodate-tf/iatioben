import { Metadata } from 'next';
import LiturgiaContent from '@/components/liturgiaClient';
import LiturgiaJsonLd from '@/components/liturgiaJsonLd';
import CreateMetaData from '@/components/createMetaData';
 interface CreateMetaDataOptions {
  date: Date; // Receber a data atual como parâmetro
}

export default function Page() {  
  return (
    <div className="flex flex-col min-h-screen bg-amber-400">
      <head>
          <CreateMetaData  />
      </head>
      <LiturgiaContent /> {/* CLIENT COMPONENT */}      
    </div>
  );
}
