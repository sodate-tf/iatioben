import LiturgiaContent from '@/components/liturgiaClient';
import CreateMetaData from '@/components/createMetaData';


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
