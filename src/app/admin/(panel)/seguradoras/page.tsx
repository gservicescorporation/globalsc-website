import { hasDatabase } from "@/lib"
import { listInsurers, repos } from "@/server/mediation"
import InsurersList from "../../_components/InsurersList"
import { Empty, PageTitle } from "../../_components/ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Seguradoras" }

async function load() {
	const insurers = await listInsurers()
	const r = await repos()
	const [docs, templates] = await Promise.all([r.documents.find(), r.templates.find()])
	return insurers.map((i) => ({
		id: i.id,
		name: i.name,
		logoUrl: i.logoUrl,
		active: i.active,
		docs: docs.filter((d) => d.insurerId === i.id).length,
		templates: templates.filter((t) => t.insurerId === i.id).length,
	}))
}

export default async function SeguradorasPage() {
	const insurers = hasDatabase() ? await load().catch(() => []) : []
	return (
		<div className="grid gap-6">
			<PageTitle
				title="Seguradoras"
				text="Os documentos de cada seguradora (condições, tabelas de prémios) são a base das recomendações da IA. Os modelos de participação são preenchidos automaticamente nos sinistros."
			/>
			{!hasDatabase() ? <Empty>Base de dados não configurada.</Empty> : <InsurersList insurers={insurers} />}
		</div>
	)
}
