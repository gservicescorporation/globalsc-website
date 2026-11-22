import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Counter from "@/components/motion/Counter"
import EventsShowcase from "@/components/site/EventsShowcase"
import HeroSlider from "@/components/site/HeroSlider"
import PartnersMarquee from "@/components/site/PartnersMarquee"
import SectionHeading from "@/components/site/SectionHeading"
import { getSiteContent } from "@/server/content"
import { getPublishedEvents, splitByDate } from "@/server/events"
import { getSlidesFor } from "@/server/slides"

export const revalidate = 300

export default async function EventsPage() {
	const [slides, events, content] = await Promise.all([getSlidesFor("events"), getPublishedEvents(), getSiteContent()])
	const BRANDS = content.events.brands
	const { upcoming, past } = splitByDate(events)
	const stats = content.events.stats.map((s, i) =>
		i === 0 ? { ...s, value: Math.max(s.value, events.length) } : s
	)

	return (
		<>
			<HeroSlider slides={slides} eyebrow="Gestão de eventos corporativos" />

			{/* Números */}
			{stats.length > 0 && (
			<section className="relative bg-ink pb-20 text-white">
				<div className="container-x">
					<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-white/10 ring-1 ring-white/10 lg:grid-cols-4">
						{stats.map((s) => (
							<div key={s.label} data-reveal className="flex flex-col gap-2 bg-ink p-6 sm:p-10">
								<dt className="order-2 text-sm text-white/55">{s.label}</dt>
								<dd className="order-1 text-4xl font-bold tracking-tight sm:text-6xl">
									<Counter value={s.value} suffix={s.suffix} />
								</dd>
							</div>
						))}
					</dl>
				</div>
			</section>
			)}

			<EventsShowcase
				eyebrow="Agenda"
				title={
					<>
						Próximos <span className="serif-accent text-royal">eventos.</span>
					</>
				}
				text="Garanta o seu lugar nos encontros que vão marcar a agenda empresarial angolana."
				events={upcoming}
				limit={6}
				empty="Sem novos eventos agendados por agora — acompanhe as nossas redes para novidades."
			/>

			{/* Marcas registadas */}
			{BRANDS.length > 0 && (
			<section className="section-y bg-paper">
				<div className="container-x">
					<SectionHeading
						eyebrow="Marcas registadas"
						title={
							<>
								Formatos com <span className="serif-accent text-royal">assinatura própria.</span>
							</>
						}
						text="Marcas que refletem a identidade e a excelência dos nossos eventos corporativos."
					/>
					<ul className="mt-14 grid gap-6 md:grid-cols-3">
						{BRANDS.map((b, i) => (
							<li
								key={b.title}
								data-reveal="up"
								data-reveal-delay={i * 0.05}
								className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink">
								<Image
									src={b.image}
									alt={b.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
								<div className="absolute inset-x-0 bottom-0 p-7 text-white">
									<h3 className="text-2xl font-semibold tracking-tight">{b.title}</h3>
									<p className="mt-3 max-h-0 overflow-hidden text-sm text-white/70 opacity-0 transition-all duration-700 group-hover:max-h-40 group-hover:opacity-100 max-md:max-h-40 max-md:opacity-100">
										{b.description}
									</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>
			)}

			<EventsShowcase
				eyebrow="Arquivo"
				title={
					<>
						Eventos <span className="serif-accent text-royal">recentes.</span>
					</>
				}
				text="Reviva os encontros que já fizeram história."
				events={past}
				limit={6}
			/>

			<PartnersMarquee logos={content.partners.logos} title={content.partners.title} />

			{/* Parceria */}
			<section className="bg-paper pb-24">
				<div className="container-x">
					<div
						data-reveal="clip"
						className="relative overflow-hidden rounded-[2rem] bg-royal px-7 py-16 text-white sm:px-14 sm:py-20">
						<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
						<div
							aria-hidden
							className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/40 blur-[120px]"
						/>
						<div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
							<div className="max-w-2xl">
								<span className="eyebrow text-white/70">Parcerias</span>
								<h2 className="display-md mt-5">
									Quer associar a sua marca aos nossos eventos?
								</h2>
								<p className="mt-5 text-white/75">
									Junte-se à nossa rede de parceiros e patrocinadores e descubra como
									podemos crescer juntos.
								</p>
							</div>
							<Link href="/contact-us" className="btn btn-light self-start lg:self-auto">
								Tornar-me parceiro <ArrowUpRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
