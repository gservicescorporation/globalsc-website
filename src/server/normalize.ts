import type { EventRecord, EventSummary } from "@/types/event"

export function slugify(input: string) {
	return input
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 120)
}

export function emptyEvent(): EventRecord {
	return {
		id: "",
		slug: "",
		status: "draft",
		featured: false,
		category: "Fórum",
		title: "",
		startDate: new Date().toISOString().slice(0, 10),
		startTime: "",
		location: "",
		description: "",
		coverUrl: "",
		externalUrl: "",
		theme: { imgUrl: "", primary: "#242565cc", secondary: "#0049afcc" },
		gallery: [],
		about: { videoUrl: "", imgUrl: "", description: "" },
		partners: {
			title: "Parceiros",
			subtitle:
				"Parceiros de confiança para impulsionar a realização deste grande evento.",
			logos: [],
		},
		sponsors: {
			title: "Patrocinadores que tornam este evento possível",
			subtitle:
				"Marcas que acreditam no impacto deste encontro e o tornam realidade.",
			logos: [],
		},
		whySign: {
			enabled: false,
			title: "Porque participar",
			subtitle: "",
			debates: [],
		},
		speakers: {
			title: "Líderes e visionários que compõem o painel de oradores",
			subtitle: "",
			speakers: [],
		},
		ticketsEnabled: false,
		tickets: [],
		venue: {
			title: "Espaço exclusivo e sofisticado",
			subtitle: "Este será o local do nosso evento.",
			images: [],
			address: "",
			phone: "+244941064919",
			email: "geral@gservicescorporation.com",
			mapUrl: "",
		},
		faqs: { imgUrl: "", questions: [] },
	}
}

/**
 * Garante que um objeto (vindo da BD, do formulário admin ou do JSON antigo)
 * tem todos os campos esperados.
 */
export function normalizeEvent(input: Partial<EventRecord>): EventRecord {
	const base = emptyEvent()
	const e = input ?? {}
	return {
		...base,
		...e,
		theme: { ...base.theme, ...(e.theme ?? {}) },
		gallery: Array.isArray(e.gallery) ? e.gallery.filter(Boolean) : [],
		about: { ...base.about, ...(e.about ?? {}) },
		partners: { ...base.partners, ...(e.partners ?? {}) },
		sponsors: { ...base.sponsors, ...(e.sponsors ?? {}) },
		whySign: { ...base.whySign, ...(e.whySign ?? {}) },
		speakers: { ...base.speakers, ...(e.speakers ?? {}) },
		tickets: Array.isArray(e.tickets) ? e.tickets : [],
		venue: { ...base.venue, ...(e.venue ?? {}) },
		faqs: { ...base.faqs, ...(e.faqs ?? {}) },
	}
}

export function toSummary(e: EventRecord): EventSummary {
	return {
		id: e.id,
		slug: e.slug,
		status: e.status,
		featured: e.featured,
		category: e.category,
		title: e.title,
		startDate: e.startDate,
		location: e.location,
		description: e.description,
		coverUrl: e.coverUrl || e.theme.imgUrl,
		theme: e.theme,
	}
}

/* ------------------------------------------------------------------ */
/* Conversão do antigo events.json                                     */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromLegacy(old: any): EventRecord {
	const startDate: string = old.event?.startDate ?? ""
	const isUpcoming = new Date(startDate) > new Date()
	return normalizeEvent({
		id: old.id,
		slug: slugify(old.event?.title ?? old.id),
		status: "published",
		featured: isUpcoming,
		category: old.category ?? "",
		title: old.event?.title ?? "",
		startDate,
		location: old.event?.location ?? "",
		description: old.event?.description ?? "",
		coverUrl: old.coverUrl || old.theme?.imgUrl || "",
		externalUrl: isUpcoming ? "https://www.mesaredonda.globalsc.ao" : "",
		theme: old.theme,
		gallery: old.event?.images ?? [],
		about: {
			videoUrl: old.about?.videoUrl ?? "",
			imgUrl: old.about?.imgUrl ?? "",
			description: old.about?.description ?? "",
		},
		partners: old.partners,
		sponsors: old.sponsors,
		whySign: { enabled: false, ...(old.whySign ?? {}) },
		speakers: old.speakers,
		// No site antigo a secção de bilhetes nunca era mostrada.
		ticketsEnabled: false,
		tickets: old.tickets ?? [],
		venue: old.location,
		faqs: old.faqs,
	})
}
