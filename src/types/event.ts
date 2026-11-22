export type EventStatus = "published" | "draft"

export interface LogoBlock {
	title: string
	subtitle: string
	logos: string[]
}

export interface Speaker {
	fullname: string
	jobTitle: string
	imgUrl: string
}

export interface Ticket {
	id: string
	ticketName: string
	benefits: string[]
	price: number
}

export interface Faq {
	question: string
	answer: string
}

export interface Debate {
	title: string
	subtitle: string
	imgUrl: string
}

/**
 * Registo completo de um evento. É guardado inteiro numa coluna jsonb
 * (com os campos usados em filtros duplicados em colunas próprias).
 */
export interface EventRecord {
	id: string
	slug: string
	status: EventStatus
	featured: boolean
	category: string
	title: string
	startDate: string // YYYY-MM-DD
	startTime?: string // HH:mm
	location: string
	description: string
	coverUrl: string
	externalUrl?: string
	theme: {
		imgUrl: string
		primary: string
		secondary: string
	}
	gallery: string[]
	about: {
		videoUrl: string
		imgUrl: string
		description: string
	}
	partners: LogoBlock
	sponsors: LogoBlock
	whySign: {
		enabled: boolean
		title: string
		subtitle: string
		debates: Debate[]
	}
	speakers: {
		title: string
		subtitle: string
		speakers: Speaker[]
	}
	ticketsEnabled: boolean
	tickets: Ticket[]
	venue: {
		title: string
		subtitle: string
		images: string[]
		address: string
		phone: string
		email: string
		mapUrl?: string
	}
	faqs: {
		imgUrl: string
		questions: Faq[]
	}
	createdAt?: string
	updatedAt?: string
}

/** Versão leve usada em listagens/cartões. */
export type EventSummary = Pick<
	EventRecord,
	| "id"
	| "slug"
	| "status"
	| "featured"
	| "category"
	| "title"
	| "startDate"
	| "location"
	| "description"
	| "coverUrl"
	| "theme"
>

export type SlidePlacement = "home" | "events" | "both"

export interface HeroSlideRecord {
	id: string
	title: string
	description: string
	imageUrl: string
	videoUrl?: string
	link?: string
	buttonText?: string
	overlay?: string
	placement: SlidePlacement
	order: number
	active: boolean
}
