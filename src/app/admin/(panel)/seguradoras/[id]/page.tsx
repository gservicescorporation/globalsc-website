import { notFound } from "next/navigation"
import { getInsurer } from "@/server/mediation"
import InsurerDetail from "../../../_components/InsurerDetail"

export const dynamic = "force-dynamic"
export const metadata = { title: "Seguradora" }

export default async function SeguradoraPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const data = await getInsurer(id).catch(() => null)
	if (!data) notFound()
	return <InsurerDetail data={JSON.parse(JSON.stringify(data))} />
}
