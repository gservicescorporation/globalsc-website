// app/contact-us/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ToastContainer } from "react-toastify";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "Contacte-nos | Global Services Corporation",
    template: "%s | Global Services Corporation",
  },
  description:
    "Entre em contacto com a Global Services Corporation. Estamos prontos para atender empresas e organizações em Angola com soluções de consultoria, eventos e serviços corporativos.",
  keywords: [
    "contacto Global Services Corporation",
    "consultoria Angola",
    "serviços empresariais Angola",
    "contactar empresa Angola",
    "corporate services Angola",
    "eventos empresariais Angola",
  ],
  openGraph: {
    title: "Contacte a Global Services Corporation",
    description:
      "Fale com a nossa equipa e descubra como a Global Services Corporation pode ajudar a sua empresa a crescer em Angola.",
    url: "https://globalsc.ao/contact-us",
    siteName: "Global Services Corporation",
    images: [
      {
        url: "https://globalsc.ao/logo/with-bg.png",
        width: 1200,
        height: 630,
        alt: "Escritório da Global Services Corporation em Angola",
      },
    ],
    locale: "pt_AO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacte a Global Services Corporation",
    description:
      "Entre em contacto com a Global Services Corporation para consultoria, eventos e serviços empresariais em Angola.",
    images: ["https://globalsc.ao/logo/with-bg.png"],
  },
  alternates: {
    canonical: "https://globalsc.ao/contact-us",
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastContainer />

      {children}

      <Script
        id="structured-data-contact"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Global Services Corporation",
            url: "https://globalsc-website-v2",
            logo: "https://globalsc.ao/logo/white.png",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+244941064919",
                contactType: "customer service",
                areaServed: "AO",
                availableLanguage: ["pt", "en"],
              },
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Rua Dr. Aleixo de Abreu, Luanda",
              addressLocality: "Luanda",
              addressCountry: "AO",
            },
            sameAs: [
              "https://www.facebook.com/p/Global-Services-Corporation-100094301594638/",
              "https://www.instagram.com/globalservicescorporation/",
              "https://ao.linkedin.com/company/global-service-corporations",
            ],
          }),
        }}
      />
    </>
  );
}
