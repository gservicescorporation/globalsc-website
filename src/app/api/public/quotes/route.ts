import { z } from "zod"
import { INSURANCE_TYPES, typeLabel } from "@/content/insurance-catalog"
import { createQuote, findClientByEmail } from "@/server/mediation"
import { fail, handle, json } from "@/server/http"
import { notify, TEAM_INBOX } from "@/server/mail"
import { clientIp, rateLimit } from "@/server/rate-limit"
import { DeclaredSchema } from "@/server/public-schemas"

const Schema = z.object({
	audience: z.enum(["empresa", "particular"]),
	insuranceType: z.string().refine((t) => INSURANCE_TYPES.some((i) => i.id === t), "Ramo inválido."),
	answers: z.record(z.string(), z.string().max(2000)).default({}),
	email: z.string().email().max(200),
	name: z.string().max(200).default(""),
	phone: z.string().max(60).default(""),
	company: z.string().max(200).default(""),
	nif: z.string().max(40).default(""),
	message: z.string().max(5000).default(""),
	declared: DeclaredSchema,
	website: z.string().optional(), // honeypot
})

/** POST /api/public/quotes — novo pedido de cotação (sem conta). */
export async function POST(req: Request) {
	if (!rateLimit(`quote:${clientIp(req)}`, 6, 60 * 60_000)) return fail("Demasiados pedidos. Tente mais tarde.", 429)
	const parsed = Schema.safeParse(await req.json().catch(() => null))
	if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Dados inválidos.")
	const data = parsed.data
	if (data.website) return json({ ref: "PC-OK" }) // bot

	try {
		const known = await findClientByEmail(data.email)
		if (!known && (!data.name.trim() || !data.phone.trim()))
			return fail("Indique o seu nome e telefone para o podermos contactar.")
		if (!known && data.audience === "empresa" && !data.company.trim()) return fail("Indique o nome da empresa.")

		const { website: _hp, ...input } = data
		void _hp
		const quote = await createQuote(input)
		const label = typeLabel(quote.insuranceType)

		await Promise.all([
			notify(
				quote.email,
				`Recebemos o seu pedido de seguro — ${quote.ref}`,
				`Olá${quote.name ? ` ${quote.name.split(" ")[0]}` : ""},

Recebemos o seu pedido de cotação de ${label} (referência ${quote.ref}).

Um gestor da nossa equipa vai comparar as propostas das seguradoras com que trabalhamos e entra em contacto consigo com a melhor opção, normalmente em 1 a 2 dias úteis.

Equipa de Mediação — Global Services Corporation`
			),
			notify(
				TEAM_INBOX,
				`[Novo pedido] ${label} — ${quote.company || quote.name || quote.email} (${quote.ref})`,
				`Novo pedido de cotação no site.

- Ramo: ${label}
- Cliente: ${quote.company || "—"} · ${quote.name || "—"}
- Email: ${quote.email} ${known ? "(cliente existente)" : "(novo)"}
- Telefone: ${quote.phone || "—"}

Abra o painel em /admin/pedidos para analisar.`
			),
		])

		return json({ ref: quote.ref }, 201)
	} catch (err) {
		return handle(err)
	}
}
