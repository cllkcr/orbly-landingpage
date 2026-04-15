"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CitationTooltip from "../CitationTooltip";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const DATES = [
  [28, 29, 30, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 1],
] as const;

// wi-di → color — scattered across the month to look like a lived-in calendar
const EVENTS: Record<string, string> = {
  "0-4": "var(--color-teal)",       // 3rd — Fri
  "1-1": "var(--color-coral)",      // 6th — Mon
  "1-3": "var(--color-teal)",       // 8th — Wed (today)
  "1-4": "#A07BD9",                 // 9th — Thu
  "2-1": "var(--color-coral)",      // 13th — Mon
  "2-3": "var(--color-teal-green)", // 15th — Wed
  "3-2": "#4BA8C9",                 // 21st — Tue
  "3-3": "var(--color-teal)",       // 22nd — Wed
  "4-0": "#A07BD9",                 // 26th — Sun
};

// today = 8th (wi=1, di=3)
const TODAY_KEY = "1-3";

export default function ProblemV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(headingRef.current!, { type: "words,chars" });

      const line1 = svgRef.current?.querySelector(
        "#v2-strike-1"
      ) as SVGLineElement | null;
      const line2 = svgRef.current?.querySelector(
        "#v2-strike-2"
      ) as SVGLineElement | null;

      if (line1 && line2) {
        [line1, line2].forEach((l) => {
          const len = l.getTotalLength();
          gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
        });
      }

      // ── Phase 1: Heading chars — play when section enters, before pin ──
      gsap.from(split.chars, {
        opacity: 0,
        y: 30,
        rotateX: -40,
        stagger: 0.018,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // ── Phase 2: Card entrance ─────────────────────────────────────────
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 22,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
      });

      // ── Phase 3: Strike + copy — pinned + scrub ────────────────────────
      // Section pins at viewport top; the X draws proportionally to scroll
      // progress over 600 px. Fast scrollers see it fast, slow scrollers
      // see it slow — nobody misses it regardless of scroll speed.
      if (line1 && line2) {
        const strikeTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=600",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.8,
          },
        });

        strikeTl
          .to(gridRef.current, { opacity: 0.28, duration: 1.5, ease: "none" })
          .to(line1, { strokeDashoffset: 0, duration: 2.5, ease: "none" }, "<0.8")
          .to(line2, { strokeDashoffset: 0, duration: 2.5, ease: "none" }, "<0.6")
          .from(copyRef.current, { opacity: 0, y: 18, duration: 2, ease: "none" }, "-=0.8");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-[var(--bg-light)]"
      aria-label="The problem with current calendar tools"
    >
      <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.7rem,4vw,2.8rem)]
            leading-[1.15] font-semibold text-[var(--text-dark)] mb-12 md:mb-16"
        >
          You&apos;re not bad at time. Your tools are.
        </h2>

        {/* Calendar card */}
        <div className="relative inline-block mb-12 md:mb-16">
          <div
            ref={cardRef}
            className="relative rounded-2xl overflow-hidden
              bg-white border border-[var(--text-dark)]/[0.09]
              shadow-[0_4px_32px_rgba(26,26,46,0.08)]"
          >
            {/* Month header */}
            <div className="px-5 py-3 border-b border-[var(--text-dark)]/[0.07] flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-coral)]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-dark)]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-dark)]/10" />
              </div>
              <span
                className="text-[11px] font-[family-name:var(--font-jetbrains)]
                  text-[var(--text-dark)]/50 tracking-[0.18em] uppercase"
              >
                April 2026
              </span>
              <div className="w-12" aria-hidden="true" />
            </div>

            <div ref={gridRef} className="p-3 md:p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((d, i) => (
                  <div
                    key={i}
                    className="w-9 h-7 md:w-11 md:h-8 flex items-center justify-center
                      text-[10px] font-[family-name:var(--font-jetbrains)]
                      text-[var(--text-dark)]/45 uppercase tracking-wider"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Date rows */}
              {DATES.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => {
                    const key = `${wi}-${di}`;
                    const isOutside =
                      (wi === 0 && day > 20) || (wi === 4 && day < 5);
                    const isToday = key === TODAY_KEY;
                    const eventColor = EVENTS[key];

                    return (
                      <div
                        key={key}
                        className={`relative w-9 h-9 md:w-11 md:h-11 flex flex-col items-center
                          justify-center rounded-lg
                          text-[13px] font-[family-name:var(--font-jetbrains)]
                          select-none
                          ${
                            isToday
                              ? "bg-[var(--color-teal)]/[0.12] ring-1 ring-[var(--color-teal)]/40 font-semibold text-[var(--color-teal)]"
                              : isOutside
                              ? "text-[var(--text-dark)]/25"
                              : "text-[var(--text-dark)]/70 border border-[var(--text-dark)]/[0.06]"
                          }`}
                        aria-current={isToday ? "date" : undefined}
                      >
                        <span className="leading-none">{day}</span>
                        {eventColor && !isOutside && (
                          <span
                            className="absolute bottom-[5px] w-[5px] h-[5px] rounded-full"
                            style={{ background: eventColor }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Strike-through — inside the card so overflow:hidden clips to rounded corners */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                id="v2-strike-1"
                x1="4"
                y1="4"
                x2="96"
                y2="96"
                stroke="var(--color-coral)"
                strokeWidth="1.6"
                strokeLinecap="butt"
              />
              <line
                id="v2-strike-2"
                x1="96"
                y1="4"
                x2="4"
                y2="96"
                stroke="var(--color-coral)"
                strokeWidth="1.6"
                strokeLinecap="butt"
              />
            </svg>
          </div>
        </div>

        {/* v2 copy — Inter body */}
        <p
          ref={copyRef}
          className="text-lg md:text-xl text-[var(--text-dark)]/60 max-w-lg mx-auto leading-relaxed
            font-[family-name:var(--font-inter)]"
        >
          <CitationTooltip citation="Tavares et al. (2015)">Research</CitationTooltip>{" "}
          shows the brain was never built for dates and numbers. It was
          built for proximity. Every calendar ever built looks exactly like this.
          And none of them have ever felt like enough.
        </p>
      </div>
    </section>
  );
}
