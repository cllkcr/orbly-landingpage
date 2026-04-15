import PageClientV2 from "./v2/PageClientV2";

// The referral `?ref=` query param is read on the client (see PageClientV2).
// Keeping this route statically prerendered is important for SEO: faster TTFB,
// cacheable HTML, and better Core Web Vitals.
export default function Home() {
  return <PageClientV2 />;
}
