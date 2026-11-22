import { getAllEventsForAdmin, saveEvent } from "@/server/events"
import { body, fail, guard, handle, json, refreshSite } from "@/server/http"
import type { EventRecord } from "@/types/event"

/** GET /api/admin/events — todos os eventos (incluindo rascunhos). */
export async function GET() {
	const g = await guard()
	if (g.error) return g.error
	try {
		return json({ data: await getAllEventsForAdmin() })
	} catch (err) {
		return handle(err)
	}
}

/** POST /api/admin/events — cria um evento. */
export async function POST(req: Request) {
	const g = await guard()
	if (g.error) return g.error
	const input = await body<EventRecord>(req)
	if (!input) return fail("JSON inválido.")
	try {
		const saved = await saveEvent({ ...input, id: "" })
		refreshSite()
		return json({ data: saved }, 201)
	} catch (err) {
		return handle(err)
	}
}
