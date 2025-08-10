"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

type Props = {
  content: string;
};

export default function ResultCard({ content }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(
    null
  );

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 120, damping: 12 });
  const rotateY = useSpring(ry, { stiffness: 120, damping: 12 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 8); // tilt Y
    rx.set(-py * 8); // tilt X
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    setHovered(false);
  }

  async function onCopy(e: React.MouseEvent<HTMLDivElement>) {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
      }
      setTimeout(() => setCopied(false), 1200);
      setTimeout(() => setRipple(null), 500);
    } catch {
      // ignore
    }
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onCopy}
      whileTap={{ scale: 0.985 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 12, height: 72 }}
      animate={{ opacity: 1, y: 0, height: hovered ? "auto" : 72 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-0 shadow-[0_10px_40px_rgba(0,0,0,0.15)] cursor-pointer text-left text-white"
    >
      {/* Gradient border aura - arka plan renkleriyle uyumlu */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[1px] rounded-[18px] opacity-0"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(255,142,195,0.32), rgba(182,156,255,0.32), rgba(142,197,255,0.28), rgba(255,211,146,0.22), rgba(255,142,195,0.32))",
          filter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      {/* Hover ipucu */}
      <div className="flex items-center justify-between px-5 py-3 select-none text-white">
        <h2 className="text-sm font-semibold text-white">Generated Prompt</h2>
        <motion.span
          className="text-xs text-white/60"
          initial={{ opacity: 1 }}
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          Click to copy
        </motion.span>
      </div>

      <div className="scroll-area px-5 pb-5 whitespace-pre-wrap leading-relaxed text-white max-h-[55vh] overflow-y-auto overscroll-contain">
        {content}
      </div>

      {/* Ripple efekt */}
      {ripple && (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{ left: ripple.x - 2, top: ripple.y - 2, width: 4, height: 4, background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent 60%)" }}
          initial={{ opacity: 0.75, scale: 0 }}
          animate={{ opacity: 0, scale: 40 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Kopyalandı rozeti */}
      <motion.div
        initial={false}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : -6 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs text-white"
      >
        <Check className="h-3.5 w-3.5" /> Copied
      </motion.div>

      {/* Alt parıltı */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}


