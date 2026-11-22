import { GoogleGenAI, type Part } from "@google/genai"
import { z } from "zod"
import { claimLabel, INSURANCE_TYPES, typeLabel } from "@/content/insurance-catalog"
import type { ClaimRow, ClaimTemplateRow, QuoteRequestRow } from "@/entities/mediation"
import type { ClientProfile } from "./mediation"

/**
 * IA da mediação (Google Gemini).
 * - GEMINI_API_KEY: chave da API (Google AI Studio).
 * - GEMINI_MODEL: por defeito "gemini-flash-lite-latest".
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-lite-latest"
/** Limite prático de ficheiros embutidos num pedido (o Gemini aceita ~20 MB por pedido). */
const MAX_INLINE_BYTES = 18 * 1024 * 1024

let client: GoogleGenAI | null = null
function gemini() {
	if (!process.env.GEMINI_API_KEY) throw new Error("IA não configurada: defina GEMINI_API_KEY.")
	// Os aliases "-latest" (ex.: gemini-flash-lite-latest) só existem na API v1beta.
	client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: "v1beta" })
	return client
}

/** Converte erros da API do Gemini em mensagens claras para os gestores. */
function friendlyError(err: unknown): Error {
	const status = (err as { status?: number }).status
	const raw = err instanceof Error ? err.message : String(err)
	if (status === 400 && /API key/i.test(raw)) return new Error("Chave do Gemini inválida. Verifique GEMINI_API_KEY.")
	if (status === 401 || status === 403) return new Error("A chave do Gemini não tem permissão para este modelo.")
	if (status === 404) return new Error(`Modelo de IA "${MODEL}" indisponível. Verifique GEMINI_MODEL.`)
	if (status === 429) return new Error("Limite de utilização da IA atingido (plano gratuito). Tente daqui a um minuto.")
	if (status && status >= 500) return new Error("O serviço de IA está temporariamente indisponível. Tente novamente.")
	if (/fetch failed|ENOTFOUND|ECONNRESET|timeout/i.test(raw)) return new Error("Sem ligação ao serviço de IA. Verifique a internet do servidor.")
	return err instanceof Error ? err : new Error(raw)
}

/** Converte um esquema Zod num JSON Schema aceite pelo Gemini. */
function toGeminiSchema(schema: z.ZodType) {
	const json = z.toJSONSchema(schema) as Record<string, unknown>
	const clean = (node: unknown): unknown => {
		if (Array.isArray(node)) return node.map(clean)
		if (node && typeof node === "object") {
			const out: Record<string, unknown> = {}
			for (const [k, v] of Object.entries(node)) {
				if (k === "$schema" || k === "additionalProperties") continue
				out[k] = clean(v)
			}
			return out
		}
		return node
	}
	return clean(json)
}

/** Descarrega um ficheiro (PDF/imagem) e devolve-o como parte embutida. */
async function fileToPart(url: string, budget: { left: number }): Promise<Part | null> {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
		if (!res.ok) return null
		const buf = Buffer.from(await res.arrayBuffer())
		if (buf.byteLength > budget.left) return null
		budget.left -= buf.byteLength
		let mimeType = res.headers.get("content-type")?.split(";")[0] || ""
		if (!mimeType || mimeType === "application/octet-stream") {
			mimeType = /\.pdf(\?|$)/i.test(url) ? "application/pdf" : "image/jpeg"
		}
		return { inlineData: { mimeType, data: buf.toString("base64") } }
	} catch {
		return null
	}
}

async function generate<T extends z.ZodType>(opts: {
	system: string
	parts: Part[]
	schema: T
}): Promise<z.infer<T>> {
	let response
	// Sobrecarga (503) e limites (429) do Gemini são temporários: tenta de novo com espera crescente.
	const delays = [2000, 5000]
	for (let attempt = 0; ; attempt++) {
		try {
			response = await gemini().models.generateContent({
				model: MODEL,
				contents: [{ role: "user", parts: opts.parts }],
				config: {
					systemInstruction: opts.system,
					responseMimeType: "application/json",
					responseJsonSchema: toGeminiSchema(opts.schema),
					temperature: 0.2,
				},
			})
			break
		} catch (err) {
			const status = (err as { status?: number }).status
			const retryable = status === 503 || status === 429 || (status !== undefined && status >= 500)
			console.error(`[ia] tentativa ${attempt + 1}`, err)
			if (!retryable || attempt >= delays.length) throw friendlyError(err)
			await new Promise((r) => setTimeout(r, delays[attempt]))
		}
	}
	const text = response.text
	if (!text) throw new Error("A IA não devolveu resposta. Tente novamente.")
	let parsed: unknown
	try {
		parsed = JSON.parse(text)
	} catch {
		throw new Error("A IA devolveu uma resposta inválida. Tente novamente.")
	}
	const result = opts.schema.safeParse(parsed)
	if (!result.success) throw new Error("A resposta da IA não tem o formato esperado. Tente novamente.")
	return result.data
}

