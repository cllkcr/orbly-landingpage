"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import EmailFormV2 from "../EmailFormV2";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FinalCTAV2Props {
  initialRef?: string;
}

export default function FinalCTAV2({ initialRef }: FinalCTAV2Props) {
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
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 65%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-[var(--bg-dark-elevated)] overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,217,230,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-5 md:px-6 text-center">
        {/* Eyebrow */}
        <p className="font-[family-name:var(--font-jetbrains)] text-[0.7rem] md:text-xs text-[var(--color-teal)]/80 tracking-[0.2em] uppercase mb-5 md:mb-6">
          Founding members &middot; Beta access
        </p>

        {/* Main headline */}
        <h2
          id="final-cta-heading"
          ref={headingRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,4.2vw,3rem)]
            leading-[1.12] font-semibold text-[var(--text-primary)] mb-5 md:mb-6 tracking-[-0.01em]"
        >
          Get in before everyone else. Pay less. Forever.
        </h2>

        {/* Body */}
        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-inter)] text-[0.95rem] md:text-base leading-relaxed mb-10 md:mb-12 max-w-lg mx-auto">
          Join the waitlist now. Founding members get into Orbly before the App
          Store launch — in batches, starting from the top of the list. They
          lock in a price that will never go up, no matter what Orbly costs
          publicly.
        </p>

        {/* Form */}
        <EmailFormV2 id="final-cta-v2-email" initialRef={initialRef} />
      </div>
    </section>
  );
}
