"use client";
// Skills: /react-expert (composition), /javascript-pro (GSAP SplitText),
// /ui-ux-pro-max (urgency CTA, loss aversion), /bencium-ux (premium call-to-action),
// /frontend-design (gradient effects, atmosphere)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import EmailForm from "./EmailForm";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current!, { type: "words" });

      gsap.from(split.words, {
        opacity: 0,
        y: 40,
        filter: "blur(6px)",
        stagger: 0.05,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-40 bg-[var(--bg-dark)] overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
          rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,217,230,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-5 md:px-6 text-center">
        <p className="font-[family-name:var(--font-jetbrains)] text-xs tracking-[0.2em] uppercase text-[var(--color-teal)] mb-6 opacity-60">
          For founding members
        </p>

        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,3.5rem)]
            leading-[1.1] font-semibold mb-6"
        >
          A full year, on us.
        </h2>

        <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--text-secondary)] tracking-wide mb-6 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>Founding members</span>
          <span>&middot;</span>
          <span>12 months free</span>
          <span>&middot;</span>
          <span>No card required</span>
        </p>

        <p className="text-[var(--text-secondary)] text-[16px] leading-relaxed max-w-lg mx-auto mb-10">
          Early members get Orbly free for a full year. No card, no catch.
          Just you, your orbit, and time that finally makes sense.
        </p>

        <EmailForm id="cta-email" />
      </div>
    </section>
  );
}
