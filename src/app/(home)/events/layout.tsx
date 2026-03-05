// app/events/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "Eventos Corporativos em Angola | Global Services Corporation",
    template: "%s | Global Services Corporation",
  },
  description:
    "Descubra os eventos corporativos de alto nível promovidos pela Global Services Corporation em Angola. Networking, inovação e oportunidades de negócios.",
  keywords: [
    "eventos em Angola",
    "networking empresarial",
    "gestão empresarial",
    "Global Services Corporation",
    "eventos corporativos",
    "consultoria Angola",
    "conferências empresariais",
    "eventos de negócios",
  ],
  openGraph: {
    title: "Eventos Corporativos em Angola | Global Services Corporation",
    description:
      "Participe dos principais eventos de networking e negócios em Angola, promovidos pela Global Services Corporation.",
    url: "https://globalsc.ao",
    siteName: "Global Services Corporation",
    images: [
      {
        url: "https://globalsc.ao/logo/with-bg.png",
        width: 1920,
        height: 1040,
        alt: "Eventos Corporativos Global Services Corporation",
      },
    ],
    locale: "pt-PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventos Corporativos em Angola | Global Services Corporation",
    description:
      "Networking e oportunidades empresariais com a Global Services Corporation.",
    images: ["https://globalsc.ao/logo/with-bg.png"],
  },
  alternates: {
    canonical: "https://globalsc.ao/events",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      <Script
        id="structured-data-events"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Global Services Corporation",
            url: "https://globalsc-website-v2",
            logo: "https://globalsc.ao/logo.png",
            department: {
              "@type": "Organization",
              name: "Eventos Corporativos",
              url: "https://globalsc.ao/events",
              description:
                "A Global Services Corporation organiza eventos empresariais, conferências e encontros de networking em Angola.",
            },
          }),
        }}
      />
    </>
  );
}
