import { notFound } from "next/navigation"
import { getClaim, getClientProfile, listTemplates } from "@/server/mediation"
import ClaimDetail from "../../../_components/ClaimDetail"

export const dynamic = "force-dynamic"
export const metadata = { title: "Sinistro" }

export default async function SinistroPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const claim = await getClaim(id).catch(() => null)
	if (!claim) notFound()
	const [profile, templates] = await Promise.all([claim.clientId ? getClientProfile(claim.clientId) : null, listTemplates()])
	return (
		<ClaimDetail
			claim={JSON.parse(JSON.stringify(claim))}
			profile={profile ? JSON.parse(JSON.stringify(profile)) : null}
			templates={templates}
		/>
	)
}
