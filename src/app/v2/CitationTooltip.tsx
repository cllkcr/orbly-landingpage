"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type Placement = "top" | "bottom";

interface CitationTooltipProps {
  children: ReactNode;
  citation: string;
  label?: string;
}

const VIEWPORT_TOP_MARGIN = 80;

export default function CitationTooltip({
  children,
  citation,
  label = "SOURCE",
}: CitationTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("top");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion preference once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const computePlacement = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // If the trigger is too close to the viewport top, flip below.
    setPlacement(rect.top < VIEWPORT_TOP_MARGIN ? "bottom" : "top");
  }, []);

  const show = useCallback(() => {
    computePlacement();
    setOpen(true);
  }, [computePlacement]);

  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    if (open) {
      hide();
    } else {
      show();
    }
  }, [open, show, hide]);

  // Escape closes the tooltip; tap-outside closes on touch.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.blur();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Re-compute placement on scroll/resize while open.
  useEffect(() => {
    if (!open) return;
    const onChange = () => computePlacement();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [open, computePlacement]);

  const offsetClasses =
    placement === "top"
      ? "bottom-full mb-2"
      : "top-full mt-2";

  const slideY =
    placement === "top" ? { closed: 0, open: -4 } : { closed: 0, open: 4 };

  return (
    <span ref={containerRef} className="relative inline">
      <button
        type="button"
        ref={triggerRef}
        data-citation-trigger
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          // Touch taps come through as click; keep keyboard activation too.
          e.preventDefault();
          toggle();
        }}
        className="
          inline bg-transparent p-0 m-0
          font-[inherit] text-[inherit] leading-[inherit]
          cursor-help
          opacity-90 hover:opacity-100
          hover:text-[var(--color-teal)] focus-visible:text-[var(--color-teal)]
          transition-colors duration-150
          focus:outline-none
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[var(--color-teal)]/60
          focus-visible:rounded-sm
        "
        style={{
          borderBottom: "1px dotted currentColor",
        }}
      >
        {children}
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={
              reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: slideY.closed }
            }
            animate={{ opacity: 1, y: slideY.open }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: slideY.closed, transition: { duration: 0.12 } }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`
              absolute left-1/2 -translate-x-1/2 ${offsetClasses}
              z-50 pointer-events-none
              w-max max-w-[240px]
              px-3 py-2 rounded-xl
              backdrop-blur-md
              font-[family-name:var(--font-jetbrains)]
              text-[11px] leading-snug
              text-[var(--text-primary)]
              whitespace-normal text-left
              select-none
            `}
            style={{
              background: "rgba(10,10,15,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <span
              className="block text-[9.5px] tracking-[0.22em] uppercase mb-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </span>
            <span className="block text-[var(--text-primary)]">{citation}</span>

            {/* Pointer tail */}
            <span
              aria-hidden="true"
              className={`
                absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45
                ${placement === "top" ? "-bottom-1" : "-top-1"}
              `}
              style={{
                background: "rgba(10,10,15,0.95)",
                borderRight:
                  placement === "top"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderBottom:
                  placement === "top"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderLeft:
                  placement === "bottom"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderTop:
                  placement === "bottom"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
