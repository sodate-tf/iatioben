import Link from "next/link";
import AdSense from "./Adsense";

export default function Footer(){
    return(
       <> 
       <AdSense adSlot="9591116531" />
        <footer className="bg-amber-100 text-center py-4 mt-8">
          <div id="ezoic-pub-ad-placeholder-103"></div>
          <Link href="http://www.iatioben.com.br/termo-de-responsabilidade" target="_blank" about="Termo de responsabilidade do site iaTioBen.com.br">Termo de responsabilidade</Link>
          <p className="text-gray-600 text-sm">
            Desenvolvido por <Link href="http://4udevelops.com.br" target="_blank" about="Desenvolvido por 4u Develops">4U Develops</Link> - Todos os direitos reservados
          </p>
        </footer>
        </>
    )
}