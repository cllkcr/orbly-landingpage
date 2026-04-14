"use client";
// Skills: /react-expert (Framer Motion integration), /bencium-ux (emotional, human micro-section),
// /ui-ux-pro-max (typographic hierarchy, whitespace)

import { motion } from "framer-motion";

export default function FounderNote() {
  return (
    <section className="py-16 md:py-32 bg-[var(--bg-dark)]">
      <div className="max-w-2xl mx-auto px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="border-l-2 border-[var(--color-teal)]/30 pl-8 md:pl-10"
        >
          <p className="text-lg md:text-xl leading-[1.8] text-[var(--text-secondary)] italic font-[family-name:var(--font-playfair)]">
            I built Orbly because life kept beating me. Missed tasks. Late to
            things I cared about. Judged for it. I didn&apos;t need another
            list&nbsp;&mdash; I needed something I could feel. So I built it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
