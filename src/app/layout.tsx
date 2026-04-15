import type { Metadata, Viewport } from "next";
import { Playfair_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const SITE_URL = "https://orbly.app";
const TITLE =
  "Orbly — The first AI powered app that makes time something you can feel, not just read.";
const DESCRIPTION =
  "Orbly is the first AI-powered spatial calendar for iOS that makes time something you can feel, not just read. Join the waitlist for founding member access.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0F" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Orbly",
  },
  description: DESCRIPTION,
  applicationName: "Orbly",
  category: "productivity",
  keywords: [
    "Orbly",
    "spatial calendar",
    "AI calendar",
    "iOS calendar app",
    "visual calendar",
    "time management app",
    "ADHD calendar",
    "voice calendar",
    "focus timer",
    "task management",
    "calendar waitlist",
  ],
  authors: [{ name: "Orbly", url: SITE_URL }],
  creator: "Orbly",
  publisher: "Orbly",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Canonical — relative path resolves against metadataBase
  alternates: {
    canonical: "/",
  },

  // Open Graph — image auto-served from src/app/opengraph-image.tsx
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Orbly",
    type: "website",
    locale: "en_US",
  },

  // Twitter / X — image auto-served from src/app/opengraph-image.tsx (or twitter-image.tsx if added)
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // TODO: add official Twitter/X handle, e.g. "@orbly"
    // site: "@orbly",
    // creator: "@orbly",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Apple web app
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orbly",
    startupImage: [],
  },

  // Icons — Next.js auto-generates <link> tags from the file conventions:
  //   src/app/favicon.ico, src/app/icon.tsx, src/app/apple-icon.tsx
  // so we don't declare them explicitly in metadata to avoid duplicates.

  manifest: "/manifest.webmanifest",

  // Verification
  verification: {
    // TODO: add Google Search Console verification code
    // google: "your-google-site-verification-id",
    // TODO: add Bing / Yandex if applicable
    // yandex: "your-yandex-verification-id",
  },
};

// JSON-LD structured data for rich results
function JsonLd() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orbly",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "iOS 17+",
    description: DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    author: {
      "@type": "Organization",
      name: "Orbly",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      description: "Free for founding members for 12 months",
      url: SITE_URL,
    },
    aggregateRating: undefined, // Intentionally omitted — no fabricated ratings
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Orbly",
    url: SITE_URL,
    logo: `${SITE_URL}/opengraph-image`,
    // TODO: add sameAs entries (Twitter/X, LinkedIn, Product Hunt, GitHub) once public handles are set
    // sameAs: ["https://x.com/orbly", "https://www.linkedin.com/company/orbly"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Orbly",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "Orbly",
    },
    inLanguage: "en-US",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [softwareApp, organization, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${playfair.variable} ${jetbrains.variable} ${inter.variable} antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
