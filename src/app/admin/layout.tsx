import type { Metadata, Viewport } from "next"
import { ToastContainer } from "react-toastify"

export const metadata: Metadata = {
	title: { default: "GSC Gestão", template: "%s · GSC Gestão" },
	applicationName: "GSC Gestão",
	robots: { index: false, follow: false },
	// PWA: o painel instala-se como app no ecrã inicial (sem lojas de apps).
	manifest: "/admin.webmanifest",
	appleWebApp: { capable: true, title: "GSC Gestão", statusBarStyle: "black-translucent" },
	icons: {
		icon: [
			{ url: "/icons/app-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icons/app-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: "/apple-icon.png",
	},
}

export const viewport: Viewport = {
	themeColor: "#070b16",
	viewportFit: "cover",
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<ToastContainer position="bottom-right" theme="colored" autoClose={3500} />
		</>
	)
}
