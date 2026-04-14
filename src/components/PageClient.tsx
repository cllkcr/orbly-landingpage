"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import Hero from "./Hero";
import Footer from "./Footer";
import Referral from "./Referral";

// Lazy-load below-the-fold sections — they won't block initial paint
const Problem = dynamic(() => import("./Problem"), { ssr: false });
const FounderNote = dynamic(() => import("./FounderNote"), { ssr: false });
const HowItWorks = dynamic(() => import("./HowItWorks"), { ssr: false });
const SocialProof = dynamic(() => import("./SocialProof"), { ssr: false });
const FinalCTA = dynamic(() => import("./FinalCTA"), { ssr: false });

export default function PageClient() {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero />
        <Problem />
        <FounderNote />
        <HowItWorks />
        <SocialProof />
        <FinalCTA />
        <Referral />
        <Footer />
      </main>
    </MotionConfig>
  );
}
