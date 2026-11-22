import { randomBytes } from "crypto"
import { In, IsNull, Not } from "typeorm"
import { hasDatabase, initDataSource } from "@/lib"
import {
	ClaimEntity,
	ClaimTemplateEntity,
	ClientEntity,
	InsurerDocumentEntity,
	InsurerEntity,
	PolicyEntity,
	QuoteRequestEntity,
	type ActivityEntry,
	type ClaimRow,
	type DeclaredPolicy,
	type ClaimTemplateRow,
	type ClientRow,
	type InsurerDocumentRow,
	type InsurerRow,
	type PolicyRow,
	type QuoteRequestRow,
} from "@/entities/mediation"

function requireDb() {
	if (!hasDatabase()) throw new Error("Base de dados não configurada (DATABASE_URL).")
}

async function ds() {
	requireDb()
	return initDataSource()
}

export const repos = async () => {
	const d = await ds()
	return {
		insurers: d.getRepository(InsurerEntity),
		documents: d.getRepository(InsurerDocumentEntity),
		templates: d.getRepository(ClaimTemplateEntity),
		clients: d.getRepository(ClientEntity),
		policies: d.getRepository(PolicyEntity),
		quotes: d.getRepository(QuoteRequestEntity),
		claims: d.getRepository(ClaimEntity),
	}
}

/** Referência curta e legível (sem 0/O/1/I para evitar confusões ao telefone). */
function makeRef(prefix: string) {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	const bytes = randomBytes(6)
	return `${prefix}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`
}

export const normalizeEmail = (e: string) => e.trim().toLowerCase()

export const activity = (by: string, text: string): ActivityEntry => ({
	at: new Date().toISOString(),
	by,
	text,
})

/* -------------------------------- Clientes -------------------------------- */

export async function findClientByEmail(email: string) {
	const r = await repos()
	return r.clients.findOne({ where: { email: normalizeEmail(email) } })
}

/** Perfil completo: cliente, empresa (se for colaborador), apólices próprias e da empresa. */
export async function getClientProfile(clientId: string) {
	const r = await repos()
	const client = await r.clients.findOne({ where: { id: clientId } })
	if (!client) return null
	const company = client.companyId ? await r.clients.findOne({ where: { id: client.companyId } }) : null
	const members = client.kind === "empresa" ? await r.clients.find({ where: { companyId: client.id }, order: { name: "ASC" } }) : []
	const ownerIds = [client.id, ...(company ? [company.id] : [])]
	const policies = await r.policies.find({ where: { clientId: In(ownerIds) }, order: { createdAt: "DESC" } })
	const insurerIds = [...new Set(policies.map((p) => p.insurerId))]
	const insurers = insurerIds.length ? await r.insurers.find({ where: { id: In(insurerIds) } }) : []
	const insurerName = new Map(insurers.map((i) => [i.id, i.name]))
	return {
		client,
		company,
		members,
		policies: policies.map((p) => ({ ...p, insurerName: insurerName.get(p.insurerId) ?? "—", ownedBy: p.clientId === client.id ? "proprio" : "empresa" })),
	}
}
export type ClientProfile = NonNullable<Awaited<ReturnType<typeof getClientProfile>>>

export async function listClients() {
	const r = await repos()
	return r.clients.find({ order: { createdAt: "DESC" } })
}

