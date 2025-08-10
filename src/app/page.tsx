"use client";
import { motion } from "framer-motion";
import PromptInput from "@/components/PromptInput";
import { GradientBackground } from "@/components/GradientBackground";
import ResultCard from "@/components/ResultCard";
import SettingsDrawer from "@/components/SettingsDrawer";
import { useEffect, useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("");
  const [openSettings, setOpenSettings] = useState(false);

  // Inject the saved key into fetch requests by setting a default header via override
  useEffect(() => {
    // Monkey-patch global fetch to attach header if key exists
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const key = localStorage.getItem("openrouter_key") || "";
      const headers = new Headers(init?.headers || {});
      if (key) headers.set("x-openrouter-key", key);
      return originalFetch(input, { ...init, headers });
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  return (
    <div className="relative min-h-dvh px-4 sm:px-6">
      <GradientBackground />
      {/* grain-overlay geçici olarak kapatıldı - renkleri daha görünür hale getirmek için */}
      {/* <div className="grain-overlay" /> */}

      <main className={`mx-auto flex min-h-dvh max-w-5xl flex-col items-center ${result ? "justify-start" : "justify-center"} text-center`}>
        {/* Ana header ve input alanı - result varken yukarı kayıyor */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ 
            opacity: 1, 
            y: result ? -160 : 0  // Result varken çok daha fazla yukarı kay
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-4 sm:space-y-6"
        >
          <motion.h1 
            className="text-3xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 dark:from-white dark:to-white/60 bg-clip-text text-transparent"
            animate={{ scale: result ? 0.85 : 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Meet GPT‑5
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 dark:text-white/70"
            animate={{ scale: result ? 0.9 : 1, opacity: result ? 0.7 : 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Create high‑quality prompts in seconds. Add an image, press Enter to send.
          </motion.p>
          <motion.div 
            className="flex justify-center gap-3"
            animate={{ opacity: result ? 0.6 : 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button onClick={() => setOpenSettings(true)} className="text-sm text-white/80 underline underline-offset-4 hover:text-white">API Settings</button>
          </motion.div>
          <div className="pt-2">
            <PromptInput onGenerated={setResult} />
          </div>
        </motion.div>

        {/* Result card - input'un hemen dibinde açılıyor */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2  // Input yukarı kaydıktan sonra başlasın
            }}
            className="w-full flex justify-center"
            style={{ marginTop: -140 }}
          >
            <ResultCard content={result} />
          </motion.div>
        )}
      </main>
      <SettingsDrawer open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
}
