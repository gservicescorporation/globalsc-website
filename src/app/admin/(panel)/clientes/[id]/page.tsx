import { notFound } from "next/navigation"
import { getClientProfile, historyForClient, listClients, listInsurers } from "@/server/mediation"
import ClientDetail from "../../../_components/ClientDetail"

export const dynamic = "force-dynamic"
export const metadata = { title: "Cliente" }

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const profile = await getClientProfile(id).catch(() => null)
	if (!profile) notFound()
	const [insurers, clients, history] = await Promise.all([listInsurers(), listClients(), historyForClient(id)])
	const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
	return (
		<ClientDetail
			profile={plain(profile)}
			insurers={insurers.map((i) => ({ id: i.id, name: i.name }))}
			companies={clients.filter((c) => c.kind === "empresa" && c.id !== id).map((c) => ({ id: c.id, name: c.name }))}
			history={plain(history)}
		/>
	)
}
