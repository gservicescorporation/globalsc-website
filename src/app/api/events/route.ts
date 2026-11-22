import { getPublishedEvents, splitByDate } from "@/server/events"
import { json } from "@/server/http"

/**
 * GET /api/events — lista pública de eventos publicados.
 * Query: ?when=upcoming|past  &limit=N  &category=…
 */
export async function GET(req: Request) {
	const url = new URL(req.url)
	const when = url.searchParams.get("when")
	const limit = Number(url.searchParams.get("limit")) || undefined
	const category = url.searchParams.get("category")

	let events = await getPublishedEvents()
	if (when === "upcoming" || when === "past") events = splitByDate(events)[when]
	if (category) events = events.filter((e) => e.category === category)
	return json({ data: limit ? events.slice(0, limit) : events, total: events.length })
}
