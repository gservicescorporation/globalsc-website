import { getAllSlides, reorderSlides, saveSlide } from "@/server/slides"
import { body, fail, guard, handle, json, refreshSite } from "@/server/http"
import type { HeroSlideRecord } from "@/types/event"

/** GET /api/admin/slides — todos os destaques. */
export async function GET() {
	const g = await guard()
	if (g.error) return g.error
	try {
		return json({ data: await getAllSlides() })
	} catch (err) {
		return handle(err)
	}
}

/** POST /api/admin/slides — cria um destaque. */
export async function POST(req: Request) {
	const g = await guard()
	if (g.error) return g.error
	const input = await body<HeroSlideRecord>(req)
	if (!input) return fail("JSON inválido.")
	try {
		await saveSlide({ ...input, id: "" })
		refreshSite()
		return json({ ok: true }, 201)
	} catch (err) {
		return handle(err)
	}
}

/** PUT /api/admin/slides — reordena: { ids: string[] }. */
export async function PUT(req: Request) {
	const g = await guard()
	if (g.error) return g.error
	const input = await body<{ ids: string[] }>(req)
	if (!Array.isArray(input?.ids)) return fail("Envie { ids: string[] }.")
	try {
		await reorderSlides(input.ids)
		refreshSite()
		return json({ ok: true })
	} catch (err) {
		return handle(err)
	}
}
