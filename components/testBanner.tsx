// components/TestFooterBanner.tsx
import React from "react";
import banner from "@/public/images/noite-do-espetinho.png"
import Image from "next/image";
import Link from "next/link";
export default function TestFooterBanner() {
  return (
    <div className="fixed bottom-10 left-0 w-full flex justify-center items-center bg-gray-200 border-t border-gray-400 z-50 p-2">
      {/* Banner responsivo */}
      <div className="bg-gray-400 text-white font-bold flex justify-center items-center"
           style={{
             width: "100%",
             maxWidth: "728px", // desktop
             height: "90px",    // desktop
           }}>
        <p className="text-center">
          <Link href="http://wa.me/5518997095270" target="_blank">
            <Image src={banner} alt="Noite do Espetinho Acampabento - 23/08/2025"  />           
          </Link>
        </p>
      </div>
    </div>
  );
}
