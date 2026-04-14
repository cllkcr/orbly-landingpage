"use client";
// Skills: /react-expert (useEffect refs), /javascript-pro (GSAP SplitText + ScrollTrigger, SVG animation),
// /ui-ux-pro-max (scroll-pinned section, visual storytelling), /frontend-design (calendar grid visual)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DATES = [
  [28, 29, 30, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 1],
];

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Heading char-by-char
      const split = new SplitText(headingRef.current!, { type: "chars" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(split.chars, {
        opacity: 0,
        y: 30,
        rotateX: -40,
        stagger: 0.02,
        duration: 0.6,
        ease: "power3.out",
      });

      // Grid fade + X lines
      const line1 = svgRef.current?.querySelector("#strike-1") as SVGLineElement;
      const line2 = svgRef.current?.querySelector("#strike-2") as SVGLineElement;

      if (line1 && line2) {
        [line1, line2].forEach((l) => {
          const len = l.getTotalLength();
          gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
        });

        tl.to(
          gridRef.current,
          { opacity: 0.2, duration: 0.8, ease: "power2.inOut" },
          "+=0.3"
        )
          .to(line1, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.3")
          .to(line2, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.3");
      }

      tl.from(
        copyRef.current,
        { opacity: 0, y: 20, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-44 bg-[var(--bg-light)]"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-playfair)] text-[clamp(1.8rem,4.5vw,3rem)]
            leading-[1.15] font-semibold text-[var(--text-dark)] mb-16"
        >
          Every calendar was built the&nbsp;same&nbsp;way.
        </h2>

        {/* Calendar grid with strike-through */}
        <div className="relative inline-block mb-16">
          <div ref={gridRef} className="relative">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    text-xs font-[family-name:var(--font-jetbrains)] text-[var(--text-dark)]/40 uppercase"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Date rows */}
            {DATES.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((day, di) => {
                  const isOutside =
                    (wi === 0 && day > 20) || (wi === 4 && day < 5);
                  return (
                    <div
                      key={`${wi}-${di}`}
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                        rounded-lg text-sm border border-[var(--text-dark)]/[0.06]
                        ${isOutside ? "text-[var(--text-dark)]/20" : "text-[var(--text-dark)]/60"}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* SVG strike lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <line
              id="strike-1"
              x1="5"
              y1="5"
              x2="95"
              y2="95"
              stroke="var(--color-coral)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              id="strike-2"
              x1="95"
              y1="5"
              x2="5"
              y2="95"
              stroke="var(--color-coral)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p
          ref={copyRef}
          className="text-lg md:text-xl text-[var(--text-dark)]/60 max-w-xl mx-auto leading-relaxed"
        >
          Rows. Columns. Numbers. Your brain has to translate all of it into
          urgency before you can act. By then it&apos;s usually too late.
        </p>
      </div>
    </section>
  );
}
