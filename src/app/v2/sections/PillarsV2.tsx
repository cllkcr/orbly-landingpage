"use client";

import { motion, type Variants } from "framer-motion";

// ── Pillar data — typed as const, no boolean props ─────────
const PILLARS = [
  {
    number: "01",
    title: "You see it. You feel it. You decide.",
    body: "Your entire schedule — tasks, events, reminders — orbits the present moment in real space. Glance and instantly know what's close, what can wait, what needs you right now. No lists to scan. No dates to parse. Just you, with a clear picture of your time for the first time.",
    commands: null,
    color: "var(--color-teal)",
  },
  {
    number: "02",
    title: "You say it. Orbly handles it.",
    body: "Type it or say it — Orbly understands and places everything exactly where it belongs in your orbit. Events, tasks, reminders, recurring plans. No menus. No forms. No friction. Your words, turned into a complete picture of your time.",
    commands: [
      "Block two hours Thursday morning for report prep.",
      "Remind me to call the dentist tomorrow afternoon.",
      "Add team standup every Monday at 10.",
    ],
    color: "var(--color-indigo)",
  },
  {
    number: "03",
    title: "You focus. Orbly watches your back.",
    body: "Your internal clock is unreliable — research confirms it. When something important is drifting close and you haven't touched it yet, Orbly quietly steps in. Not with noise. With the right prompt at the right moment. So nothing slips while you're deep in the work — and you never have to wonder what you missed.",
    commands: null,
    color: "var(--color-violet)",
  },
  {
    number: "04",
    title: "You execute. Orbly keeps time.",
    body: "Seeing what needs attention is half the job. Doing it is the other half. Orbly's Pomodoro and Time Timer are already inside — no switching apps, no breaking focus. You stay in control of your time from the moment you plan it to the moment you finish it.",
    commands: null,
    color: "var(--color-apricot)",
  },
] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function PillarsV2() {
  return (
    <section
      className="py-20 md:py-40 bg-[var(--bg-dark-elevated)]"
      aria-label="Four pillars of Orbly"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-[family-name:var(--font-jetbrains)] text-[var(--color-teal)]/70 tracking-[0.2em] uppercase mb-4">
            Everything you need to run your time
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold text-[var(--text-primary)] leading-[1.15]">
            In one orbit.
          </h2>
        </div>

        {/* 2×2 grid desktop, 1-col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {PILLARS.map((pillar, i) => (
            <motion.article
              key={pillar.number}
              role="article"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 350, damping: 22 },
              }}
              className="relative p-6 md:p-8 rounded-2xl
                bg-white/[0.03] border border-white/[0.06]
                hover:border-white/[0.10] hover:bg-white/[0.05]
                transition-colors duration-300 cursor-default"
            >
              {/* Subtle color accent top-left */}
              <div
                className="absolute top-0 left-0 w-16 h-0.5 rounded-full rounded-tl-2xl"
                style={{ background: pillar.color, opacity: 0.5 }}
                aria-hidden="true"
              />

              {/* Number label */}
              <span
                aria-hidden="true"
                className="inline-block font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.15em] mb-5"
                style={{ color: pillar.color, opacity: 0.7 }}
              >
                {pillar.number}
              </span>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-semibold text-[var(--text-primary)] leading-[1.2] mb-4">
                {pillar.title}
              </h3>

              {/* Voice command examples (pillar 02 only) */}
              {pillar.commands && (
                <div className="mb-4 space-y-1.5">
                  {pillar.commands.map((cmd, ci) => (
                    <code
                      key={ci}
                      className="block text-sm font-[family-name:var(--font-jetbrains)] text-[var(--color-teal)]/80 bg-[var(--color-teal)]/[0.06] rounded-lg px-3 py-2 leading-relaxed"
                    >
                      &ldquo;{cmd}&rdquo;
                    </code>
                  ))}
                </div>
              )}

              {/* Body — Inter */}
              <p className="text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-inter)] text-sm md:text-base">
                {pillar.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
