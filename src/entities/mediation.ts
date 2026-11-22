import { EntitySchema } from "typeorm"

/* Entidades do módulo de mediação de seguros (EntitySchema, sem decorators). */

const id = { type: "uuid" as const, primary: true, generated: "uuid" as const }
const created = { type: "timestamp" as const, createDate: true }
const updated = { type: "timestamp" as const, updateDate: true }

/* ------------------------------- Seguradoras ------------------------------ */

export interface InsurerRow {
	id: string
	name: string
	logoUrl: string | null
	email: string | null
	phone: string | null
	notes: string
	active: boolean
	createdAt: Date
}
export const InsurerEntity = new EntitySchema<InsurerRow>({
	name: "Insurer",
	tableName: "insurers",
	columns: {
		id,
		name: { type: "varchar", length: 160 },
		logoUrl: { type: "varchar", length: 1000, nullable: true },
		email: { type: "varchar", length: 200, nullable: true },
		phone: { type: "varchar", length: 60, nullable: true },
		notes: { type: "text", default: "" },
		active: { type: "boolean", default: true },
		createdAt: created,
	},
})

/** Condições, tabelas de prémios, apólices-tipo… usados pela IA para recomendar. */
export interface InsurerDocumentRow {
	id: string
	insurerId: string
	insuranceType: string
	title: string
	fileUrl: string | null
	summary: string
	createdAt: Date
}
export const InsurerDocumentEntity = new EntitySchema<InsurerDocumentRow>({
	name: "InsurerDocument",
	tableName: "insurer_documents",
	columns: {
		id,
		insurerId: { type: "uuid" },
		insuranceType: { type: "varchar", length: 60 },
		title: { type: "varchar", length: 300 },
		fileUrl: { type: "varchar", length: 1000, nullable: true },
		summary: { type: "text", default: "" },
		createdAt: created,
	},
	indices: [{ name: "IDX_insdoc_type", columns: ["insuranceType"] }],
})

/** Modelo PDF de participação de sinistro de uma seguradora. */
export interface ClaimTemplateRow {
	id: string
	insurerId: string
	claimType: string
	title: string
	pdfUrl: string
	fields: { name: string; type: string; options?: string[] }[]
	instructions: string
	examples: { context: string; values: Record<string, string> }[]
	createdAt: Date
}
export const ClaimTemplateEntity = new EntitySchema<ClaimTemplateRow>({
	name: "ClaimTemplate",
	tableName: "claim_templates",
	columns: {
		id,
		insurerId: { type: "uuid" },
		claimType: { type: "varchar", length: 60 },
		title: { type: "varchar", length: 300 },
		pdfUrl: { type: "varchar", length: 1000 },
		fields: { type: "jsonb", default: () => "'[]'" },
		instructions: { type: "text", default: "" },
		examples: { type: "jsonb", default: () => "'[]'" },
		createdAt: created,
	},
})

/* -------------------------------- Clientes -------------------------------- */

/** Empresa ou particular. Particulares podem estar ligados a uma empresa. */
export interface ClientRow {
	id: string
	kind: "empresa" | "particular"
	name: string
	email: string
	phone: string | null
	nif: string | null
	sector: string | null
	address: string | null
	companyId: string | null
	notes: string
	createdAt: Date
}
export const ClientEntity = new EntitySchema<ClientRow>({
	name: "Client",
	tableName: "clients",
	columns: {
		id,
		kind: { type: "varchar", length: 20, default: "empresa" },
		name: { type: "varchar", length: 200 },
		email: { type: "varchar", length: 200, unique: true },
		phone: { type: "varchar", length: 60, nullable: true },
		nif: { type: "varchar", length: 40, nullable: true },
		sector: { type: "varchar", length: 120, nullable: true },
		address: { type: "varchar", length: 300, nullable: true },
		companyId: { type: "uuid", nullable: true },
		notes: { type: "text", default: "" },
		createdAt: created,
	},
})