const BASE_SYSTEM = `És um mediador de seguros sénior da Global Services Corporation (GSC), em Luanda, Angola.
A GSC trabalha sobretudo com empresas; os particulares são normalmente colaboradores dessas empresas.
Como mediador, representas o CLIENTE, não a seguradora: recomendas com independência.
Regras:
- Baseia-te apenas nos documentos e dados fornecidos. Nunca inventes preços, coberturas, cláusulas ou números.
- Quando um dado não existe nos documentos, diz "não indicado nos documentos" e inclui-o na informação em falta.
- Escreve em português de Angola/Portugal, claro e profissional. Valores em kwanzas (AOA).`

/* ------------------------------------------------------------------ */
/* 1. Recomendação para um pedido de seguro                            */
/* ------------------------------------------------------------------ */

export const RecommendationSchema = z.object({
	resumoPedido: z.string(),
	recomendacoes: z.array(
		z.object({
			seguradora: z.string(),
			produto: z.string(),
			adequacao: z.number().describe("0 a 100: quão bem serve este pedido"),
			porque: z.string(),
			coberturasPrincipais: z.array(z.string()),
			premioEstimado: z.string().describe("Valor indicado nos documentos ou 'não indicado nos documentos'"),
			franquiasExclusoes: z.array(z.string()),
			documentosBase: z.array(z.string()).describe("Títulos dos documentos usados"),
		})
	),
	informacaoEmFalta: z.array(z.string()),
	proposta: z.object({ assunto: z.string(), corpo: z.string() }),
})
export type Recommendation = z.infer<typeof RecommendationSchema>

export async function recommendForQuote(
	quote: QuoteRequestRow,
	docs: { title: string; insurerName: string; summary: string; fileUrl: string | null }[],
	profile: ClientProfile | null
): Promise<Recommendation> {
	const type = INSURANCE_TYPES.find((t) => t.id === quote.insuranceType)
	const answers = Object.entries(quote.answers)
		.map(([k, v]) => `- ${type?.fields.find((f) => f.key === k)?.label ?? k}: ${v || "—"}`)
		.join("\n")

	const budget = { left: MAX_INLINE_BYTES }
	const parts: Part[] = []
	const skipped: string[] = []
	for (const d of docs) {
		parts.push({ text: `\n=== Documento: "${d.title}" — seguradora ${d.insurerName} ===\nResumo/notas do mediador: ${d.summary || "(sem notas)"}` })
		if (d.fileUrl) {
			const part = await fileToPart(d.fileUrl, budget)
			if (part) parts.push(part)
			else skipped.push(d.title)
		}
	}

	const existing = profile?.policies.length
		? profile.policies.map((p) => `- ${typeLabel(p.insuranceType)} com ${p.insurerName} (apólice ${p.policyNumber || "s/n"}, até ${p.endDate || "?"})`).join("\n")
		: "Sem apólices registadas."

	// Cliente já registado: os dados vêm da ficha (o formulário não os volta a pedir).
	const c = profile?.client
	const companyName = quote.company || (c?.kind === "empresa" ? c.name : profile?.company?.name) || "—"
	const companyNif = quote.nif || (c?.kind === "empresa" ? c.nif : profile?.company?.nif) || "—"
	const contactName = quote.name || (c?.kind === "particular" ? c.name : "") || "—"
	const contactPhone = quote.phone || c?.phone || "—"

	parts.push({
		text: `\n=== PEDIDO ${quote.ref} ===
Ramo: ${typeLabel(quote.insuranceType)}
Tipo de cliente: ${quote.audience}${c ? " (cliente já registado — dados da ficha)" : " (cliente novo)"}
Empresa: ${companyName} (NIF ${companyNif})${c?.sector ? ` · sector: ${c.sector}` : ""}
Contacto: ${contactName} · ${quote.email} · ${contactPhone}
Respostas do formulário:
${answers || "—"}
Mensagem do cliente: ${quote.message || "—"}

Apólices que o cliente já tem connosco:
${existing}
${skipped.length ? `\nNota: estes documentos não puderam ser lidos na íntegra (demasiado grandes ou inacessíveis), usa só o resumo: ${skipped.join("; ")}` : ""}

Tarefa:
1. Compara as opções das seguradoras para ESTE pedido e ordena-as da mais adequada para a menos adequada (máximo 4).
2. Para cada uma explica o porquê em linguagem simples, coberturas principais, prémio (só se estiver nos documentos), franquias e exclusões relevantes.
3. Lista a informação em falta para fechar a proposta.
4. Redige o email de proposta para o cliente: assunto e corpo, cordial e direto, assinado "Equipa de Mediação — Global Services Corporation". Apresenta a melhor opção e uma alternativa. Não prometas valores que não estejam nos documentos; quando faltarem, diz que serão confirmados.
Formato do corpo do email: parágrafos curtos separados por uma linha em branco; as coberturas e os próximos passos em listas com "- " no início de cada linha. Não peças dados que já constam acima.`,
	})

	if (!docs.length) {
		parts.unshift({ text: "ATENÇÃO: não há documentos de seguradoras registados para este ramo. Indica isso e foca-te na informação em falta e num email a pedir os dados necessários." })
	}

	return generate({ system: BASE_SYSTEM, parts, schema: RecommendationSchema })
}

