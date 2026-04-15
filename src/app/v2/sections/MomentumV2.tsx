"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useV2Signup } from "@/hooks/useV2Signup";

gsap.registerPlugin(ScrollTrigger);

// Matches the thresholds used in WaitlistCounterV2 so the counter framing
// stays consistent across the page.
const EARLY_ACCESS_THRESHOLD = 25 as const;

// Discriminated-union copy states for the live counter. Keeping the shape
// explicit avoids the "count could be 0 or 1 or many" branching noise.
type CounterState =
  | { kind: "empty" }
  | { kind: "early"; count: number }
  | { kind: "social"; count: number };

function resolveCounter(count: number): CounterState {
  if (count <= 0) return { kind: "empty" };
  if (count < EARLY_ACCESS_THRESHOLD) return { kind: "early", count };
  return { kind: "social", count };
}

// Day-one promises — each one is a verifiable fact, not aspiration.
type Promise = {
  readonly label: string;
  readonly title: string;
  readonly body: string;
  readonly color: string;
};

const PROMISES: readonly Promise[] = [
  {
    label: "Pricing",
    title: "Founding price, locked for life.",
    body:
      "The first members lock in a rate that never rises, no matter where Orbly prices publicly. No tiers. No surprise renewals.",
    color: "var(--color-teal)",
  },
  {
    label: "Platform",
    title: "iOS first, done right.",
    body:
      "Built natively for iPhone — not a cross-platform shell. Android and iPad follow once iOS feels truly finished.",
    color: "var(--color-indigo)",
  },
  {
    label: "Team",
    title: "One founder. No roadmap theatre.",
    body:
      "Made by one person who uses it every day. What ships is what's worth shipping. What doesn't, doesn't.",
    color: "var(--color-violet)",
  },
] as const;

const promiseVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function MomentumV2() {
  const { count } = useV2Signup();
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const counter = resolveCounter(count);

  useEffect(() => {
    if (counter.kind === "empty") return;
    if (!counterRef.current || hasAnimated.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const node = counterRef.current;

    // Small counts look silly when animated up from zero; snap directly.
    if (prefersReduced || counter.count < 10) {
      node.textContent = counter.count.toLocaleString();
      hasAnimated.current = true;
      return;
    }

    const proxy = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(proxy, {
          val: counter.count,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent =
                Math.round(proxy.val).toLocaleString();
            }
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [counter]);

  return (
    <section
      className="relative py-24 md:py-36 bg-[var(--bg-dark-elevated)] overflow-hidden"
      aria-labelledby="momentum-heading"
    >
      {/* Soft off-center glow — same language as FinalCTA */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 50% 30%, rgba(0,217,230,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-5 md:px-6">
        {/* Eyebrow + heading */}
        <div className="text-center mb-14 md:mb-20">
          <p
            className="font-[family-name:var(--font-jetbrains)] text-[11px] md:text-xs
              uppercase tracking-[0.24em] text-[var(--color-teal)]/80 mb-5"
          >
            Day one
          </p>
          <h2
            id="momentum-heading"
            className="font-[family-name:var(--font-playfair)]
              text-[clamp(1.75rem,3.8vw,2.75rem)] leading-[1.15]
              font-semibold text-[var(--text-primary)] tracking-[-0.01em]
              max-w-[28ch] mx-auto"
          >
            What the first batch actually gets.
          </h2>
        </div>

        {/* Live waitlist counter — stat-card, not testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-14 md:mb-20 max-w-md
            rounded-2xl border border-[var(--border-subtle)]
            bg-[var(--bg-dark)]/60 backdrop-blur-sm
            px-8 py-8 md:px-10 md:py-10 text-center"
        >
          <div
            className="absolute left-0 right-0 top-0 h-[2px]"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-teal), transparent)",
              boxShadow: "0 0 14px rgba(0, 217, 230, 0.55)",
              opacity: 0.85,
            }}
          />

          {counter.kind === "empty" ? (
            <p
              className="font-[family-name:var(--font-playfair)] italic
                text-[clamp(1.75rem,3.4vw,2.25rem)] font-medium
                text-[var(--text-primary)] leading-none mb-3"
            >
              Be the first.
            </p>
          ) : (
            <p
              className="font-[family-name:var(--font-playfair)] italic
                text-[clamp(2.5rem,5.5vw,3.75rem)] font-medium
                text-[var(--text-primary)] tabular-nums leading-none mb-3"
              aria-label={
                counter.kind === "early"
                  ? `${counter.count} early members reserved so far`
                  : `${counter.count} people on the waitlist`
              }
            >
              <span
                ref={counterRef}
                aria-live="polite"
                style={{
                  background:
                    "linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 140%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {counter.count.toLocaleString()}
              </span>
            </p>
          )}

          <p
            className="font-[family-name:var(--font-jetbrains)]
              text-[11px] md:text-xs uppercase tracking-[0.2em]
              text-[var(--text-secondary)]"
          >
            {counter.kind === "empty"
              ? "spots in the founding batch"
              : counter.kind === "early"
                ? counter.count === 1
                  ? "founding member reserved"
                  : "founding members reserved"
                : "on the waitlist, live"}
          </p>
        </motion.div>

        {/* Day-one promise grid */}
        <div
          role="list"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
        >
          {PROMISES.map((p, i) => (
            <motion.article
              key={p.label}
              role="listitem"
              custom={i}
              variants={promiseVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 320, damping: 22 },
              }}
              className="relative p-6 md:p-7 rounded-2xl
                bg-[var(--bg-dark)]/50 border border-[var(--border-subtle)]
                backdrop-blur-sm overflow-hidden
                transition-colors duration-300
                hover:border-[rgba(240,240,240,0.12)]
                focus-within:border-[var(--color-teal)]/40
                focus-within:ring-1 focus-within:ring-[var(--color-teal)]/30"
            >
              {/* Top accent — thinner + cooler than testimonial cards */}
              <div
                className="absolute left-0 top-0 w-14 h-[2px] rounded-full rounded-tl-2xl"
                aria-hidden="true"
                style={{ background: p.color, opacity: 0.55 }}
              />

              <p
                className="font-[family-name:var(--font-jetbrains)]
                  text-[10.5px] uppercase tracking-[0.22em]
                  text-[var(--text-secondary)] mb-4"
                style={{ color: p.color, opacity: 0.75 }}
              >
                {p.label}
              </p>
              <h3
                className="font-[family-name:var(--font-playfair)]
                  text-lg md:text-xl font-semibold
                  text-[var(--text-primary)] leading-[1.25] mb-3
                  tracking-[-0.005em]"
              >
                {p.title}
              </h3>
              <p
                className="text-[var(--text-secondary)]
                  font-[family-name:var(--font-inter)]
                  text-[14px] md:text-[15px] leading-[1.6]"
              >
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
