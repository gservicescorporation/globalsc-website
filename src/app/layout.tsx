import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
})

export const metadata: Metadata = {
	title: "Global Services Corporation",
	description: "Mediação de Seguros, Gestão de Eventos e Formação Profissional",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Global Services Corporation",
		description:
			"Mediação de Seguros, Gestão de Eventos e Formação Profissional",
		url: "https://globalsc.ao",
		siteName: "Global Services Corporation",
		images: [
			{
				url: "https://globalsc.ao/logo/with-bg.png",
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
		images: ["https://globalsc.ao/logo/with-bg.png"],
	},
	metadataBase: new URL("https://globalsc.ao"),
	authors: [
		{
			name: "Global Services Corporation",
			url: "https://globalsc.ao",
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
  themeColor: "#ffffff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-PT">
			<body className={`${poppins.variable} antialiased`}>
				{children}

				<Script
					id="structured-data"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Organization",
							name: "Global Services Corporation",
							url: "https://globalsc.ao",
							logo: "https://globalsc.ao/logo/with-bg.png",
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
									url: "https://globalsc.ao",
								},
								{
									"@type": "Organization",
									name: "Gestão de Eventos",
									url: "https://globalsc.ao/events",
								},
								{
									"@type": "Organization",
									name: "Eventos",
									url: "https://globalsc.ao/events/all",
								},
								{
									"@type": "Organization",
									name: "Entrar em contacto",
									url: "https://globalsc.ao/contact-us",
								},
							],
						}),
					}}
				/>
			</body>
		</html>
	)
}
