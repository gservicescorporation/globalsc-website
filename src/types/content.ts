/** Conteúdo institucional editável no painel (Conteúdo do site). */

export interface TitledText {
	title: string
	text: string
}

export interface Stat {
	value: number
	suffix: string
	label: string
}

export interface ServiceItem {
	id: string
	title: string
	description: string
	icon: string
	image: string
	tags: string[]
	href: string
}

export interface Brand {
	image: string
	title: string
	description: string
}

export interface SiteContent {
	contacts: {
		phones: string[]
		emails: string[]
		address: string
		hours: string
	}
	socials: { name: string; href: string }[]
	home: {
		manifesto: string
		stats: Stat[]
	}
	insurance: {
		intro: string
		benefits: string[]
		lines: TitledText[]
		steps: TitledText[]
		/** Seguradoras parceiras (diferentes dos parceiros gerais). */
		partners: { title: string; logos: string[] }
	}
	services: ServiceItem[]
	about: {
		story: string
		advantages: TitledText[]
		values: TitledText[]
	}
	academy: {
		enabled: boolean
		text: string
		url: string
		pillars: TitledText[]
	}
	events: {
		stats: Stat[]
		brands: Brand[]
	}
	partners: {
		title: string
		logos: string[]
	}
}
