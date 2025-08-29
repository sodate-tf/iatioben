import Image from "next/image";
import Link from "next/link";

export default function Cabecalho(){
    return(
         <>
                {/* Novo cabeçalho adicionado aqui */}
                <header className="bg-amber-100 p-4 flex items-center justify-between shadow-md">
                <Link href="/" passHref className="flex items-center space-x-2 cursor-pointer">
                    <Image
                        src="/images/ben-transparente.png"
                        alt="Tio Ben Logo"
                        width={50} // Ajustado para um tamanho adequado ao cabeçalho
                        height={50}
                        priority
                    />
                    <span className="text-2xl font-bold text-amber-900">Tio Ben</span> {/* Aumentado o tamanho da fonte */}
                </Link>
                <Link href="/liturgia-diaria" passHref className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-lg"> {/* Link placeholder para a página de liturgia */}

                    {/* Ícone de livro ou Bíblia (SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Liturgia Diária</span>
                </Link>
                </header>
        </>
    )
}