"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoAdModalProps {
  onComplete: () => void;
  skipAfter?: number; // tempo em segundos para habilitar botão "pular"
  videoSrc?: string; // opcional, URL do vídeo
}

export default function VideoAdModal({
  onComplete,
  skipAfter = 7,
  videoSrc = "/images/noite-do-espetinho.mp4", // vídeo de teste local
}: VideoAdModalProps) {
  const [canSkip, setCanSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, skipAfter * 1000);

    return () => clearTimeout(timer);
  }, [skipAfter]);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/75 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black rounded-lg max-w-xl w-full relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
         
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8819996017476509"
     crossOrigin="anonymous"></script>
<ins className="adsbygoogle display:block"
     data-ad-client="ca-pub-8819996017476509"
     data-ad-slot="6448612719"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

          {/* Botão pular */}
          {canSkip && (
            <button
              className="absolute top-2 right-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
              onClick={handleSkip}
            >
              Pular anúncio
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
