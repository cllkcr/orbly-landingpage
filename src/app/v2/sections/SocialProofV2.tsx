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

export default function SocialProofV2() {
  const { count } = useV2Signup();
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!counterRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const proxy = { val: 0 };
    ScrollTrigger.create({
      trigger: counterRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(proxy, {
          val: count,
          duration: prefersReduced ? 0 : 2,
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
  }, [count]);

  return (
    <section
      className="py-20 md:py-40 bg-[var(--bg-dark)]"
      aria-label="Social proof"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Counter */}
        <div className="text-center mb-14 md:mb-16">
          <p className="font-[family-name:var(--font-jetbrains)] text-[clamp(2.5rem,6vw,4rem)] font-bold text-[var(--text-primary)] tabular-nums leading-none mb-2">
            <span ref={counterRef} aria-live="polite">
              0
            </span>
          </p>
          <p className="text-[var(--text-secondary)] font-[family-name:var(--font-inter)] text-base md:text-lg">
            on the waitlist
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
              className="relative p-6 md:p-7 rounded-2xl
                bg-white/[0.03] border border-white/[0.06]
                overflow-hidden"
            >
              {/* Color accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: t.color }}
                aria-hidden="true"
              />

              <blockquote>
                <p className="text-[var(--text-secondary)] italic font-[family-name:var(--font-playfair)] leading-relaxed text-base mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="font-[family-name:var(--font-jetbrains)] text-xs tracking-wide">
                <span className="text-[var(--text-primary)] font-medium">
                  {t.name}
                </span>
                <span className="text-[var(--text-secondary)] ml-1">
                  — {t.role}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