/** Apólice de um cliente: plafonds, franquias e cláusulas usados na análise de sinistros. */
export interface PolicyRow {
	id: string
	clientId: string
	insurerId: string
	insuranceType: string
	policyNumber: string
	startDate: string | null
	endDate: string | null
	sumInsured: string
	deductible: string
	clauses: string
	documents: string[]
	active: boolean
	createdAt: Date
}
export const PolicyEntity = new EntitySchema<PolicyRow>({
	name: "Policy",
	tableName: "policies",
	columns: {
		id,
		clientId: { type: "uuid" },
		insurerId: { type: "uuid" },
		insuranceType: { type: "varchar", length: 60 },
		policyNumber: { type: "varchar", length: 120, default: "" },
		startDate: { type: "varchar", length: 10, nullable: true },
		endDate: { type: "varchar", length: 10, nullable: true },
		sumInsured: { type: "text", default: "" },
		deductible: { type: "text", default: "" },
		clauses: { type: "text", default: "" },
		documents: { type: "jsonb", default: () => "'[]'" },
		active: { type: "boolean", default: true },
		createdAt: created,
	},
	indices: [{ name: "IDX_policy_client", columns: ["clientId"] }],
})

/* --------------------------- Pedidos e sinistros --------------------------- */

export interface ActivityEntry {
	at: string
	by: string
	text: string
}

/** Seguro que o cliente já tem (útil para quem ainda não está na nossa base). */
export interface DeclaredPolicy {
	insurer: string
	policyNumber: string
	endDate: string
	documentUrl: string
}

export interface QuoteRequestRow {
	id: string
	ref: string
	clientId: string | null
	audience: string
	email: string
	name: string
	phone: string
	company: string
	nif: string
	insuranceType: string
	answers: Record<string, string>
	message: string
	declared: DeclaredPolicy | null
	status: string
	ai: Record<string, unknown> | null
	proposal: { subject: string; body: string; sentAt?: string } | null
	activity: ActivityEntry[]
	createdAt: Date
	updatedAt: Date
}
export const QuoteRequestEntity = new EntitySchema<QuoteRequestRow>({
	name: "QuoteRequest",
	tableName: "quote_requests",
	columns: {
		id,
		ref: { type: "varchar", length: 20, unique: true },
		clientId: { type: "uuid", nullable: true },
		audience: { type: "varchar", length: 20, default: "empresa" },
		email: { type: "varchar", length: 200 },
		name: { type: "varchar", length: 200, default: "" },
		phone: { type: "varchar", length: 60, default: "" },
		company: { type: "varchar", length: 200, default: "" },
		nif: { type: "varchar", length: 40, default: "" },
		insuranceType: { type: "varchar", length: 60 },
		answers: { type: "jsonb", default: () => "'{}'" },
		message: { type: "text", default: "" },
		declared: { type: "jsonb", nullable: true },
		status: { type: "varchar", length: 30, default: "novo" },
		ai: { type: "jsonb", nullable: true },
		proposal: { type: "jsonb", nullable: true },
		activity: { type: "jsonb", default: () => "'[]'" },
		createdAt: created,
		updatedAt: updated,
	},
})

export interface ClaimRow {
	id: string
	ref: string
	clientId: string | null
	policyId: string | null
	email: string
	name: string
	phone: string
	claimType: string
	occurredAt: string
	location: string
	description: string
	photos: string[]
	company: string
	declared: DeclaredPolicy | null
	status: string
	ai: Record<string, unknown> | null
	filledForms: { templateId: string; title: string; url: string; createdAt: string }[]
	activity: ActivityEntry[]
	createdAt: Date
	updatedAt: Date
}
export const ClaimEntity = new EntitySchema<ClaimRow>({
	name: "Claim",
	tableName: "claims",
	columns: {
		id,
		ref: { type: "varchar", length: 20, unique: true },
		clientId: { type: "uuid", nullable: true },
		policyId: { type: "uuid", nullable: true },
		email: { type: "varchar", length: 200 },
		name: { type: "varchar", length: 200, default: "" },
		phone: { type: "varchar", length: 60, default: "" },
		claimType: { type: "varchar", length: 60 },
		occurredAt: { type: "varchar", length: 30, default: "" },
		location: { type: "varchar", length: 300, default: "" },
		description: { type: "text", default: "" },
		photos: { type: "jsonb", default: () => "'[]'" },
		company: { type: "varchar", length: 200, default: "" },
		declared: { type: "jsonb", nullable: true },
		status: { type: "varchar", length: 30, default: "recebido" },
		ai: { type: "jsonb", nullable: true },
		filledForms: { type: "jsonb", default: () => "'[]'" },
		activity: { type: "jsonb", default: () => "'[]'" },
		createdAt: created,
		updatedAt: updated,
	},
})

export const MEDIATION_ENTITIES = [
	InsurerEntity,
	InsurerDocumentEntity,
	ClaimTemplateEntity,
	ClientEntity,
	PolicyEntity,
	QuoteRequestEntity,
	ClaimEntity,
]
