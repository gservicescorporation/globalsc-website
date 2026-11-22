import SmoothScroll from "@/components/motion/SmoothScroll"
import { getSiteContent } from "@/server/content"
import Footer from "../ui/Footer"
import Header from "../ui/Header"

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
	const content = await getSiteContent()
	const chrome = { contacts: content.contacts, socials: content.socials }
	return (
		<SmoothScroll>
			<a
				href="#conteudo"
				className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
				Saltar para o conteúdo
			</a>
			<Header chrome={chrome} />
			<main id="conteudo" className="min-h-screen">
				{children}
			</main>
			<Footer chrome={chrome} />
		</SmoothScroll>
	)
}
