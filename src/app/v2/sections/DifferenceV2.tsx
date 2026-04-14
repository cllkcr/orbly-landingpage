"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// CSS-only orbit ring diagram — no Canvas overhead
function OrbitDiagram() {
  const rings = [
    { size: 80, delay: 0, color: "var(--color-teal)", label: "Today" },
    { size: 140, delay: 0.1, color: "var(--color-indigo)", label: "This week" },
    { size: 200, delay: 0.2, color: "var(--color-violet)", label: "This month" },
  ];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.3 }}
      className="relative flex items-center justify-center"
      style={{ width: 240, height: 240 }}
      aria-hidden="true"
    >
      {/* Center pulse */}
      <div className="absolute w-5 h-5 rounded-full bg-[var(--color-teal)] z-10"
        style={{ boxShadow: "0 0 20px var(--color-teal), 0 0 40px rgba(0,217,230,0.3)" }}
      />
      <div className="absolute w-8 h-8 rounded-full bg-[var(--color-teal)]/20 z-[9] animate-ping"
        style={{ animationDuration: "2s" }}
      />

      {/* Orbit rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + ring.delay, duration: 0.5, ease: "easeOut" }}
          className="absolute rounded-full border"
          style={{
            width: ring.size,
            height: ring.size,
            borderColor: `${ring.color}30`,
          }}
        >
          {/* Orbiting planet dot */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: ring.color, boxShadow: `0 0 8px ${ring.color}` }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 6 + i * 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function DifferenceV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current!, { type: "words" });

      gsap.from(split.words, {
        y: 40,
        autoAlpha: 0,
        filter: "blur(6px)",
        stagger: 0.07,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-40 bg-[var(--bg-dark)] overflow-hidden"
      aria-label="How Orbly works differently"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,217,230,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
          {/* Text side */}
          <div className="flex-1 text-center lg:text-left">
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)] text-[clamp(1.7rem,4vw,2.8rem)]
                leading-[1.15] font-semibold text-[var(--text-primary)] mb-6 md:mb-8"
            >
              What if the not now became something you could see?
            </h2>

            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-inter)] text-base md:text-lg">
              <p>
                In Orbly, your tasks and events orbit the present moment. The
                closer something is to you, the sooner it needs your attention.
                As time passes, everything drifts inward on its own.
              </p>
              <p>
                The future stops being abstract. It becomes distance.
              </p>
              <p className="text-[var(--text-primary)] font-medium">
                And distance, your brain has always understood.
              </p>
            </div>
          </div>

          {/* Diagram side */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <OrbitDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
