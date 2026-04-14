"use client";
// Skills: /react-expert (useEffect, refs), /javascript-pro (GSAP counter animation, ScrollTrigger),
// /ui-ux-pro-max (testimonial layout, social proof patterns), /bencium-ux (big number impact),
// /frontend-design (card aesthetics)

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWaitlist } from "@/hooks/useWaitlist";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "I've tried every calendar app. None of them clicked. This one actually shows me what's close.",
    name: "Jamie",
    role: "designer",
    color: "var(--color-teal)",
  },
  {
    quote:
      "I didn't know a calendar could feel intuitive until I saw tasks moving toward me. Now I get it.",
    name: "Marcus",
    role: "freelancer",
    color: "var(--color-indigo)",
  },
  {
    quote:
      "The orbit thing sounds gimmicky until you use it. Then you can't go back to a grid.",
    name: "Priya",
    role: "product manager",
    color: "var(--color-apricot)",
  },
];

export default function SocialProof() {
  const { count } = useWaitlist();
  const counterRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!counterRef.current || hasAnimated.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.context(() => {
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          gsap.to(obj, {
            val: count,
            duration: prefersReduced ? 0 : 2,
            ease: "power2.out",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(obj.val).toLocaleString();
              }
            },
          });
        },
      });
    }, sectionRef);
  }, [count]);

  return (
    <section ref={sectionRef} className="py-20 md:py-40 bg-[var(--bg-dark-elevated)]">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
        {/* Big counter */}
        <div className="mb-12 md:mb-16">
          <span
            ref={counterRef}
            className="block font-[family-name:var(--font-jetbrains)] text-[clamp(3.5rem,10vw,7rem)]
              font-bold text-[var(--text-primary)] leading-none tabular-nums"
          >
            0
          </span>
          <p className="text-[var(--text-secondary)] mt-3 text-base md:text-lg font-[family-name:var(--font-jetbrains)]">
            on the waitlist
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-6 md:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left"
            >
              <div
                className="w-8 h-[2px] rounded-full mb-5"
                style={{ background: t.color }}
              />
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] mb-5 italic font-[family-name:var(--font-playfair)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-sm font-[family-name:var(--font-jetbrains)]">
                <span className="text-[var(--text-primary)]">{t.name}</span>
                <span className="text-[var(--text-secondary)]">, {t.role}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
