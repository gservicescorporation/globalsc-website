import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import PageHero from "@/components/site/PageHero"
import PartnersMarquee from "@/components/site/PartnersMarquee"
import SectionHeading from "@/components/site/SectionHeading"
import { QUOTE_HREF } from "@/content/site"
import { getSiteContent } from "@/server/content"
import About from "../(landing-page)/components/About"
import Intro from "../(landing-page)/components/Intro"

export const metadata: Metadata = {
	title: "Sobre nós",
	description:
		"Conheça a Global Services Corporation: mediação de seguros, formação, gestão de eventos corporativos e comunicação em Angola.",
	alternates: { canonical: "https://www.globalsc.ao/sobre-nos" },
}

export const revalidate = 300

export default async function SobreNosPage() {
	const content = await getSiteContent()
	const { values: VALUES } = content.about
	const SERVICES = content.services
	return (
		<>
			<PageHero
				eyebrow="Sobre nós"
				title={
					<>
						Mediadores de seguros, <span className="serif-accent text-white/60">e muito mais.</span>
					</>
				}
				text="Uma empresa angolana com mais de dez anos de mediação de seguros, que hoje também forma equipas, organiza eventos empresariais e trata da comunicação de marcas."
				image="/images/epic-sana.jpg"
			/>

			<About story={content.about.story} advantages={content.about.advantages} />

			{/* Missão, visão e valores */}
			{VALUES.length > 0 && (
			<section className="section-y relative overflow-hidden bg-ink text-white">
				<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
				<div className="container-x relative">
					<SectionHeading
						tone="light"
						eyebrow="O que nos move"
						title={
							<>
								Missão, visão <span className="serif-accent text-white/60">e valores.</span>
							</>
						}
					/>
					<ul
						className={`mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 ring-1 ring-white/10 ${
							VALUES.length >= 3 ? "md:grid-cols-3" : VALUES.length === 2 ? "md:grid-cols-2" : ""
						}`}>
						{VALUES.map((v, i) => (
							<li key={`${v.title}-${i}`} data-reveal className="flex flex-col gap-6 bg-ink p-8 sm:p-10">
								<span className="text-sm font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
								<h3 className="text-3xl font-semibold tracking-tight">{v.title}</h3>
								<p className="leading-relaxed text-white/65">{v.text}</p>
							</li>
						))}
					</ul>
				</div>
			</section>
			)}

			<Intro manifesto={content.home.manifesto} stats={content.home.stats} />

			{/* Áreas de atuação */}
			{SERVICES.length > 0 && (
			<section className="section-y bg-paper">
				<div className="container-x">
					<SectionHeading
						eyebrow="Áreas de atuação"
						title={
							<>
								O que <span className="serif-accent text-royal">fazemos.</span>
							</>
						}
					/>
					<ul className="mt-14 divide-y divide-line border-y border-line">
						{SERVICES.map((s, i) => (
							<li key={`${s.id}-${i}`} data-reveal className="group grid items-center gap-6 py-8 md:grid-cols-12">
								<span className="text-sm font-semibold text-royal tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
								<h3 className="text-2xl font-semibold tracking-tight text-ink md:col-span-4 sm:text-3xl">{s.title}</h3>
								<p className="text-tertiary md:col-span-5">{s.description}</p>
								<div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:col-span-2 md:block">
									<Image
										src={s.image}
										alt=""
										fill
										sizes="200px"
										className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
									/>
								</div>
							</li>
						))}
					</ul>
					<div data-reveal className="mt-12 flex flex-wrap gap-3">
						<Link href={QUOTE_HREF} className="btn btn-dark">
							Pedir cotação de seguro <ArrowUpRight className="h-4 w-4" />
						</Link>
						<Link href="/seguros" className="btn btn-outline-dark">
							Conhecer os seguros
						</Link>
					</div>
				</div>
			</section>
			)}

			<PartnersMarquee logos={content.partners.logos} title={content.partners.title} />
		</>
	)
}
