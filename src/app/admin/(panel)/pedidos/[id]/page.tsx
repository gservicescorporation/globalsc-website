import { notFound } from "next/navigation"
import { documentsForType, getClientProfile, getQuote } from "@/server/mediation"
import QuoteDetail from "../../../_components/QuoteDetail"

export const dynamic = "force-dynamic"
export const metadata = { title: "Pedido de seguro" }

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const quote = await getQuote(id).catch(() => null)
	if (!quote) notFound()
	const [profile, docs] = await Promise.all([
		quote.clientId ? getClientProfile(quote.clientId) : null,
		documentsForType(quote.insuranceType),
	])
	return (
		<QuoteDetail
			quote={JSON.parse(JSON.stringify(quote))}
			profile={profile ? JSON.parse(JSON.stringify(profile)) : null}
			docs={docs.map((d) => ({ id: d.id, title: d.title, insurerName: d.insurerName, hasFile: Boolean(d.fileUrl) }))}
		/>
	)
}
