"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, ImagePlus, Loader2, Send, X } from "lucide-react";

type Props = {
  onGenerated: (text: string) => void;
};

export default function PromptInput({ onGenerated }: Props) {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [useWeb, setUseWeb] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sentWave, setSentWave] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Odak yönetimi için giriş ilk render’da seçilebilir
    inputRef.current?.focus();
  }, []);

  async function handleSubmit() {
    if (!input.trim() || loading) return;
    setLoading(true);
    // Gönderim anında kısa bir parıltı taraması
    setSentWave((n) => n + 1);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const tavily = localStorage.getItem("tavily_key") || "";
      if (tavily) headers["x-tavily-key"] = tavily;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: input.trim(), imageDataUrls: images, useWebSearch: useWeb }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "İstek başarısız");
      onGenerated(data.prompt as string);
    } catch (err) {
      onGenerated(`Hata: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function onPickFile(evt: React.ChangeEvent<HTMLInputElement>) {
    const files = evt.target.files ? Array.from(evt.target.files) : [];
    if (!files.length) return;
    const reads = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      )
    );
    setImages((prev) => [...prev, ...reads]);
    // reset input value to allow uploading same file again
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="relative">
        {/* Dairesel, yumuşak, akışkan bir aura sınır */}
        <motion.div
          className="group relative flex items-center gap-3 rounded-[26px] border border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-2xl px-4 sm:px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Statik renkli aura: sadece odak/hover iken görünür, dönmez */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-[1.5px] rounded-[28px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.38), rgba(16,185,129,0.3), rgba(244,114,182,0.28), rgba(99,102,241,0.38))",
              filter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          {/* Gönderim parıltısı: içten sola->sağa ince bir tarama */}
          <motion.div
            key={sentWave}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[26px]"
            style={{
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "120%", opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {/* İnce iç çerçeve */}
          <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-0 group-focus-within:ring-4 ring-white/10 transition-all duration-500" />
          {/* Web search toggle */}
          <button
            type="button"
            aria-label="Toggle web search"
            onClick={() => setUseWeb((v) => !v)}
            className="relative shrink-0 grid place-items-center h-10 w-10 rounded-xl text-white group/web"
            title="Web search"
          >
            <span
              aria-hidden
              className={`absolute inset-0 rounded-xl ${useWeb ? "bg-white/20" : "bg-white/10"} opacity-0 scale-75 transition-all duration-300 group-hover/web:opacity-100 group-hover/web:scale-100 ${useWeb ? "!opacity-100 !scale-100" : ""}`}
            />
            <Globe className="relative h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Görsel ekle"
            onClick={() => fileRef.current?.click()}
            className="relative shrink-0 grid place-items-center h-10 w-10 rounded-xl text-white group/icon"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl bg-white/10 opacity-0 scale-75 transition-all duration-300 group-hover/icon:opacity-100 group-hover/icon:scale-100"
            />
            <ImagePlus className="relative h-6 w-6" />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Ask anything... ${useWeb ? "(Web search ON)" : "(Prompt will be generated)"}`}
            className="flex-1 bg-transparent outline-none placeholder:text-gray-400/80 text-gray-900 dark:text-gray-100"
          />

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="relative ml-auto grid place-items-center rounded-xl text-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 group/send"
          >
            {/* Hover’da arkaya yarı saydam gri plaka */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl bg-white/10 opacity-0 scale-75 transition-all duration-300 group-hover/send:opacity-100 group-hover/send:scale-100"
            />
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </motion.div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onPickFile}
        />
      </div>

      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-3 flex items-center gap-3 overflow-x-auto"
        >
          {images.map((src, idx) => (
            <div key={idx} className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Selected ${idx + 1}`} className="h-12 w-12 rounded-lg object-cover border border-white/10" />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute -right-2 -top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}



