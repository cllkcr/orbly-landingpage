"use client";

import { motion } from "framer-motion";

export default function FounderNoteV2() {
  return (
    <section
      className="relative py-20 md:py-36 bg-[var(--bg-dark)]"
      aria-labelledby="founder-note-heading"
    >
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Section eyebrow */}
          <h2
            id="founder-note-heading"
            className="font-[family-name:var(--font-jetbrains)] text-[11px] md:text-xs
              uppercase tracking-[0.24em] text-[var(--color-teal)] mb-6 md:mb-8"
          >
            <span
              aria-hidden="true"
              className="inline-block h-px w-6 align-middle mr-3"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--color-teal))",
              }}
            />
            A note from the founder
          </h2>

          {/* Decorative opening quote mark */}
          <span
            aria-hidden="true"
            className="absolute -top-4 md:-top-6 -left-1 md:-left-2
              font-[family-name:var(--font-playfair)] leading-none
              text-[6rem] md:text-[8rem] select-none pointer-events-none"
            style={{
              color: "var(--color-teal)",
              opacity: 0.12,
            }}
          >
            &ldquo;
          </span>

          <blockquote
            className="relative pl-6 md:pl-10"
            style={{
              borderLeft: "2px solid transparent",
              borderImage:
                "linear-gradient(to bottom, var(--color-teal), transparent) 1",
            }}
          >
            <p
              className="text-xl md:text-2xl leading-[1.7] md:leading-[1.65]
                text-[var(--text-primary)] italic
                font-[family-name:var(--font-playfair)] mb-6"
            >
              I kept missing things that mattered to me. I wasn&apos;t
              forgetting them — the future just never felt real until it was
              already on top of me.
            </p>
            <p
              className="text-xl md:text-2xl leading-[1.7] md:leading-[1.65]
                text-[var(--text-primary)] italic
                font-[family-name:var(--font-playfair)]"
            >
              I didn&apos;t need another reminder. I needed a sidekick that
              made time visible before it ran out. So I built Orbly.
            </p>
          </blockquote>

          <figcaption
            className="mt-8 md:mt-10 pl-6 md:pl-10 flex items-center gap-3
              font-[family-name:var(--font-jetbrains)] text-xs md:text-sm
              tracking-[0.16em] uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-block h-px w-8"
              style={{ background: "var(--text-secondary)", opacity: 0.5 }}
            />
            <cite className="not-italic text-[var(--text-secondary)]">
              <span className="text-[var(--text-primary)]">Founder</span>
              <span className="opacity-60 mx-1.5">·</span>
              <span>Orbly</span>
            </cite>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
