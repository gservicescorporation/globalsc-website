import { hasDatabase, initDataSource } from "@/lib"
import { HeroSlideEntity, type HeroSlideRow } from "@/entities/schemas"
import type { HeroSlideRecord, SlidePlacement } from "@/types/event"
import { DEFAULT_SLIDES } from "./seed/default-slides"

async function repo() {
	const ds = await initDataSource()
	return ds.getRepository(HeroSlideEntity)
}

function toRecord(row: HeroSlideRow): HeroSlideRecord {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		imageUrl: row.imageUrl,
		videoUrl: row.videoUrl ?? "",
		link: row.link ?? "",
		buttonText: row.buttonText ?? "",
		overlay: row.overlay ?? "",
		placement: row.placement as SlidePlacement,
		order: row.order,
		active: row.active,
	}
}

export async function getAllSlides(): Promise<HeroSlideRecord[]> {
	if (!hasDatabase()) return DEFAULT_SLIDES
	const r = await repo()
	const rows = await r.find({ order: { order: "ASC", createdAt: "ASC" } })
	return rows.map(toRecord)
}

/** Destaques ativos para uma página. Usa os predefinidos se não houver nenhum. */
export async function getSlidesFor(
	page: "home" | "events"
): Promise<HeroSlideRecord[]> {
	let slides: HeroSlideRecord[] = DEFAULT_SLIDES
	if (hasDatabase()) {
		try {
			const all = await getAllSlides()
			if (all.length > 0) slides = all
		} catch (err) {
			console.error("[slides] erro a ler a base de dados:", err)
		}
	}
	return slides.filter(
		(s) => s.active && (s.placement === "both" || s.placement === page)
	)
}

export async function saveSlide(input: HeroSlideRecord) {
	if (!input.title?.trim()) throw new Error("O título é obrigatório.")
	if (!input.imageUrl?.trim()) throw new Error("A imagem é obrigatória.")
	const r = await repo()
	const row: Partial<HeroSlideRow> = {
		title: input.title.trim(),
		description: input.description ?? "",
		imageUrl: input.imageUrl,
		videoUrl: input.videoUrl || null,
		link: input.link || null,
		buttonText: input.buttonText || null,
		overlay: input.overlay || null,
		placement: input.placement || "both",
		order: Number(input.order) || 0,
		active: Boolean(input.active),
	}
	if (input.id && !input.id.startsWith("default-")) row.id = input.id
	await r.save(row)
}

export async function deleteSlide(id: string) {
	const r = await repo()
	await r.delete({ id })
}

export async function reorderSlides(ids: string[]) {
	const r = await repo()
	await Promise.all(ids.map((id, order) => r.update({ id }, { order })))
}

export async function importDefaultSlides() {
	const r = await repo()
	if ((await r.count()) > 0) return 0
	for (const s of DEFAULT_SLIDES) await saveSlide({ ...s, id: "" })
	return DEFAULT_SLIDES.length
}
