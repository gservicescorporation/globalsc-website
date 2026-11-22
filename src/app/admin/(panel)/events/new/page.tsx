import { hasDatabase } from "@/lib"
import { emptyEvent } from "@/server/normalize"
import EventForm from "../../../_components/EventForm"

export const metadata = { title: "Novo evento" }

export default function NewEventPage() {
	return <EventForm initial={emptyEvent()} readOnly={!hasDatabase()} />
}