export async function saveClient(input: Partial<ClientRow> & { name: string; email: string }) {
	const r = await repos()
	const email = normalizeEmail(input.email)
	if (!input.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Nome e email válidos são obrigatórios.")
	const clash = await r.clients.findOne({ where: { email } })
	if (clash && clash.id !== input.id) throw new Error("Já existe um cliente com este email.")
	return r.clients.save({ ...input, email, companyId: input.kind === "particular" ? input.companyId || null : null })
}

export async function deleteClient(id: string) {
	const r = await repos()
	await r.policies.delete({ clientId: id })
	await r.clients.update({ companyId: id }, { companyId: null })
	await r.clients.delete({ id })
}

export async function savePolicy(input: Partial<PolicyRow> & { clientId: string; insurerId: string; insuranceType: string }) {
	const r = await repos()
	return r.policies.save(input)
}

export async function deletePolicy(id: string) {
	const r = await repos()
	await r.policies.delete({ id })
}

/* ------------------------------- Seguradoras ------------------------------ */

export async function listInsurers() {
	const r = await repos()
	return r.insurers.find({ order: { name: "ASC" } })
}

export async function getInsurer(id: string) {
	const r = await repos()
	const insurer = await r.insurers.findOne({ where: { id } })
	if (!insurer) return null
	const [documents, templates] = await Promise.all([
		r.documents.find({ where: { insurerId: id }, order: { insuranceType: "ASC", createdAt: "DESC" } }),
		r.templates.find({ where: { insurerId: id }, order: { claimType: "ASC" } }),
	])
	return { insurer, documents, templates }
}

export async function saveInsurer(input: Partial<InsurerRow> & { name: string }) {
	if (!input.name.trim()) throw new Error("O nome da seguradora é obrigatório.")
	const r = await repos()
	return r.insurers.save(input)
}

export async function deleteInsurer(id: string) {
	const r = await repos()
	await r.documents.delete({ insurerId: id })
	await r.templates.delete({ insurerId: id })
	await r.insurers.delete({ id })
}

export async function saveDocument(input: Partial<InsurerDocumentRow> & { insurerId: string; insuranceType: string; title: string }) {
	if (!input.fileUrl && !input.summary?.trim()) throw new Error("Carregue o PDF ou escreva o resumo do documento.")
	const r = await repos()
	return r.documents.save(input)
}

export async function deleteDocument(id: string) {
	const r = await repos()
	await r.documents.delete({ id })
}

export async function saveTemplate(input: Partial<ClaimTemplateRow> & { insurerId: string; claimType: string; title: string; pdfUrl: string }) {
	const r = await repos()
	return r.templates.save(input)
}

export async function deleteTemplate(id: string) {
	const r = await repos()
	await r.templates.delete({ id })
}

/** Documentos de todas as seguradoras ativas para um ramo (base da recomendação). */
export async function documentsForType(insuranceType: string) {
	const r = await repos()
	const insurers = await r.insurers.find({ where: { active: true } })
	if (!insurers.length) return []
	const docs = await r.documents.find({ where: { insuranceType, insurerId: In(insurers.map((i) => i.id)) } })
	const name = new Map(insurers.map((i) => [i.id, i.name]))
	return docs.map((d) => ({ ...d, insurerName: name.get(d.insurerId) ?? "—" }))
}

/* -------------------------------- Pedidos --------------------------------- */

export async function createQuote(input: {
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
}) {
	const r = await repos()
	const client = await r.clients.findOne({ where: { email: normalizeEmail(input.email) } })
	return r.quotes.save({
		...input,
		email: normalizeEmail(input.email),
		ref: makeRef("PC"),
		clientId: client?.id ?? null,
		status: "novo",
		activity: [activity("Cliente", "Pedido submetido no site.")],
	})
}

export async function listQuotes() {
	const r = await repos()
	return r.quotes.find({ order: { createdAt: "DESC" }, take: 500 })
}

export async function getQuote(id: string) {
	const r = await repos()
	return r.quotes.findOne({ where: { id } })
}

export async function updateQuote(id: string, patch: Partial<QuoteRequestRow>, log?: ActivityEntry) {
	const r = await repos()
	const current = await r.quotes.findOne({ where: { id } })
	if (!current) throw new Error("Pedido não encontrado.")
	await r.quotes.save({ ...current, ...patch, activity: log ? [...current.activity, log] : current.activity })
}

/* -------------------------------- Sinistros ------------------------------- */

export async function createClaim(input: {
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
}) {
	const r = await repos()
	// O cliente pode identificar-se só pelo telefone ou só pelo email.
	const client =
		(input.email ? await findClientByContact(input.email) : null) ??
		(input.phone ? await findClientByContact(input.phone) : null)
	return r.claims.save({
		...input,
		email: input.email ? normalizeEmail(input.email) : client?.email ?? "",
		name: input.name || client?.name || "",
		phone: input.phone || client?.phone || "",
		ref: makeRef("SN"),
		clientId: client?.id ?? null,
		status: "recebido",
		activity: [activity("Cliente", `Sinistro participado no site com ${input.photos.length} fotografia(s).`)],
	})
}

export async function listClaims() {
	const r = await repos()
	return r.claims.find({ order: { createdAt: "DESC" }, take: 500 })
}

export async function getClaim(id: string) {
	const r = await repos()
	return r.claims.findOne({ where: { id } })
}

export async function updateClaim(id: string, patch: Partial<ClaimRow>, log?: ActivityEntry) {
	const r = await repos()
	const current = await r.claims.findOne({ where: { id } })
	if (!current) throw new Error("Sinistro não encontrado.")
	await r.claims.save({ ...current, ...patch, activity: log ? [...current.activity, log] : current.activity })
}

export async function getTemplate(id: string) {
	const r = await repos()
	return r.templates.findOne({ where: { id } })
}

export async function listTemplates() {
	const r = await repos()
	const [templates, insurers] = await Promise.all([r.templates.find({ order: { title: "ASC" } }), r.insurers.find()])
	const name = new Map(insurers.map((i) => [i.id, i.name]))
	return templates.map((t) => ({ id: t.id, title: t.title, claimType: t.claimType, insurerId: t.insurerId, insurerName: name.get(t.insurerId) ?? "—", fieldCount: t.fields.length }))
}

/** Números para o painel. */
export async function mediationStats() {
	if (!hasDatabase()) return null
	try {
		const r = await repos()
		const [quotesNew, claimsOpen, clients] = await Promise.all([
			r.quotes.count({ where: { status: In(["novo", "em_analise"]) } }),
			r.claims.count({ where: { status: In(["recebido", "em_analise"]) } }),
			r.clients.count(),
		])
		return { quotesNew, claimsOpen, clients }
	} catch {
		return null
	}
}

/* ------------------- Converter pedido/sinistro em cliente ------------------ */

/**
 * Cria (ou reutiliza) o cliente a partir de um pedido ou sinistro e, se o cliente
 * declarou um seguro atual, regista essa apólice. Liga o registo ao cliente.
 */
export async function convertToClient(source: "quote" | "claim", id: string, by: string) {
	const r = await repos()
	const row = source === "quote" ? await r.quotes.findOne({ where: { id } }) : await r.claims.findOne({ where: { id } })
	if (!row) throw new Error("Registo não encontrado.")

	const email = normalizeEmail(row.email)
	let client = await r.clients.findOne({ where: { email } })
	const companyName = row.company?.trim()
	// Sinistros vêm normalmente de colaboradores (particulares ligados a uma empresa).
	const audience = source === "quote" ? (row as QuoteRequestRow).audience : "particular"

	if (!client) {
		let companyId: string | null = null
		if (audience === "particular" && companyName) {
			const existing = await r.clients.findOne({ where: { kind: "empresa", name: companyName } })
			companyId = existing?.id ?? null
		}
		client = await r.clients.save({
			kind: audience === "empresa" ? "empresa" : "particular",
			name: audience === "empresa" ? companyName || row.name || email : row.name || email,
			email,
			phone: row.phone || null,
			nif: source === "quote" ? (row as QuoteRequestRow).nif || null : null,
			companyId,
			notes: audience === "empresa" && row.name ? `Contacto: ${row.name}` : "",
		})
	}

	let policyCreated = false
	const d = row.declared
	if (d && (d.insurer || d.policyNumber)) {
		let insurer = d.insurer ? (await r.insurers.find()).find((i) => i.name.toLowerCase() === d.insurer.trim().toLowerCase()) : undefined
		if (!insurer && d.insurer) insurer = await r.insurers.save({ name: d.insurer.trim(), notes: "Criada automaticamente a partir de um pedido/sinistro." })
		if (insurer) {
			const type = source === "quote" ? (row as QuoteRequestRow).insuranceType : ""
			await r.policies.save({
				clientId: client.id,
				insurerId: insurer.id,
				insuranceType: type || "outro",
				policyNumber: d.policyNumber || "",
				endDate: d.endDate || null,
				documents: d.documentUrl ? [d.documentUrl] : [],
				clauses: "",
			})
			policyCreated = true
		}
	}

	const log = activity(by, `Cliente ${client.name} associado${policyCreated ? " e apólice declarada registada" : ""}.`)
	if (source === "quote") await updateQuote(id, { clientId: client.id }, log)
	else await updateClaim(id, { clientId: client.id }, log)
	return client
}

/** Pedidos e sinistros de um cliente (e dos colaboradores, se for empresa). */
export async function historyForClient(clientId: string) {
	const r = await repos()
	const members = await r.clients.find({ where: { companyId: clientId } })
	const ids = [clientId, ...members.map((m) => m.id)]
	const [quotes, claims] = await Promise.all([
		r.quotes.find({ where: { clientId: In(ids) }, order: { createdAt: "DESC" }, take: 50 }),
		r.claims.find({ where: { clientId: In(ids) }, order: { createdAt: "DESC" }, take: 50 }),
	])
	return { quotes, claims }
}

/* ------------------------- Identificação por contacto ---------------------- */

/** Últimos 9 dígitos de um telefone angolano (ignora +244, 00244, espaços…). */
export const phoneKey = (p: string) => p.replace(/\D/g, "").slice(-9)

export const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Encontra o cliente por email ou por telefone (numa urgência, a pessoa usa o que lembrar). */
export async function findClientByContact(contact: string) {
	const value = contact.trim()
	if (!value) return null
	if (looksLikeEmail(value)) return findClientByEmail(value)
	const key = phoneKey(value)
	if (key.length < 9) return null
	const r = await repos()
	const withPhone = await r.clients.find({ where: { phone: Not(IsNull()) } })
	return withPhone.find((c) => c.phone && phoneKey(c.phone) === key) ?? null
}
