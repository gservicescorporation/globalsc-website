import { randomUUID } from "crypto"
import { hasDatabase, initDataSource } from "@/lib"
import { EventEntity, type EventRow } from "@/entities/schemas"
import type { EventRecord, EventSummary } from "@/types/event"
import { fromLegacy, normalizeEvent, slugify, toSummary } from "./normalize"
import legacy from "./seed/legacy-events.json"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function legacyEvents(): EventRecord[] {
	return legacy.events.map(fromLegacy)
}

async function repo() {
	const ds = await initDataSource()
	return ds.getRepository(EventEntity)
}

function rowToRecord(row: EventRow): EventRecord {
	return normalizeEvent({
		...(row.data as Partial<EventRecord>),
		id: row.id,
		slug: row.slug,
		title: row.title,
		category: row.category,
		status: row.status as EventRecord["status"],
		featured: row.featured,
		startDate: row.startDate,
		createdAt: row.createdAt?.toISOString(),
		updatedAt: row.updatedAt?.toISOString(),
	})
}

function recordToRow(e: EventRecord): Partial<EventRow> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { createdAt, updatedAt, ...data } = e
	return {
		id: e.id,
		slug: e.slug,
		title: e.title,
		category: e.category,
		status: e.status,
		featured: e.featured,
		startDate: e.startDate,
		data: data as unknown as Record<string, unknown>,
	}
}

const byDateDesc = (a: { startDate: string }, b: { startDate: string }) =>
	b.startDate.localeCompare(a.startDate)

/* ------------------------------------------------------------------ */
/* Leitura pública                                                     */
/* ------------------------------------------------------------------ */

async function loadAll(includeDrafts: boolean): Promise<EventRecord[]> {
	if (!hasDatabase()) {
		return legacyEvents()
			.filter((e) => includeDrafts || e.status === "published")
			.sort(byDateDesc)
	}
	try {
		const r = await repo()
		const rows = await r.find({
			where: includeDrafts ? {} : { status: "published" },
			order: { startDate: "DESC" },
		})
		return rows.map(rowToRecord)
	} catch (err) {
		console.error("[events] erro a ler a base de dados:", err)
		if (includeDrafts) throw err
		return []
	}
}

export async function getPublishedEvents(): Promise<EventSummary[]> {
	return (await loadAll(false)).map(toSummary)
}

export function splitByDate(events: EventSummary[]) {
	const today = new Date().toISOString().slice(0, 10)
	const upcoming = events
		.filter((e) => e.startDate >= today)
		.sort((a, b) => a.startDate.localeCompare(b.startDate))
	const past = events.filter((e) => e.startDate < today).sort(byDateDesc)
	return { upcoming, past }
}

/** Procura por slug ou pelo id antigo (mantém os links antigos válidos). */
export async function getEventBySlugOrId(
	key: string,
	{ includeDrafts = false } = {}
): Promise<EventRecord | null> {
	const decoded = decodeURIComponent(key)
	if (!hasDatabase()) {
		return (
			legacyEvents().find(
				(e) =>
					(e.slug === decoded || e.id === decoded) &&
					(includeDrafts || e.status === "published")
			) ?? null
		)
	}
	try {
		const r = await repo()
		const row =
			(await r.findOne({ where: { slug: decoded } })) ??
			(await r.findOne({ where: { id: decoded } }))
		if (!row) return null
		if (!includeDrafts && row.status !== "published") return null
		return rowToRecord(row)
	} catch (err) {
		console.error("[events] erro a ler evento:", err)
		return null
	}
}

/* ------------------------------------------------------------------ */
/* Escrita (admin)                                                     */
/* ------------------------------------------------------------------ */

export async function getAllEventsForAdmin(): Promise<EventRecord[]> {
	return loadAll(true)
}

export async function getEventById(id: string): Promise<EventRecord | null> {
	return getEventBySlugOrId(id, { includeDrafts: true })
}

async function uniqueSlug(base: string, ignoreId?: string) {
	const r = await repo()
	const root = slugify(base) || "evento"
	let slug = root
	let i = 2
	while (true) {
		const found = await r.findOne({ where: { slug } })
		if (!found || found.id === ignoreId) return slug
		slug = `${root}-${i++}`
	}
}

export async function saveEvent(input: EventRecord): Promise<EventRecord> {
	if (!hasDatabase()) {
		throw new Error(
			"Base de dados não configurada (DATABASE_URL). Não é possível guardar."
		)
	}
	const e = normalizeEvent(input)
	if (!e.title.trim()) throw new Error("O título é obrigatório.")
	if (!/^\d{4}-\d{2}-\d{2}$/.test(e.startDate))
		throw new Error("Data inválida.")

	e.id = e.id || randomUUID()
	e.slug = await uniqueSlug(e.slug || e.title, e.id)
	e.coverUrl = e.coverUrl || e.theme.imgUrl
	e.tickets = e.tickets.map((t) => ({
		...t,
		id: t.id || randomUUID(),
		price: Number(t.price) || 0,
	}))

	const r = await repo()
	await r.save(recordToRow(e))
	return (await getEventById(e.id)) ?? e
}

export async function deleteEvent(id: string) {
	const r = await repo()
	await r.delete({ id })
}

export async function duplicateEvent(id: string) {
	const original = await getEventById(id)
	if (!original) throw new Error("Evento não encontrado.")
	return saveEvent({
		...original,
		id: "",
		slug: "",
		title: `${original.title} (cópia)`,
		status: "draft",
		featured: false,
	})
}

export async function countEvents() {
	if (!hasDatabase()) return 0
	const r = await repo()
	return r.count()
}

/** Importa o antigo events.json para a base de dados (só eventos que faltam). */
export async function importLegacyEvents() {
	const r = await repo()
	let imported = 0
	for (const e of legacyEvents()) {
		const exists = await r.findOne({ where: { id: e.id } })
		if (exists) continue
		e.slug = await uniqueSlug(e.slug, e.id)
		await r.save(recordToRow(e))
		imported++
	}
	return imported
}
