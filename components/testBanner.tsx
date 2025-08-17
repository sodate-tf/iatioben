// components/TestFooterBanner.tsx
import React from "react";

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
          [Anúncio de teste - 728x90 Desktop / 320x50 Mobile / Responsivo]
        </p>
      </div>
    </div>
  );
}