/* ------------------------------------------------------------------ */
/* 2. Análise de um sinistro                                           */
/* ------------------------------------------------------------------ */

export const ClaimAnalysisSchema = z.object({
	resumo: z.string(),
	apoliceRelevante: z.object({ id: z.string().describe("id da apólice ou string vazia"), motivo: z.string() }),
	cobertura: z.object({
		avaliacao: z.enum(["coberto", "parcial", "nao_coberto", "incerto"]),
		explicacao: z.string(),
		clausulasRelevantes: z.array(z.string()),
		plafondDisponivel: z.string(),
		franquia: z.string(),
	}),
	observacoesFotos: z.array(z.string()),
	passosRecomendados: z.array(z.string()),
	documentosNecessarios: z.array(z.string()),
	alertas: z.array(z.string()),
	mensagemCliente: z.object({ assunto: z.string(), corpo: z.string() }),
})
export type ClaimAnalysis = z.infer<typeof ClaimAnalysisSchema>

export async function analyzeClaim(claim: ClaimRow, profile: ClientProfile | null): Promise<ClaimAnalysis> {
	const budget = { left: MAX_INLINE_BYTES }
	const parts: Part[] = []

	const policies = profile?.policies ?? []
	const policyText = policies.length
		? policies
				.map(
					(p) => `--- Apólice id=${p.id} (${p.ownedBy === "empresa" ? "da empresa" : "própria"})
Ramo: ${typeLabel(p.insuranceType)} · Seguradora: ${p.insurerName} · Nº ${p.policyNumber || "s/n"}
Vigência: ${p.startDate || "?"} a ${p.endDate || "?"} · Ativa: ${p.active ? "sim" : "não"}
Capital/plafond: ${p.sumInsured || "não indicado"}
Franquia: ${p.deductible || "não indicada"}
Cláusulas e condições: ${p.clauses || "não indicadas"}`
				)
				.join("\n")
		: "Cliente sem apólices registadas na base de dados (email não reconhecido ou sem apólices)."

	// Documentos das apólices (condições particulares, etc.)
	for (const p of policies) {
		for (const url of p.documents.slice(0, 2)) {
			const part = await fileToPart(url, budget)
			if (part) parts.push({ text: `Documento da apólice ${p.policyNumber || p.id}:` }, part)
		}
	}

	parts.push({ text: `Fotografias enviadas pelo cliente (${claim.photos.length}):` })
	for (const url of claim.photos.slice(0, 8)) {
		const part = await fileToPart(url, budget)
		if (part) parts.push(part)
	}

	parts.push({
		text: `\n=== SINISTRO ${claim.ref} ===
Tipo: ${claimLabel(claim.claimType)}
Data/hora: ${claim.occurredAt || "não indicada"} · Local: ${claim.location || "não indicado"}
Descrição do cliente: ${claim.description || "—"}
Cliente: ${profile?.client.name ?? claim.name} (${claim.email})${profile?.company ? ` — colaborador da empresa ${profile.company.name}` : ""}

Apólices registadas:
${policyText}

Tarefa:
1. Resume a ocorrência e descreve o que se vê nas fotografias (danos visíveis, coerência com a descrição).
2. Identifica a apólice mais relevante (ou string vazia se nenhuma se aplica) e avalia a cobertura com base no plafond, franquia e cláusulas registadas.
3. Indica os passos recomendados para resolver o sinistro e os documentos a pedir ao cliente.
4. Assinala alertas (prazos de participação, possíveis exclusões, incoerências).
5. Redige uma mensagem ao cliente (assunto e corpo), empática e clara, com os próximos passos. Assina "Equipa de Sinistros — Global Services Corporation". Formato: parágrafos curtos separados por uma linha em branco e os próximos passos/documentos em lista com "- " no início de cada linha.`,
	})

	return generate({ system: BASE_SYSTEM, parts, schema: ClaimAnalysisSchema })
}

