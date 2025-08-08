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

      <main className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 sm:space-y-6"
        >
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
            Meet GPT‑5
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80 dark:text-white/70">
            Create high‑quality prompts in seconds. Add an image, press Enter to send.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setOpenSettings(true)} className="text-sm text-white/80 underline underline-offset-4 hover:text-white">API Settings</button>
          </div>
          <div className="pt-2">
            <PromptInput onGenerated={setResult} />
          </div>
        </motion.div>

        {result && (
          <div className="mt-10 w-full flex justify-center">
            <ResultCard content={result} />
          </div>
        )}
      </main>
      <SettingsDrawer open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
}
