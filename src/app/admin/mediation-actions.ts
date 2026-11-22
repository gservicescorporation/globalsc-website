"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/server/auth"
import { analyzeClaim, proposeFormValues, recommendForQuote, type ClaimAnalysis, type FormFill, type Recommendation } from "@/server/ai"
import { sendMail } from "@/server/mail"
import {
	activity,
	convertToClient,
	deleteClient,
	deleteDocument,
	deleteInsurer,
	deletePolicy,
	deleteTemplate,
	documentsForType,
	getClaim,
	getClientProfile,
	getQuote,
	getTemplate,
	repos,
	saveClient,
	saveDocument,
	saveInsurer,
	savePolicy,
	saveTemplate,
	updateClaim,
	updateQuote,
} from "@/server/mediation"
import { extractPdfFields, fillPdfAndUpload } from "@/server/pdf-forms"
import type { ClaimTemplateRow, ClientRow, InsurerDocumentRow, InsurerRow, PolicyRow } from "@/entities/mediation"

type Result<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string }

async function run<T>(fn: (by: string) => Promise<T>, paths: string[] = []): Promise<Result<T>> {
	const session = await requireAdmin()
	try {
		const data = await fn(session.name || session.email)
		paths.forEach((p) => revalidatePath(p))
		return { ok: true, data }
	} catch (err) {
		console.error("[mediação]", err)
		return { ok: false, error: err instanceof Error ? err.message : "Ocorreu um erro inesperado." }
	}
}

/* -------------------------------- Pedidos --------------------------------- */

export async function recommendQuoteAction(id: string) {
	return run<Recommendation>(async (by) => {
		const quote = await getQuote(id)
		if (!quote) throw new Error("Pedido não encontrado.")
		const [docs, profile] = await Promise.all([
			documentsForType(quote.insuranceType),
			quote.clientId ? getClientProfile(quote.clientId) : null,
		])
		const ai = await recommendForQuote(quote, docs, profile)
		await updateQuote(
			id,
			{ ai: ai as unknown as Record<string, unknown>, status: quote.status === "novo" ? "em_analise" : quote.status },
			activity(by, `Recomendação gerada pela IA (${docs.length} documento(s) analisado(s)).`)
		)
		return ai
	}, [`/admin/pedidos/${id}`])
}

export async function sendProposalAction(id: string, subject: string, body: string) {
	return run(async (by) => {
		const quote = await getQuote(id)
		if (!quote) throw new Error("Pedido não encontrado.")
		if (!subject.trim() || !body.trim()) throw new Error("Escreva o assunto e o texto da proposta.")
		await sendMail(quote.email, subject, body)
		await updateQuote(
			id,
			{ proposal: { subject, body, sentAt: new Date().toISOString() }, status: "proposta_enviada" },
			activity(by, `Proposta enviada para ${quote.email}.`)
		)
	}, [`/admin/pedidos/${id}`, "/admin/pedidos"])
}

export async function setQuoteStatusAction(id: string, status: string) {
	return run((by) => updateQuote(id, { status }, activity(by, `Estado alterado para "${status}".`)), [`/admin/pedidos/${id}`, "/admin/pedidos"])
}

export async function noteQuoteAction(id: string, text: string) {
	return run(async (by) => {
		if (!text.trim()) throw new Error("Escreva a nota.")
		await updateQuote(id, {}, activity(by, text.trim()))
	}, [`/admin/pedidos/${id}`])
}

export async function convertAction(source: "quote" | "claim", id: string) {
	return run(
		async (by) => {
			const c = await convertToClient(source, id, by)
			return { clientId: c.id }
		},
		[source === "quote" ? `/admin/pedidos/${id}` : `/admin/sinistros/${id}`, "/admin/clientes"]
	)
}

/* -------------------------------- Sinistros ------------------------------- */

export async function analyzeClaimAction(id: string) {
	return run<ClaimAnalysis>(async (by) => {
		const claim = await getClaim(id)
		if (!claim) throw new Error("Sinistro não encontrado.")
		const profile = claim.clientId ? await getClientProfile(claim.clientId) : null
		const ai = await analyzeClaim(claim, profile)
		await updateClaim(
			id,
			{
				ai: ai as unknown as Record<string, unknown>,
				policyId: ai.apoliceRelevante.id || claim.policyId,
				status: claim.status === "recebido" ? "em_analise" : claim.status,
			},
			activity(by, "Análise gerada pela IA.")
		)
		return ai
	}, [`/admin/sinistros/${id}`])
}

export async function setClaimStatusAction(id: string, status: string) {
	return run((by) => updateClaim(id, { status }, activity(by, `Estado alterado para "${status}".`)), [`/admin/sinistros/${id}`, "/admin/sinistros"])
}

export async function setClaimPolicyAction(id: string, policyId: string) {
	return run((by) => updateClaim(id, { policyId: policyId || null }, activity(by, "Apólice associada ao sinistro.")), [`/admin/sinistros/${id}`])
}

