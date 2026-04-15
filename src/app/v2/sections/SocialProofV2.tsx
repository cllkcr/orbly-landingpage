"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useV2Signup } from "@/hooks/useV2Signup";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "Every other app made me feel more behind. With Orbly I actually feel like I can see what's coming.",
    name: "Jamie",
    role: "Designer",
    color: "var(--color-teal)",
  },
  {
    quote:
      "I just talk to it and it handles the rest. I didn't realize how much friction I had until it was gone.",
    name: "Marcus",
    role: "Freelancer",
    color: "var(--color-indigo)",
  },
  {
    quote:
      "Having planning, nudges and timers all in one place without switching apps is the whole point. Nothing else does this.",
    name: "Priya",
    role: "Product Manager",
    color: "var(--color-violet)",
  },
] as const;

// Match the threshold used in WaitlistCounterV2 so the counter framing stays
// consistent across the page.
const EARLY_ACCESS_THRESHOLD = 25 as const;

export default function SocialProofV2() {
  const { count } = useV2Signup();
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const isEarly = count > 0 && count < EARLY_ACCESS_THRESHOLD;
  const label = count <= 0
    ? "reserving their spot"
    : isEarly
      ? count === 1 ? "early believer so far" : "early believers so far"
      : "on the waitlist";

  useEffect(() => {
    if (!counterRef.current || count <= 0) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const node = counterRef.current;

    // Tiny counts look silly when animated; snap directly instead.
    if (prefersReduced || count < 10) {
      node.textContent = count.toLocaleString();
      hasAnimated.current = true;
      return;
    }

    const proxy = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(proxy, {
          val: count,
          duration: 1.8,
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
  }, [count]);

  return (
    <section
      className="py-24 md:py-40 bg-[var(--bg-dark)]"
      aria-labelledby="social-proof-heading"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Section eyebrow */}
        <h2
          id="social-proof-heading"
          className="text-center font-[family-name:var(--font-jetbrains)]
            text-[11px] md:text-xs uppercase tracking-[0.24em]
            text-[var(--color-teal)] mb-4"
        >
          Early access
        </h2>

        {/* Counter */}
        <div className="text-center mb-16 md:mb-20">
          {count > 0 ? (
            <p
              className="font-[family-name:var(--font-playfair)] italic
                text-[clamp(2.75rem,6.5vw,4.5rem)] font-medium
                text-[var(--text-primary)] tabular-nums leading-none mb-3"
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
                {count.toLocaleString()}
              </span>
            </p>
          ) : (
            <p
              className="font-[family-name:var(--font-playfair)] italic
                text-[clamp(2rem,4vw,3rem)] font-medium
                text-[var(--text-primary)] leading-none mb-3"
            >
              Be the first
            </p>
          )}
          <p
            className="font-[family-name:var(--font-jetbrains)] text-xs md:text-sm
              uppercase tracking-[0.2em] text-[var(--text-secondary)]"
          >
            {label}
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative p-7 md:p-8 rounded-2xl
                bg-[var(--bg-dark-elevated)]/60 border border-[var(--border-subtle)]
                backdrop-blur-sm overflow-hidden transition-colors duration-300
                hover:border-white/[0.12]"
            >
              {/* Top color accent bar with glow */}
              <div
                className="absolute left-0 right-0 top-0 h-[2px]"
                style={{
                  background: `linear-gradient(to right, transparent, ${t.color}, transparent)`,
                  boxShadow: `0 0 16px ${t.color}`,
                  opacity: 0.85,
                }}
                aria-hidden="true"
              />

              {/* Decorative oversized quote mark */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-4
                  font-[family-name:var(--font-playfair)] leading-none
                  text-[4.5rem] md:text-[5rem] select-none pointer-events-none
                  transition-opacity duration-500 group-hover:opacity-20"
                style={{ color: t.color, opacity: 0.1 }}
              >
                &ldquo;
              </span>

              <blockquote>
                <p
                  className="relative text-[var(--text-primary)] italic
                    font-[family-name:var(--font-inter)]
                    leading-[1.6] text-[15px] md:text-base mb-6"
                >
                  {t.quote}
                </p>
              </blockquote>

              <figcaption
                className="relative flex items-center gap-3
                  font-[family-name:var(--font-jetbrains)] text-[11px]
                  uppercase tracking-[0.16em]"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-6"
                  style={{ background: t.color, opacity: 0.6 }}
                />
                <span>
                  <cite className="not-italic text-[var(--text-primary)] font-medium">
                    {t.name}
                  </cite>
                  <span className="text-[var(--text-secondary)] ml-2">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
