import { Suspense } from "react"
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react"
import PageHero from "@/components/site/PageHero"
import { contactLinks } from "@/content/site"
import { getSiteContent } from "@/server/content"
import ContactUsForm from "./components/ContactUsForm"

export const revalidate = 300

export default async function ContactUs() {
	const content = await getSiteContent()
	const CONTACTS = contactLinks(content.contacts)
	const SOCIALS = content.socials
	const cards = [
		{ icon: Mail, label: "Email", lines: CONTACTS.emails },
		{ icon: Phone, label: "Telefone", lines: CONTACTS.phones },
		{ icon: MapPin, label: "Escritório", lines: !CONTACTS.address ? [] : [{ label: CONTACTS.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACTS.address)}` }] },
		{ icon: Clock, label: "Horário", lines: CONTACTS.hours ? [{ label: CONTACTS.hours, href: "" }] : [] },
	]

	return (
		<>
			<PageHero
				eyebrow="Contactos"
				title={
					<>
						Fale com um <span className="serif-accent text-white/60">consultor.</span>
					</>
				}
				text="Peça uma cotação de seguro, uma proposta de formação ou de evento. Respondemos em dias úteis."
				image="/images/corporate-event.jpg"
			/>

			<section className="section-y bg-background">
				<div className="container-x grid gap-12 lg:grid-cols-12">
					<div className="flex flex-col gap-4 lg:col-span-5">
						{cards.filter((c) => c.lines.length > 0).map(({ icon: Icon, label, lines }) => (
							<div key={label} data-reveal className="flex gap-5 rounded-3xl bg-paper p-6 ring-1 ring-line">
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-royal/10 text-royal">
									<Icon className="h-5 w-5" />
								</span>
								<div className="flex flex-col gap-1">
									<span className="text-xs font-semibold tracking-widest text-muted uppercase">{label}</span>
									{lines.map((l) =>
										l.href ? (
											<a
												key={l.label}
												href={l.href}
												target={l.href.startsWith("http") ? "_blank" : undefined}
												rel="noreferrer"
												className="font-medium text-ink transition-colors hover:text-royal">
												{l.label}
											</a>
										) : (
											<span key={l.label} className="font-medium text-ink">
												{l.label}
											</span>
										)
									)}
								</div>
							</div>
						))}

						<div data-reveal className="mt-2 flex flex-wrap gap-2">
							{SOCIALS.map((s) => (
								<a
									key={s.name}
									href={s.href}
									target="_blank"
									rel="noreferrer"
									className="btn btn-outline-dark py-2.5">
									{s.name} <ArrowUpRight className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					<div data-reveal="up" className="lg:col-span-7">
						<Suspense fallback={<div className="h-[640px] animate-pulse rounded-[2rem] bg-paper ring-1 ring-line" />}>
							<ContactUsForm />
						</Suspense>
					</div>
				</div>
			</section>
		</>
	)
}
