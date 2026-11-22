import { Plus } from "lucide-react"
import Link from "next/link"
import { hasDatabase } from "@/lib"
import { getAllEventsForAdmin } from "@/server/events"
import { toSummary } from "@/server/normalize"
import EventsTable from "../../_components/EventsTable"

export const dynamic = "force-dynamic"
export const metadata = { title: "Eventos" }

export default async function AdminEventsPage() {
	let error: string | null = null
	const events = await getAllEventsForAdmin().catch((e: Error) => {
		error = e.message
		return []
	})

	return (
		<div className="grid gap-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Eventos</h1>
					<p className="mt-1 text-sm text-tertiary">{events.length} eventos no total</p>
				</div>
				<Link href="/admin/events/new" className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal">
					<Plus className="h-4 w-4" /> Novo evento
				</Link>
			</div>
			{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">Erro a ligar à base de dados: {error}</p>}
			<EventsTable events={events.map(toSummary)} readOnly={!hasDatabase()} />
		</div>
	)
}
