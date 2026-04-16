import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { AdSenseScript } from "@/components/ads/AdSenseScript";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";
const SITE_NAME = "CrispCalc";
const SITE_TAGLINE = "The air fryer conversion calculator, done right.";
const SITE_DESCRIPTION =
  "Convert any oven recipe to perfect air fryer settings in seconds — backed by the science of how air fryers actually cook.";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const IS_PROD = process.env.NODE_ENV === "production";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0C" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "food",
};

/** Site-wide JSON-LD: Organization + WebSite. Emitted in the body so
 *  it is inherited by every route without duplicating on subpages. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: `${SITE_URL}/icon.png`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
};

/**
 * Google Consent Mode v2 — default everything to "denied" before any
 * ad/analytics tag fires. The ConsentBanner flips this to "granted"
 * once the user accepts. Runs `beforeInteractive` so it lands ahead
 * of GA's hydration script.
 */
const CONSENT_DEFAULT_SNIPPET = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="consent-default" strategy="beforeInteractive">
          {CONSENT_DEFAULT_SNIPPET}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ConsentBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {IS_PROD && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
        {IS_PROD && ADSENSE_CLIENT_ID ? (
          <AdSenseScript clientId={ADSENSE_CLIENT_ID} />
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
