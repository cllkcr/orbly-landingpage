"use client";
// Skills: /react-expert (Framer Motion stagger, whileHover), /typescript-pro (typed data),
// /ui-ux-pro-max (card grid, progressive disclosure), /bencium-ux (spring physics hover),
// /frontend-design (card aesthetics, glassmorphism)

import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const FEATURES: Feature[] = [
  {
    title: "Distance = urgency.",
    description:
      "The closer a task orbits the center, the sooner it's due. No reading required — proximity tells the whole story.",
    icon: "01",
  },
  {
    title: "Time flows inward.",
    description:
      "Tasks drift toward you as deadlines approach. The orbit IS the clock. You don't check the time — you feel it.",
    icon: "02",
  },
  {
    title: "Today never mixes with tomorrow.",
    description:
      "Midnight is a hard wall. Your orbit resets clean. Each day is its own solar system — no bleed, no confusion.",
    icon: "03",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-40 bg-[var(--bg-dark)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em]
            uppercase text-[var(--color-teal)] mb-4"
        >
          How it works
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mt-10 md:mt-14">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{
                y: -6,
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }}
              className="group p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                hover:border-[var(--color-teal)]/15 transition-colors duration-500"
            >
              <span
                className="inline-block font-[family-name:var(--font-jetbrains)] text-xs
                  text-[var(--color-teal)]/60 tracking-widest mb-5"
              >
                {f.icon}
              </span>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-semibold mb-3 text-[var(--text-primary)]">
                {f.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
