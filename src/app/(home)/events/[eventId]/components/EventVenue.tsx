import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import Parallax from "@/components/motion/Parallax"
import SectionHeading from "@/components/site/SectionHeading"
import type { EventRecord } from "@/types/event"

export default function EventVenue({ event }: { event: EventRecord }) {
	const v = event.venue
	const mapHref =
		v.mapUrl ||
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address || event.location)}`

	const items = [
		v.address && { icon: MapPin, label: "Endereço", value: v.address, href: mapHref, external: true },
		v.phone && { icon: Phone, label: "Telefone", value: v.phone, href: `tel:${v.phone.replace(/\s/g, "")}` },
		v.email && { icon: Mail, label: "Email", value: v.email, href: `mailto:${v.email}` },
	].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href: string; external?: boolean }[]

	return (
		<section className="section-y bg-paper">
			<div className="container-x">
				<SectionHeading eyebrow="Localização" title={v.title} text={v.subtitle} />

				{v.images.length > 0 && (
					<div className="mt-14 grid gap-4 md:grid-cols-2">
						{v.images.slice(0, 2).map((src, i) => (
							<div
								key={src}
								data-reveal="clip"
								className={`relative overflow-hidden rounded-[2rem] ${i === 0 ? "aspect-[4/3]" : "aspect-[4/3] md:mt-16"}`}>
								<Parallax className="absolute inset-0" speed={8} scale={1.15}>
									<div className="absolute inset-0">
										<Image src={src} alt={v.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
									</div>
								</Parallax>
							</div>
						))}
					</div>
				)}

				<ul className="mt-14 grid gap-4 md:grid-cols-3">
					{items.map(({ icon: Icon, label, value, href, external }) => (
						<li key={label} data-reveal>
							<a
								href={href}
								target={external ? "_blank" : undefined}
								rel={external ? "noreferrer" : undefined}
								className="group flex h-full items-start gap-4 rounded-3xl bg-background p-6 ring-1 ring-line transition-colors hover:bg-ink hover:text-white">
								<span
									className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
									style={{ background: "var(--ev-secondary)" }}>
									<Icon className="h-5 w-5" />
								</span>
								<span className="min-w-0 flex-1">
									<span className="block text-xs font-semibold tracking-widest uppercase opacity-60">{label}</span>
									<span className="mt-1 block break-words font-medium">{value}</span>
								</span>
								<ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition-transform duration-500 group-hover:rotate-45 group-hover:opacity-100" />
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
