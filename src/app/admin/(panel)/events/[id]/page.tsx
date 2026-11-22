import { notFound } from "next/navigation"
import { hasDatabase } from "@/lib"
import { getEventById } from "@/server/events"
import EventForm from "../../../_components/EventForm"

export const dynamic = "force-dynamic"
export const metadata = { title: "Editar evento" }

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const event = await getEventById(id)
	if (!event) notFound()
	return <EventForm key={event.updatedAt ?? event.id} initial={event} readOnly={!hasDatabase()} />
}
