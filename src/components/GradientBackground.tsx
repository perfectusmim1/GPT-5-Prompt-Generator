"use client";

import { motion } from "framer-motion";

// Örnek/style.css ile birebir renk uyumu.
// Katmanlar:
// 1) Statik geniş radial + linear degrade (style.css: body background)
// 2) İki adet yumuşak blur "blob" katmanı (style.css: body::before/after)
export function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1) Taban degrade (örnek/style.css body background) */}
      <motion.div
        initial={{ opacity: 0.6, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
        style={{
          // Daha az beyaz, daha fazla iOS/GPT‑5 mavi-lila yıkama
          background:
            "radial-gradient(1200px 800px at 10% -10%, #ffe5f2 0%, transparent 55%),\n             radial-gradient(1200px 800px at 110% 10%, #dbe8ff 0%, transparent 55%),\n             radial-gradient(1200px 800px at -10% 110%, #ffebc9 0%, transparent 48%),\n             radial-gradient(1200px 800px at 90% 100%, #e7deff 0%, transparent 55%),\n             linear-gradient(180deg, #eef4ff 0%, #e9f2ff 100%)",
        }}
      />

      {/* 2) Yavaşça hareket eden blob katmanı - 3 katı büyük */}
      <motion.div
        aria-hidden
        className="absolute inset-[-50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(2700px 2100px at 20% 20%, rgba(255, 142, 195, 0.85), transparent 50%),\n             radial-gradient(2850px 2250px at 80% 15%, rgba(182, 156, 255, 0.85), transparent 50%),\n             radial-gradient(2850px 2250px at 20% 85%, rgba(255, 211, 146, 0.75), transparent 50%),\n             radial-gradient(2850px 2250px at 80% 80%, rgba(142, 197, 255, 0.85), transparent 50%)",
          filter: "blur(35px) saturate(140%)",
        }}
        animate={{ x: ["0%", "-2%", "2%", "0%"], y: ["0%", "-1%", "1%", "0%"], scale: [1, 1.02, 1.04, 1] }}
        transition={{ duration: 28, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      />

      {/* 2) İkinci blob katmanı - 3 katı büyük */}
      <motion.div
        aria-hidden
        className="absolute inset-[-50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(2700px 2100px at 20% 20%, rgba(255, 142, 195, 0.75), transparent 50%),\n             radial-gradient(2850px 2250px at 80% 15%, rgba(182, 156, 255, 0.75), transparent 50%),\n             radial-gradient(2850px 2250px at 20% 85%, rgba(255, 211, 146, 0.65), transparent 50%),\n             radial-gradient(2850px 2250px at 80% 80%, rgba(142, 197, 255, 0.75), transparent 50%)",
          filter: "blur(35px) saturate(140%)",
          opacity: 0.9,
        }}
        animate={{ x: ["0%", "2%", "-2%", "0%"], y: ["0%", "1%", "-1%", "0%"], scale: [1, 1.02, 1.04, 1] }}
        transition={{ duration: 36, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      />
      {/* Mavi-lila yıkama: daha güçlü renk yıkama */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(160, 180, 255, 0.35) 0%, rgba(180, 220, 255, 0.25) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Hafif genel blur (cam hissi) */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
}



