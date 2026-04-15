"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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

// Viewport constants
const VIEWPORT_TOP_MARGIN = 80;
const VIEWPORT_SIDE_GUTTER = 12;
const TOOLTIP_MAX_WIDTH = 240;
const TOOLTIP_MIN_WIDTH = 160;
const ARROW_EDGE_SAFE = 12; // keep tail at least this far from tooltip's left/right

interface Position {
  placement: Placement;
  leftPx: number; // tooltip left in parent-local coords
  arrowPx: number; // tail left in tooltip-local coords
  maxWidth: number;
}

export default function CitationTooltip({
  children,
  citation,
  label = "SOURCE",
}: CitationTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pos, setPos] = useState<Position>({
    placement: "top",
    leftPx: 0,
    arrowPx: TOOLTIP_MAX_WIDTH / 2,
    maxWidth: TOOLTIP_MAX_WIDTH,
  });

  // Detect reduced motion preference once, with a live listener.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  // Compute both vertical placement AND horizontal clamp so the tooltip never
  // overflows the viewport on narrow screens or near-edge triggers. The tail
  // is re-anchored so it still points at the trigger's true center even when
  // the tooltip has been shifted inward.
  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const container = containerRef.current;
    if (!trigger || !container || typeof window === "undefined") return;

    const vw = window.innerWidth;
    const triggerRect = trigger.getBoundingClientRect();
    const parentLeft = container.getBoundingClientRect().left;

    // Available width (respect gutters); tooltip can shrink below max when
    // viewport is very narrow.
    const available = Math.max(
      TOOLTIP_MIN_WIDTH,
      vw - VIEWPORT_SIDE_GUTTER * 2
    );
    const tooltipWidth = Math.min(TOOLTIP_MAX_WIDTH, available);

    const placement: Placement =
      triggerRect.top < VIEWPORT_TOP_MARGIN ? "bottom" : "top";

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const desiredLeft = triggerCenterX - tooltipWidth / 2;
    const clampedLeft = Math.max(
      VIEWPORT_SIDE_GUTTER,
      Math.min(desiredLeft, vw - VIEWPORT_SIDE_GUTTER - tooltipWidth)
    );

    const leftPx = clampedLeft - parentLeft;
    const arrowPx = Math.max(
      ARROW_EDGE_SAFE,
      Math.min(triggerCenterX - clampedLeft, tooltipWidth - ARROW_EDGE_SAFE)
    );

    setPos({ placement, leftPx, arrowPx, maxWidth: tooltipWidth });
  }, []);

  const show = useCallback(() => {
    computePosition();
    setOpen(true);
  }, [computePosition]);

  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    if (open) {
      hide();
    } else {
      show();
    }
  }, [open, show, hide]);

  // Recompute synchronously after the tooltip mounts so its position is
  // correct on first paint (no flicker during the fade-in).
  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
  }, [open, computePosition]);

  // Escape closes; pointerdown outside closes for touch users.
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

  // Re-compute position on scroll/resize while open.
  useEffect(() => {
    if (!open) return;
    const onChange = () => computePosition();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [open, computePosition]);

  const offsetClasses = pos.placement === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const slideY =
    pos.placement === "top"
      ? { closed: 0, open: -4 }
      : { closed: 0, open: 4 };

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
                : {
                    opacity: 0,
                    y: slideY.closed,
                    transition: { duration: 0.12 },
                  }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`
              absolute ${offsetClasses}
              z-50 pointer-events-none
              px-3 py-2 rounded-xl
              backdrop-blur-md
              font-[family-name:var(--font-jetbrains)]
              text-[11px] leading-snug
              text-[var(--text-primary)]
              whitespace-normal text-left
              select-none
            `}
            style={{
              left: `${pos.leftPx}px`,
              width: "max-content",
              maxWidth: `${pos.maxWidth}px`,
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
            <span className="block text-[var(--text-primary)]">
              {citation}
            </span>

            {/* Pointer tail — anchored to trigger center, not tooltip center */}
            <span
              aria-hidden="true"
              className={`absolute w-2 h-2 ${
                pos.placement === "top" ? "-bottom-1" : "-top-1"
              }`}
              style={{
                left: `${pos.arrowPx}px`,
                transform: "translateX(-50%) rotate(45deg)",
                background: "rgba(10,10,15,0.95)",
                borderRight:
                  pos.placement === "top"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderBottom:
                  pos.placement === "top"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderLeft:
                  pos.placement === "bottom"
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                borderTop:
                  pos.placement === "bottom"
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
