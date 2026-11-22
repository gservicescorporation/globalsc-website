import { cache } from "react"
import { hasDatabase, initDataSource } from "@/lib"
import { SiteContentEntity } from "@/entities/schemas"
import { DEFAULT_CONTENT } from "@/content/site"
import type { SiteContent } from "@/types/content"

const KEY = "site"

/** Junta o que está guardado com os predefinidos (campos novos nunca ficam em falta). */
function merge(saved: Partial<SiteContent> | null | undefined): SiteContent {
	const d = DEFAULT_CONTENT
	if (!saved) return d
	return {
		contacts: { ...d.contacts, ...saved.contacts },
		socials: saved.socials ?? d.socials,
		home: { ...d.home, ...saved.home },
		insurance: {
			...d.insurance,
			...saved.insurance,
			partners: { ...d.insurance.partners, ...saved.insurance?.partners },
		},
		services: saved.services ?? d.services,
		about: { ...d.about, ...saved.about },
		academy: { ...d.academy, ...saved.academy },
		events: { ...d.events, ...saved.events },
		partners: { ...d.partners, ...saved.partners },
	}
}

async function repo() {
	const ds = await initDataSource()
	return ds.getRepository(SiteContentEntity)
}

/** Conteúdo do site (uma leitura por pedido, graças ao cache do React). */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
	if (!hasDatabase()) return DEFAULT_CONTENT
	try {
		const row = await (await repo()).findOne({ where: { key: KEY } })
		return merge(row?.data as Partial<SiteContent> | undefined)
	} catch (err) {
		console.error("[content] erro a ler a base de dados:", err)
		return DEFAULT_CONTENT
	}
})

export async function saveSiteContent(content: SiteContent) {
	if (!hasDatabase()) throw new Error("Base de dados não configurada (DATABASE_URL).")
	const clean = merge(content)
	// Remove entradas vazias para não aparecerem buracos no site.
	clean.partners.logos = clean.partners.logos.filter(Boolean)
	clean.insurance.partners.logos = clean.insurance.partners.logos.filter(Boolean)
	clean.contacts.phones = clean.contacts.phones.map((p) => p.trim()).filter(Boolean)
	clean.contacts.emails = clean.contacts.emails.map((e) => e.trim()).filter(Boolean)
	clean.insurance.benefits = clean.insurance.benefits.map((b) => b.trim()).filter(Boolean)
	await (await repo()).save({ key: KEY, data: clean as unknown as Record<string, unknown> })
	return clean
}
