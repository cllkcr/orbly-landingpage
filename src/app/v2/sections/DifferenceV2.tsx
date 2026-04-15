"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// ── Static ring visuals ────────────────────────────────────────
const RINGS = [
  { size: 110, border: "#00D9E645" },
  { size: 185, border: "#7B84D938" },
  { size: 265, border: "#A07BD930" },
] as const;

// ── Planet config — one per ring, drifts from ring edge → centre ──
// startFraction staggers arrival so they never all hit centre together
const PLANETS = [
  { color: "#00D9E6", size: 10, homeRadius: 55,    angularSpeed: 0.85, driftRate: 5.0,  startFraction: 0.30 },
  { color: "#7B84D9", size: 11, homeRadius: 92.5,  angularSpeed: 0.62, driftRate: 7.1,  startFraction: 0.65 },
  { color: "#A07BD9", size: 12, homeRadius: 132.5, angularSpeed: 0.45, driftRate: 8.8,  startFraction: 1.00 },
] as const;

interface PlanetState {
  angle: number;
  radius: number;
}

// ── Orbit diagram ──────────────────────────────────────────────
function OrbitDiagram() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const planetEls  = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef   = useRef<PlanetState[]>(
    PLANETS.map((p, i) => ({
      angle: (i * Math.PI * 2) / 3,           // evenly distributed start angles
      radius: p.homeRadius * p.startFraction,  // staggered starting depth
    }))
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let lastTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta at 50 ms
      lastTime = now;

      stateRef.current.forEach((state, i) => {
        const cfg = PLANETS[i];
        const el  = planetEls.current[i];
        if (!el) return;

        // Advance orbit angle + drift radius inward
        state.angle  += cfg.angularSpeed * dt;
        state.radius -= cfg.driftRate    * dt;

        // Absorb at centre → respawn at home ring
        if (state.radius <= 3) {
          state.radius = cfg.homeRadius;
          state.angle  = Math.random() * Math.PI * 2;
        }

        const x        = Math.cos(state.angle) * state.radius;
        const y        = Math.sin(state.angle) * state.radius;
        const progress = state.radius / cfg.homeRadius;      // 1 → 0
        const opacity  = Math.max(0, progress);
        const scale    = 0.35 + progress * 0.65;             // shrinks as it nears centre
        const glowR    = Math.round(10 * opacity);
        const glowS    = Math.round(22 * opacity);

        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
        el.style.opacity   = String(opacity.toFixed(3));
        el.style.boxShadow = `0 0 ${glowR}px ${cfg.color}, 0 0 ${glowS}px ${cfg.color}55`;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ scale: 0.82, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.25 }}
      className="relative flex items-center justify-center"
      style={{ width: 300, height: 300 }}
      aria-hidden="true"
    >
      {/* Static orbital rings */}
      {RINGS.map((ring, i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{ width: ring.size, height: ring.size, borderColor: ring.border }}
        />
      ))}

      {/* Drifting planets — positioned via absolute + CSS transform from centre */}
      {PLANETS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { planetEls.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            width:      cfg.size,
            height:     cfg.size,
            left:       "50%",
            top:        "50%",
            background: cfg.color,
          }}
        />
      ))}

      {/* White "NOW" centre */}
      <div className="absolute z-10 flex items-center justify-center">
        {/* Outer breathe */}
        <motion.div
          className="absolute rounded-full bg-white/[0.08]"
          style={{ width: 42, height: 42 }}
          animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner breathe */}
        <motion.div
          className="absolute rounded-full bg-white/[0.14]"
          style={{ width: 27, height: 27 }}
          animate={{ scale: [1, 1.45, 1], opacity: [0.65, 0.08, 0.65] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.28 }}
        />
        {/* Core */}
        <div
          className="relative rounded-full bg-white"
          style={{
            width:     18,
            height:    18,
            boxShadow:
              "0 0 10px rgba(255,255,255,0.95), 0 0 26px rgba(255,255,255,0.55), 0 0 58px rgba(255,255,255,0.22)",
          }}
        />
        {/* NOW label */}
        <span
          className="absolute top-full mt-2 text-[9px] font-[family-name:var(--font-jetbrains)]
            tracking-[0.22em] text-white/50 uppercase select-none"
        >
          now
        </span>
      </div>
    </motion.div>
  );
}

// ── Section ────────────────────────────────────────────────────
export default function DifferenceV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const parasRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        opacity: 0, y: 12, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
      });

      const split = new SplitText(headingRef.current!, { type: "words" });
      gsap.from(split.words, {
        y: 36, autoAlpha: 0, filter: "blur(6px)",
        stagger: 0.06, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 72%", once: true },
      });

      const paras = parasRef.current?.querySelectorAll("p");
      if (paras?.length) {
        gsap.from(paras, {
          opacity: 0, y: 18, duration: 0.65, ease: "power2.out", stagger: 0.14,
          scrollTrigger: { trigger: parasRef.current, start: "top 75%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-44 bg-[var(--bg-dark)] overflow-hidden"
      aria-label="How Orbly works differently"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 55% at 72% 50%, rgba(0,217,230,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-14 lg:gap-20">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p
              ref={eyebrowRef}
              className="text-[11px] font-[family-name:var(--font-jetbrains)]
                text-[var(--color-teal)] tracking-[0.22em] uppercase mb-5"
            >
              The difference
            </p>
            <h2
              ref={headingRef}
              className="font-[family-name:var(--font-playfair)]
                text-[clamp(1.8rem,4vw,3rem)] leading-[1.12]
                font-semibold text-[var(--text-primary)] mb-8"
            >
              What if the not now became something you could see?
            </h2>
            <div
              ref={parasRef}
              className="space-y-5 text-[var(--text-secondary)] leading-relaxed
                font-[family-name:var(--font-inter)] text-base md:text-[17px]"
            >
              <p>
                In Orbly, your tasks and events orbit the present moment. The
                closer something is to you, the sooner it needs your attention.
                As time passes, everything drifts inward on its own.
              </p>
              <p>The future stops being abstract. It becomes distance.</p>
              <p className="text-[var(--text-primary)] font-medium">
                And distance, your brain has always understood.
              </p>
            </div>
          </div>

          {/* Diagram */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end relative">
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 320, height: 320,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.035) 0%, rgba(0,217,230,0.025) 45%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <OrbitDiagram />
          </div>

        </div>
      </div>
    </section>
  );
}
