import { deleteEvent, getEventById, saveEvent } from "@/server/events"
import { body, fail, guard, handle, json, refreshSite } from "@/server/http"
import type { EventRecord } from "@/types/event"

type Ctx = { params: Promise<{ id: string }> }

/** GET /api/admin/events/:id */
export async function GET(_req: Request, { params }: Ctx) {
	const g = await guard()
	if (g.error) return g.error
	const event = await getEventById((await params).id)
	return event ? json({ data: event }) : fail("Evento não encontrado.", 404)
}

/** PUT /api/admin/events/:id — substitui (ou atualiza parcialmente) o evento. */
export async function PUT(req: Request, { params }: Ctx) {
	const g = await guard()
	if (g.error) return g.error
	const { id } = await params
	const input = await body<Partial<EventRecord>>(req)
	if (!input) return fail("JSON inválido.")
	try {
		const current = await getEventById(id)
		if (!current) return fail("Evento não encontrado.", 404)
		const saved = await saveEvent({ ...current, ...input, id })
		refreshSite()
		return json({ data: saved })
	} catch (err) {
		return handle(err)
	}
}

export const PATCH = PUT

/** DELETE /api/admin/events/:id */
export async function DELETE(_req: Request, { params }: Ctx) {
	const g = await guard()
	if (g.error) return g.error
	try {
		await deleteEvent((await params).id)
		refreshSite()
		return json({ ok: true })
	} catch (err) {
		return handle(err)
	}
}
