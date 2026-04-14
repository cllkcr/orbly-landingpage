"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useV2Signup } from "@/hooks/useV2Signup";
import EmailFormV2 from "../EmailFormV2";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FinalCTAV2Props {
  initialRef?: string;
}

export default function FinalCTAV2({ initialRef }: FinalCTAV2Props) {
  const { count } = useV2Signup();
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
      className="relative py-20 md:py-40 bg-[var(--bg-dark-elevated)] overflow-hidden"
      aria-label="Join the waitlist"
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
        {/* Marcus quote */}
        <blockquote className="mb-8 md:mb-10">
          <p className="text-[var(--text-secondary)] italic font-[family-name:var(--font-playfair)] text-base md:text-lg leading-relaxed mb-3">
            &ldquo;The moment I saw tasks drifting toward me I felt something
            click. My brain understood it immediately.&rdquo;
          </p>
          <cite className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--text-secondary)] tracking-wide not-italic">
            — Marcus, freelancer
          </cite>
        </blockquote>

        {/* Live counter */}
        <p className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--text-secondary)] mb-8 tracking-wide">
          <span className="text-[var(--text-primary)] font-medium">
            {count.toLocaleString()}
          </span>{" "}
          people have already reserved their spot.
        </p>

        {/* Main headline */}
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,4vw,3rem)]
            leading-[1.15] font-semibold text-[var(--text-primary)] mb-4 md:mb-5"
        >
          Get in before everyone else. Pay less. Forever.
        </h2>

        {/* Subtext */}
        <p className="font-[family-name:var(--font-jetbrains)] text-xs text-[var(--color-teal)]/70 tracking-[0.15em] uppercase mb-6">
          Founding members &middot; Beta access &middot; Founding price locked at launch
        </p>

        {/* Body */}
        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-inter)] leading-relaxed mb-10 max-w-lg mx-auto">
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
