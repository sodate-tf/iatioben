// components/TestFooterBanner.tsx
import React from "react";
import banner from "@/public/images/noite-do-espetinho.png"
import Image from "next/image";
import Link from "next/link";
export default function TestFooterBanner() {
  return (
    <>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
     crossOrigin="anonymous"></script>


    
    <div className="absolut bottom-0 left-0 w-full flex justify-center items-center bg-gray-200 border-t border-gray-400 z-50 p-2">
      {/* Banner responsivo */}
      <div className="bg-gray-400 text-white font-bold flex justify-center items-center"
           style={{
             width: "100%",            
           }}>
             <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
     crossOrigin="anonymous"></script>

        <ins className={"adsbygoogle display:block"}
            data-ad-client="ca-pub-8819996017476509"
            data-ad-slot="9591116531"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    
      </div>
    </div>
    </>
  );
}
