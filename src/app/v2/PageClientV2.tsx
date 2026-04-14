"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import HeroV2 from "./sections/HeroV2";

// Lazy-load all below-the-fold sections
const ProblemV2 = dynamic(() => import("./sections/ProblemV2"), { ssr: false });
const DifferenceV2 = dynamic(() => import("./sections/DifferenceV2"), { ssr: false });
const PillarsV2 = dynamic(() => import("./sections/PillarsV2"), { ssr: false });
const FounderNoteV2 = dynamic(() => import("./sections/FounderNoteV2"), { ssr: false });
const SocialProofV2 = dynamic(() => import("./sections/SocialProofV2"), { ssr: false });
const FinalCTAV2 = dynamic(() => import("./sections/FinalCTAV2"), { ssr: false });
const ReferralV2 = dynamic(() => import("./sections/ReferralV2"), { ssr: false });
const FooterV2 = dynamic(() => import("./sections/FooterV2"), { ssr: false });

interface PageClientV2Props {
  initialRef?: string;
}

export default function PageClientV2({ initialRef }: PageClientV2Props) {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <HeroV2 initialRef={initialRef} />
        <ProblemV2 />
        <DifferenceV2 />
        <PillarsV2 />
        <FounderNoteV2 />
        <SocialProofV2 />
        <FinalCTAV2 initialRef={initialRef} />
        <ReferralV2 />
        <FooterV2 />
      </main>
    </MotionConfig>
  );
}
