"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import EmailFormV2 from "../EmailFormV2";
import WaitlistCounterV2 from "../WaitlistCounterV2";

gsap.registerPlugin(SplitText, ScrollTrigger);

const OrbitSceneV2 = dynamic(() => import("../OrbitSceneV2"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-[var(--bg-dark)]" />,
});

interface HeroV2Props {
  initialRef?: string;
}

export default function HeroV2({ initialRef }: HeroV2Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const zoomProgress = useRef({ value: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!headlineRef.current || !sectionRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ScrollTrigger: camera zoom as hero exits viewport
    gsap.to(zoomProgress.current, {
      value: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    if (prefersReduced) {
      // Reveal everything without animation
      [badgeRef, headlineRef, subRef, formRef, counterRef].forEach((r) => {
        if (r.current) r.current.style.visibility = "visible";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current!, { type: "words" });
      gsap.set(headlineRef.current, { visibility: "visible" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        autoAlpha: 0,
        y: -15,
        duration: 0.6,
        delay: 0.2,
      })
        .from(
          split.words,
          {
            y: 60,
            autoAlpha: 0,
            filter: "blur(8px)",
            stagger: 0.06,
            duration: 0.8,
          },
          "-=0.2"
        )
        .from(subRef.current, { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.3")
        .from(formRef.current, { autoAlpha: 0, y: 25, duration: 0.6 }, "-=0.3")
        .from(
          counterRef.current,
          { autoAlpha: 0, y: 15, duration: 0.5 },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
    >
      <OrbitSceneV2 zoomProgress={zoomProgress} />

      {/* Scrims — light enough to let the orbit field breathe */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,15,0.50) 0%, rgba(10,10,15,0.15) 42%, rgba(10,10,15,0.60) 100%)",
        }}
      />
      {/* Central vignette — darker to protect text contrast over bright planets */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 52%, rgba(10,10,15,0.62) 0%, transparent 72%)",
        }}
      />
      {/* Tight text-safe zone — guaranteed dark surface directly behind content */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 48% 38% at 50% 52%, rgba(10,10,15,0.28) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-6 max-w-2xl mx-auto gap-4 md:gap-5 py-24 md:py-0">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-white/[0.10] backdrop-blur-md"
          style={{
            visibility: "hidden",
            background: "rgba(10,10,15,0.72)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.9, 1], opacity: [1, 0.15, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]"
            aria-hidden="true"
          />
          <span
            className="text-xs font-[family-name:var(--font-jetbrains)] text-[#C0C0D0] tracking-widest"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
          >
            iOS only &middot; Coming soon
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-[var(--text-primary)] text-balance"
          style={{
            visibility: "hidden",
            textShadow:
              "0 2px 20px rgba(0,0,0,0.8), 0 0px 40px rgba(0,0,0,0.5)",
          }}
        >
          Your brain lives in the now.{" "}
          <span className="text-[var(--color-teal)]">
            Orbly pulls the future into it.
          </span>
        </h1>

        {/* Subheadline — Inter body */}
        <p
          ref={subRef}
          className="text-base md:text-lg text-[#BEBECE] max-w-xs md:max-w-sm leading-relaxed font-[family-name:var(--font-inter)]"
          style={{
            visibility: "hidden",
            textShadow: "0 1px 16px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.75)",
          }}
        >
          The first AI powered app that makes time something you can feel, not
          just read.
        </p>

        {/* Form */}
        <div ref={formRef} style={{ visibility: "hidden" }} className="w-full">
          <EmailFormV2 id="hero-v2-email" initialRef={initialRef} />
        </div>

        {/* Counter */}
        <div ref={counterRef} style={{ visibility: "hidden" }}>
          <WaitlistCounterV2 />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-[fade-in_1s_2s_both] transition-opacity duration-700 ${
          scrolled ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[var(--text-secondary)]/60 tracking-[0.25em]">
          scroll
        </span>
        <div className="w-[1px] h-8 relative overflow-hidden">
          <div className="absolute inset-x-0 h-full bg-gradient-to-b from-white/40 to-transparent animate-[scroll-line_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
