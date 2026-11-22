import { Phone } from "lucide-react"
import type { Metadata } from "next"
import ClaimWizard from "@/components/wizard/ClaimWizard"
import WizardPage from "@/components/wizard/WizardPage"
import { tel } from "@/content/site"
import { getSiteContent } from "@/server/content"

export const revalidate = 300

export const metadata: Metadata = {
	title: "Participar um sinistro",
	description: "Teve um acidente ou dano? Envie as fotografias e a descrição. A equipa de sinistros da GSC trata do processo com a seguradora.",
	alternates: { canonical: "https://www.globalsc.ao/sinistros" },
}

export default async function SinistrosPage() {
	const content = await getSiteContent()
	const phone = content.contacts.phones.at(-1)
	return (
		<WizardPage
			eyebrow="Sinistros"
			title="Teve um sinistro? Envie-nos as fotografias. Nós tratamos do resto."
			text="Sem conta e sem papelada: o seu telefone ou email, o que aconteceu e as fotografias."
			aside={
				<div className="grid gap-3 lg:sticky lg:top-28">
					<div className="rounded-3xl bg-ink p-6 text-white">
						<p className="text-sm font-semibold tracking-widest text-accent uppercase">Em caso de urgência</p>
						<p className="mt-3 text-white/75">Se houver feridos, ligue primeiro para o 112 ou a polícia. Depois fale connosco.</p>
						{phone && (
							<a href={tel(phone)} className="mt-5 flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-base font-semibold text-ink">
								<Phone className="h-5 w-5" /> {phone}
							</a>
						)}
					</div>
					<div className="rounded-3xl bg-white p-6 ring-1 ring-line">
						<p className="font-semibold text-ink">O que fotografar</p>
						<ul className="mt-3 space-y-2 text-sm text-tertiary">
							<li>• Os danos, de perto e de longe</li>
							<li>• Matrículas das viaturas envolvidas</li>
							<li>• O local e a sinalização</li>
							<li>• Documentos: carta, livrete, auto da polícia</li>
						</ul>
					</div>
				</div>
			}>
			<ClaimWizard />
		</WizardPage>
	)
}
