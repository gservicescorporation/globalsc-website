import { deleteSlide, saveSlide } from "@/server/slides"
import { body, fail, guard, handle, json, refreshSite } from "@/server/http"
import type { HeroSlideRecord } from "@/types/event"

type Ctx = { params: Promise<{ id: string }> }

/** PUT /api/admin/slides/:id */
export async function PUT(req: Request, { params }: Ctx) {
	const g = await guard()
	if (g.error) return g.error
	const input = await body<HeroSlideRecord>(req)
	if (!input) return fail("JSON inválido.")
	try {
		await saveSlide({ ...input, id: (await params).id })
		refreshSite()
		return json({ ok: true })
	} catch (err) {
		return handle(err)
	}
}

/** DELETE /api/admin/slides/:id */
export async function DELETE(_req: Request, { params }: Ctx) {
	const g = await guard()
	if (g.error) return g.error
	try {
		await deleteSlide((await params).id)
		refreshSite()
		return json({ ok: true })
	} catch (err) {
		return handle(err)
	}
}