export async function noteClaimAction(id: string, text: string) {
	return run(async (by) => {
		if (!text.trim()) throw new Error("Escreva a nota.")
		await updateClaim(id, {}, activity(by, text.trim()))
	}, [`/admin/sinistros/${id}`])
}

export async function messageClaimClientAction(id: string, subject: string, body: string) {
	return run(async (by) => {
		const claim = await getClaim(id)
		if (!claim) throw new Error("Sinistro não encontrado.")
		if (!subject.trim() || !body.trim()) throw new Error("Escreva o assunto e a mensagem.")
		await sendMail(claim.email, subject, body)
		await updateClaim(id, {}, activity(by, `Mensagem enviada ao cliente: "${subject}".`))
	}, [`/admin/sinistros/${id}`])
}

/** IA propõe os valores do formulário da seguradora (o gestor revê antes de gerar o PDF). */
export async function proposeFormAction(claimId: string, templateId: string) {
	return run<FormFill & { fields: ClaimTemplateRow["fields"] }>(async () => {
		const [claim, template] = await Promise.all([getClaim(claimId), getTemplate(templateId)])
		if (!claim || !template) throw new Error("Sinistro ou modelo não encontrado.")
		if (!template.fields.length) throw new Error("Este PDF não tem campos preenchíveis. Peça à seguradora a versão editável do formulário.")
		const profile = claim.clientId ? await getClientProfile(claim.clientId) : null
		const fill = await proposeFormValues(claim, template, profile, (claim.ai as ClaimAnalysis | null) ?? null)
		return { ...fill, fields: template.fields }
	})
}

/**
 * Gera o PDF com os valores revistos pelo gestor. Se o gestor corrigiu a proposta
 * da IA, guarda o resultado como exemplo — é assim que a IA aprende cada seguradora.
 */
export async function generateFormAction(
	claimId: string,
	templateId: string,
	values: Record<string, string>,
	corrected: boolean
) {
	return run(async (by) => {
		const [claim, template] = await Promise.all([getClaim(claimId), getTemplate(templateId)])
		if (!claim || !template) throw new Error("Sinistro ou modelo não encontrado.")
		const { url, skipped } = await fillPdfAndUpload(template.pdfUrl, values, `${claim.ref}-${template.title}.pdf`.replace(/[^\w.-]+/g, "-"))
		await updateClaim(
			claimId,
			{ filledForms: [...claim.filledForms, { templateId, title: template.title, url, createdAt: new Date().toISOString() }] },
			activity(by, `Formulário "${template.title}" preenchido${skipped.length ? ` (${skipped.length} campo(s) por rever)` : ""}.`)
		)
		if (corrected) {
			const context = `${claim.claimType} — ${claim.description.slice(0, 300)}`
			const r = await repos()
			await r.templates.update({ id: templateId }, { examples: [...template.examples, { context, values }].slice(-5) })
		}
		return { url, skipped }
	}, [`/admin/sinistros/${claimId}`])
}

/* ------------------------------- Seguradoras ------------------------------ */

export async function saveInsurerAction(input: Partial<InsurerRow> & { name: string }) {
	return run(async () => (await saveInsurer(input)).id, ["/admin/seguradoras"])
}

export async function deleteInsurerAction(id: string) {
	return run(() => deleteInsurer(id), ["/admin/seguradoras"])
}

export async function saveDocumentAction(input: Partial<InsurerDocumentRow> & { insurerId: string; insuranceType: string; title: string }) {
	return run(async () => void (await saveDocument(input)), [`/admin/seguradoras/${input.insurerId}`])
}

export async function deleteDocumentAction(id: string, insurerId: string) {
	return run(() => deleteDocument(id), [`/admin/seguradoras/${insurerId}`])
}

/** Guarda o modelo e lê automaticamente os campos preenchíveis do PDF. */
export async function saveTemplateAction(
	input: Partial<ClaimTemplateRow> & { insurerId: string; claimType: string; title: string; pdfUrl: string }
) {
	return run(async () => {
		const fields = await extractPdfFields(input.pdfUrl)
		await saveTemplate({ ...input, fields })
		return { fieldCount: fields.length }
	}, [`/admin/seguradoras/${input.insurerId}`])
}

export async function deleteTemplateAction(id: string, insurerId: string) {
	return run(() => deleteTemplate(id), [`/admin/seguradoras/${insurerId}`])
}

/* -------------------------------- Clientes -------------------------------- */

export async function saveClientAction(input: Partial<ClientRow> & { name: string; email: string }) {
	return run(async () => (await saveClient(input)).id, ["/admin/clientes"])
}

export async function deleteClientAction(id: string) {
	return run(() => deleteClient(id), ["/admin/clientes"])
}

export async function savePolicyAction(input: Partial<PolicyRow> & { clientId: string; insurerId: string; insuranceType: string }) {
	return run(async () => void (await savePolicy(input)), [`/admin/clientes/${input.clientId}`])
}

export async function deletePolicyAction(id: string, clientId: string) {
	return run(() => deletePolicy(id), [`/admin/clientes/${clientId}`])
}
