"use client";

import { motion } from "framer-motion";

export function GradientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0.6, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(900px_500px_at_10%_20%,rgba(16,185,129,0.25),transparent),radial-gradient(900px_500px_at_90%_30%,rgba(244,114,182,0.18),transparent)]"
      />

      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_110%,rgba(255,255,255,0.12),transparent)] dark:bg-[radial-gradient(600px_300px_at_50%_110%,rgba(255,255,255,0.06),transparent)]"
      />
    </div>
  );
}



