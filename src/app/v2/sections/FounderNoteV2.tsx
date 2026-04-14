"use client";

import { motion } from "framer-motion";

export default function FounderNoteV2() {
  return (
    <section
      className="py-16 md:py-32 bg-[var(--bg-dark)]"
      aria-label="A note from the founder"
    >
      <div className="max-w-2xl mx-auto px-5 md:px-6">
        <motion.blockquote
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="border-l-2 border-[var(--color-teal)]/30 pl-8 md:pl-10"
        >
          <p className="text-lg md:text-xl leading-[1.8] text-[var(--text-secondary)] italic font-[family-name:var(--font-playfair)] mb-6">
            &ldquo;I kept missing things that mattered to me. I wasn&apos;t
            forgetting them — the future just never felt real until it was
            already on top of me.
            <br />
            <br />
            I didn&apos;t need another reminder. I needed a sidekick that made
            time visible before it ran out. So I built Orbly.&rdquo;
          </p>
          <figcaption className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--text-secondary)] tracking-wide not-italic">
            — Founder, Orbly
          </figcaption>
        </motion.blockquote>
      </div>
    </section>
  );
}
