"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import HeroV2 from "./sections/HeroV2";

// Lazy-load all below-the-fold sections
const ProblemV2 = dynamic(() => import("./sections/ProblemV2"), { ssr: false });
const DifferenceV2 = dynamic(() => import("./sections/DifferenceV2"), { ssr: false });
const PillarsV2 = dynamic(() => import("./sections/PillarsV2"), { ssr: false });
const FounderNoteV2 = dynamic(() => import("./sections/FounderNoteV2"), { ssr: false });
const MomentumV2 = dynamic(() => import("./sections/MomentumV2"), { ssr: false });
const FinalCTAV2 = dynamic(() => import("./sections/FinalCTAV2"), { ssr: false });
const FooterV2 = dynamic(() => import("./sections/FooterV2"), { ssr: false });

export default function PageClientV2() {
  useLenis();

  // Read the `?ref=` referral param on the client so the page itself can stay
  // statically prerendered (better SEO, faster TTFB, cacheable HTML).
  const [initialRef, setInitialRef] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setInitialRef(ref);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <HeroV2 initialRef={initialRef} />
        <ProblemV2 />
        <DifferenceV2 />
        <PillarsV2 />
        <FounderNoteV2 />
        <MomentumV2 />
        <FinalCTAV2 initialRef={initialRef} />
        <FooterV2 />
      </main>
    </MotionConfig>
  );
}
