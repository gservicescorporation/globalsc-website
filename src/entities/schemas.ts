import { EntitySchema } from "typeorm"

/**
 * Entidades definidas com EntitySchema (sem decorators) para funcionarem
 * de forma fiável com o compilador SWC/Turbopack do Next.js.
 */

export interface EventRow {
	id: string
	slug: string
	title: string
	category: string
	status: string
	featured: boolean
	startDate: string
	data: Record<string, unknown>
	createdAt: Date
	updatedAt: Date
}

export const EventEntity = new EntitySchema<EventRow>({
	name: "Event",
	tableName: "events",
	columns: {
		id: { type: "varchar", length: 64, primary: true },
		slug: { type: "varchar", length: 200, unique: true },
		title: { type: "varchar", length: 300 },
		category: { type: "varchar", length: 120, default: "" },
		status: { type: "varchar", length: 20, default: "draft" },
		featured: { type: "boolean", default: false },
		startDate: { type: "varchar", length: 10 },
		data: { type: "jsonb" },
		createdAt: { type: "timestamp", createDate: true },
		updatedAt: { type: "timestamp", updateDate: true },
	},
	indices: [
		{ name: "IDX_events_status_date", columns: ["status", "startDate"] },
	],
})

export interface HeroSlideRow {
	id: string
	title: string
	description: string
	imageUrl: string
	videoUrl: string | null
	link: string | null
	buttonText: string | null
	overlay: string | null
	placement: string
	order: number
	active: boolean
	createdAt: Date
	updatedAt: Date
}

export const HeroSlideEntity = new EntitySchema<HeroSlideRow>({
	name: "HeroSlide",
	tableName: "hero_slides",
	columns: {
		id: { type: "uuid", primary: true, generated: "uuid" },
		title: { type: "varchar", length: 300 },
		description: { type: "text", default: "" },
		imageUrl: { type: "varchar", length: 1000 },
		videoUrl: { type: "varchar", length: 1000, nullable: true },
		link: { type: "varchar", length: 1000, nullable: true },
		buttonText: { type: "varchar", length: 120, nullable: true },
		overlay: { type: "varchar", length: 60, nullable: true },
		placement: { type: "varchar", length: 20, default: "both" },
		order: { type: "int", default: 0 },
		active: { type: "boolean", default: true },
		createdAt: { type: "timestamp", createDate: true },
		updatedAt: { type: "timestamp", updateDate: true },
	},
})

export interface SiteContentRow {
	key: string
	data: Record<string, unknown>
	updatedAt: Date
}

/** Conteúdo institucional editável (um registo por chave; hoje só "site"). */
export const SiteContentEntity = new EntitySchema<SiteContentRow>({
	name: "SiteContent",
	tableName: "site_content",
	columns: {
		key: { type: "varchar", length: 60, primary: true },
		data: { type: "jsonb" },
		updatedAt: { type: "timestamp", updateDate: true },
	},
})

export interface AdminUserRow {
	id: string
	name: string
	email: string
	passwordHash: string
	createdAt: Date
	lastLoginAt: Date | null
}

export const AdminUserEntity = new EntitySchema<AdminUserRow>({
	name: "AdminUser",
	tableName: "admin_users",
	columns: {
		id: { type: "uuid", primary: true, generated: "uuid" },
		name: { type: "varchar", length: 160 },
		email: { type: "varchar", length: 200, unique: true },
		passwordHash: { type: "varchar", length: 300 },
		createdAt: { type: "timestamp", createDate: true },
		lastLoginAt: { type: "timestamp", nullable: true },
	},
})
