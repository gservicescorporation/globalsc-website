import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const jakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-jakarta",
	display: "swap",
})

const instrument = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	style: ["normal", "italic"],
	variable: "--font-instrument",
	display: "swap",
})

export const metadata: Metadata = {
	title: {
		default: "Global Services Corporation",
		template: "%s | Global Services Corporation",
	},
	description: "Mediação de Seguros, Gestão de Eventos e Formação Profissional",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Global Services Corporation",
		description:
			"Mediação de Seguros, Gestão de Eventos e Formação Profissional",
		url: "https://www.globalsc.ao",
		siteName: "Global Services Corporation",
		images: [
			{
				url: "https://www.globalsc.ao/logo/with-bg.png",
				width: 1920,
				height: 1040,
				alt: "Global Services Corporation", 
			},
		],
		locale: "pt-PT",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Global Services Corporation",
		description:
			"Mediação de Seguros, Gestão de Eventos e Formação Profissional",
		images: ["https://www.globalsc.ao/logo/with-bg.png"],
	},
	metadataBase: new URL("https://www.globalsc.ao"),
	authors: [
		{
			name: "Global Services Corporation",
			url: "https://www.globalsc.ao",
		},
	],
	keywords: [
		"Seguros",
		"Mediação de Seguros",
		"Gestão de Eventos",
		"Formação Profissional",
		"Global Services Corporation",
		"GSCorporation",
		"Seguros em Angola",
		"Eventos Corporativos",
		"Cursos de Formação",
		"Consultoria de Seguros",
	],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b16",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="pt-PT"
			suppressHydrationWarning
			className={`${jakarta.variable} ${instrument.variable}`}>
			<head>
				{/* Marca o documento como "com JS" antes da pintura (evita flash nas animações). */}
				<script
					dangerouslySetInnerHTML={{
						__html: "document.documentElement.classList.add('js')",
					}}
				/>
			</head>
			<body className="antialiased">
				{children}

				<Script
					id="structured-data"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Global Services Corporation",
							url: "https://www.globalsc.ao",
							logo: "https://www.globalsc.ao/logo/with-bg.png",
							sameAs: [
								"https://www.facebook.com/p/Global-Services-Corporation-100094301594638/",
								"https://www.instagram.com/globalservicescorporation/",
								"https://ao.linkedin.com/company/global-service-corporations",
							],
							contactPoint: [
								{
									"@type": "ContactPoint",
									telephone: "+244 941 064 919",
									contactType: "customer service",
									areaServed: "AO",
									availableLanguage: ["pt", "en"],
								},
							],
							department: [
								{
									"@type": "Organization",
									name: "Mediação de Seguros",
									url: "https://www.globalsc.ao",
								},
								{
									"@type": "Organization",
									name: "Gestão de Eventos",
									url: "https://www.globalsc.ao/events",
								},
								{
									"@type": "Organization",
									name: "Eventos",
									url: "https://www.globalsc.ao/events/all",
								},
								{
									"@type": "Organization",
									name: "Entrar em contacto",
									url: "https://www.globalsc.ao/contact-us",
								},
							],
						}),
					}}
				/>
			</body>
		</html>
	)
}
