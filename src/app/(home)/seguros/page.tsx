import { ArrowUpRight, Phone } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { InsuranceHighlight, InsuranceSteps } from "@/components/site/Insurance"
import PageHero from "@/components/site/PageHero"
import PartnersMarquee from "@/components/site/PartnersMarquee"
import { CLAIM_HREF, QUOTE_HREF, tel } from "@/content/site"
import { getSiteContent } from "@/server/content"

export const revalidate = 300

export const metadata: Metadata = {
	title: "Mediação de Seguros",
	description:
		"Mediação de seguros em Angola: automóvel, saúde, acidentes de trabalho, multirriscos, responsabilidade civil e mais. Comparamos seguradoras e gerimos os seus sinistros.",
	alternates: { canonical: "https://www.globalsc.ao/seguros" },
}

export default async function SegurosPage() {
	const content = await getSiteContent()
	const phone = content.contacts.phones.at(-1)

	return (
		<>
			<PageHero
				eyebrow="Mediação de seguros"
				title={
					<>
						Proteja a empresa, a frota e a família{" "}
						<span className="serif-accent text-white/60">com quem compara por si.</span>
					</>
				}
				text="Pedimos propostas a várias seguradoras, explicamos as diferenças e ficamos consigo depois da assinatura — sobretudo quando há um sinistro."
				image="/images/consulting-clients.jpg">
				<div data-reveal className="mt-10 flex flex-wrap gap-3">
					<Link href={QUOTE_HREF} className="btn btn-light">
						Pedir cotação <ArrowUpRight className="h-4 w-4" />
					</Link>
					<Link href={CLAIM_HREF} className="btn btn-outline-light">
						Participar sinistro
					</Link>
					{phone && (
						<a href={tel(phone)} className="btn btn-outline-light">
							<Phone className="h-4 w-4" /> {phone}
						</a>
					)}
				</div>
			</PageHero>

			<InsuranceHighlight insurance={content.insurance} showPageLink={false} />
			<InsuranceSteps steps={content.insurance.steps} />
			<PartnersMarquee logos={content.insurance.partners.logos} title={content.insurance.partners.title} />
		</>
	)
}
