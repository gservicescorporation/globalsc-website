import { hasDatabase } from "@/lib"
import { listClients } from "@/server/mediation"
import ClientsList from "../../_components/ClientsList"
import { Empty, PageTitle } from "../../_components/ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Clientes" }

export default async function ClientesPage() {
	const clients = hasDatabase() ? await listClients().catch(() => []) : []
	return (
		<div className="grid gap-6">
			<PageTitle title="Clientes" text="Empresas e colaboradores, com as suas apólices. É daqui que a IA tira plafonds e cláusulas." />
			{!hasDatabase() ? <Empty>Base de dados não configurada.</Empty> : <ClientsList clients={JSON.parse(JSON.stringify(clients))} />}
		</div>
	)
}
