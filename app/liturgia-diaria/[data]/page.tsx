"use client"
import LiturgiaContent from '@/components/liturgiaClient';
import { useParams } from 'next/navigation';

import LiturgiaJsonLd from '@/components/liturgiaJsonLd';
import CreateMetaData from '@/components/createMetaData';
 interface CreateMetaDataOptions {
  date: Date; // Receber a data atual como parâmetro
}
export default function Page() {  
   const params = useParams();
  const data = params?.data as string; // dd-mm-yyyy
  return (
    <>
    <head>
        <LiturgiaJsonLd date={data} />
        <CreateMetaData date={data} />
       </head>
    <div className="flex flex-col min-h-screen bg-amber-400">      
      <LiturgiaContent date={data} /> {/* CLIENT COMPONENT */}      
    </div>
    </>
  );
}