/* ------------------------------------------------------------------ */
/* 3. Preenchimento do formulário de participação da seguradora        */
/* ------------------------------------------------------------------ */

export const FormFillSchema = z.object({
	campos: z.array(z.object({ nome: z.string(), valor: z.string() })),
	notas: z.array(z.string()).describe("Campos que o gestor deve confirmar ou completar"),
})
export type FormFill = z.infer<typeof FormFillSchema>

export async function proposeFormValues(
	claim: ClaimRow,
	template: ClaimTemplateRow,
	profile: ClientProfile | null,
	analysis: ClaimAnalysis | null
): Promise<FormFill> {
	const budget = { left: MAX_INLINE_BYTES }
	const parts: Part[] = []
	const pdf = await fileToPart(template.pdfUrl, budget)
	if (pdf) parts.push({ text: "Formulário em branco da seguradora:" }, pdf)

	const fields = template.fields
		.map((f) => `- "${f.name}" (${f.type}${f.options?.length ? `; opções: ${f.options.join(" | ")}` : ""})`)
		.join("\n")

	const examples = template.examples.length
		? template.examples
				.slice(-3)
				.map((e, i) => `Exemplo ${i + 1} (corrigido por um gestor):\nContexto: ${e.context}\nValores: ${JSON.stringify(e.values)}`)
				.join("\n\n")
		: "Sem exemplos ainda."

	const policy = profile?.policies.find((p) => p.id === (analysis?.apoliceRelevante.id || claim.policyId))

	parts.push({
		text: `Instruções específicas desta seguradora/tipo de sinistro (definidas pelos gestores):
${template.instructions || "(sem instruções)"}

${examples}

Campos do formulário (usa EXATAMENTE estes nomes):
${fields}

Dados disponíveis:
- Sinistro ${claim.ref}: ${claimLabel(claim.claimType)}, ${claim.occurredAt || "data não indicada"}, ${claim.location || "local não indicado"}
- Descrição: ${claim.description || "—"}
- Participante: ${profile?.client.name ?? claim.name}, email ${claim.email}, telefone ${claim.phone || profile?.client.phone || "—"}, NIF ${profile?.client.nif || "—"}, morada ${profile?.client.address || "—"}
- Empresa: ${profile?.company ? `${profile.company.name} (NIF ${profile.company.nif || "—"})` : profile?.client.kind === "empresa" ? profile.client.name : "—"}
- Apólice: ${policy ? `${policy.policyNumber} (${policy.insurerName}), capital ${policy.sumInsured || "—"}, franquia ${policy.deductible || "—"}` : "não identificada"}
- Análise: ${analysis?.resumo ?? "—"}

Tarefa: devolve um valor para cada campo que consigas preencher com segurança. Para caixas de verificação usa "sim" ou "não". Para listas usa exatamente uma das opções. Deixa de fora os campos sem dados (não inventes) e menciona-os nas notas.`,
	})

	return generate({ system: BASE_SYSTEM, parts, schema: FormFillSchema })
}
