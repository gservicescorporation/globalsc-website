import { Clock, Mail, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import QuoteWizard from "@/components/wizard/QuoteWizard"
import WizardPage from "@/components/wizard/WizardPage"

export const metadata: Metadata = {
	title: "Pedir cotação de seguro",
	description:
		"Diga-nos o que precisa de proteger. Comparamos as seguradoras e enviamos a melhor solução para o seu email — para empresas e particulares em Angola.",
	alternates: { canonical: "https://www.globalsc.ao/seguros/pedido" },
}

export default async function PedidoPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
	const { tipo } = await searchParams
	return (
		<WizardPage
			eyebrow="Pedido de seguro"
			title="Diga-nos o que quer proteger. Nós comparamos por si."
			text="Sem conta, sem compromisso. Recebe a melhor solução no seu email."
			aside={
				<ul className="grid gap-3 lg:sticky lg:top-28">
					{[
						{ icon: Clock, t: "Menos de 2 minutos", d: "Só o essencial é obrigatório." },
						{ icon: ShieldCheck, t: "Várias seguradoras", d: "Comparamos coberturas, franquias e preço." },
						{ icon: Mail, t: "Resposta por email", d: "Normalmente em 1 a 2 dias úteis." },
					].map(({ icon: Icon, t, d }) => (
						<li key={t} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
							<Icon className="mt-0.5 h-6 w-6 shrink-0 text-royal" />
							<span>
								<span className="block font-semibold text-ink">{t}</span>
								<span className="text-sm text-tertiary">{d}</span>
							</span>
						</li>
					))}
				</ul>
			}>
			<QuoteWizard initialType={tipo} />
		</WizardPage>
	)
}
