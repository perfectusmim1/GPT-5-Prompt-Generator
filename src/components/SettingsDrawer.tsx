"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { KeyRound, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function SettingsDrawer({ open, onClose, onSaved }: Props) {
  const [key, setKey] = useState("");
  const [sentWave, setSentWave] = useState(0);

  useEffect(() => {
    if (open) {
      const existing = localStorage.getItem("openrouter_key") || "";
      setKey(existing);
      // Web search kaldırıldı; Tavily anahtarı kullanılmıyor
    }
  }, [open]);

  function save() {
    localStorage.setItem("openrouter_key", key.trim());
    setSentWave((n) => n + 1);
    onSaved?.();
    // Paneli hemen kapatmayalım; kullanıcı animasyonu görsün, 350ms sonra kapansın
    setTimeout(onClose, 350);
  }
  // Web search kaldırıldı

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Overlay blur should appear immediately with a fast fade */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md backdrop-blur-xl text-white shadow-xl border-l border-white/20 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)"
            }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/20 bg-white/5">
              <div className="inline-flex items-center gap-2 text-lg font-semibold">
                <KeyRound className="h-5 w-5" />
                API Settings
              </div>
              <button onClick={onClose} className="relative rounded-xl p-2 text-white group">
                <span aria-hidden className="absolute inset-0 rounded-xl bg-white/10 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
                <X className="relative h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-7">
              <label className="text-sm text-white/70 block">OpenRouter API Key</label>

              {/* Styled like main prompt input */}
              <div className="relative group flex items-center gap-3 rounded-[26px] border border-white/20 bg-white/10 backdrop-blur-2xl px-4 py-3 overflow-hidden shadow-lg">
                {/* Static aura + arka plan renkleriyle uyumlu */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-[1.5px] rounded-[28px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, rgba(255,142,195,0.35), rgba(182,156,255,0.35), rgba(142,197,255,0.3), rgba(255,211,146,0.25), rgba(255,142,195,0.35))",
                    filter: "blur(8px)",
                  }}
                />
                {/* inner ring */}
                <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-0 group-focus-within:ring-4 ring-white/10 transition-all duration-500" />
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save();
                  }}
                  placeholder="sk-or-v1-..."
                  className="relative z-10 flex-1 bg-transparent outline-none placeholder:text-gray-400/80 text-white"
                />
                <button
                  onClick={save}
                  className="relative z-10 ml-auto grid place-items-center rounded-xl text-white h-10 px-4 group/save"
                >
                  <span aria-hidden className="absolute inset-0 rounded-xl bg-white/10 opacity-0 scale-75 transition-all duration-300 group-hover/save:opacity-100 group-hover/save:scale-100" />
                  Save Key
                </button>

                {/* send scan wave - renkli */}
                <motion.div
                  key={sentWave}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[26px]"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 0%, rgba(255,142,195,0.12) 30%, rgba(182,156,255,0.12) 50%, rgba(142,197,255,0.12) 70%, transparent 100%)",
                  }}
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: "120%", opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-white/50">Your key is stored locally in your browser. It will be attached to requests as a header and never sent elsewhere.</p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}


