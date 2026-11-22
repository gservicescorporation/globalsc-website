import { z } from "zod"
import { CLAIM_TYPES, claimLabel } from "@/content/insurance-catalog"
import { createClaim, findClientByContact, phoneKey } from "@/server/mediation"
import { fail, handle, json } from "@/server/http"
import { notify, TEAM_INBOX } from "@/server/mail"
import { clientIp, rateLimit } from "@/server/rate-limit"
import { DeclaredSchema, isOurUpload } from "@/server/public-schemas"

const Schema = z.object({
	// Telefone OU email (numa urgência, a pessoa usa o que se lembrar).
	email: z.union([z.literal(""), z.string().email().max(200)]).default(""),
	name: z.string().max(200).default(""),
	phone: z.string().max(60).default(""),
	claimType: z.string().refine((t) => CLAIM_TYPES.some((c) => c.id === t), "Tipo de ocorrência inválido."),
	occurredAt: z.string().max(30).default(""),
	location: z.string().max(300).default(""),
	description: z.string().max(5000).default(""),
	company: z.string().max(200).default(""),
	declared: DeclaredSchema,
	photos: z.array(z.string().url().refine(isOurUpload, "Fotografia inválida.")).max(15).default([]),
	website: z.string().optional(), // honeypot
})

/** POST /api/public/claims — participação de sinistro (sem conta). */
export async function POST(req: Request) {
	if (!rateLimit(`claim:${clientIp(req)}`, 6, 60 * 60_000)) return fail("Demasiados pedidos. Tente mais tarde.", 429)
	const parsed = Schema.safeParse(await req.json().catch(() => null))
	if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Dados inválidos.")
	const data = parsed.data
	if (data.website) return json({ ref: "SN-OK" })

	try {
		if (!data.email && phoneKey(data.phone).length < 9) return fail("Indique um telefone ou email para o podermos contactar.")
		const known = (data.email ? await findClientByContact(data.email) : null) ?? (data.phone ? await findClientByContact(data.phone) : null)
		if (!data.photos.length && !data.description.trim())
			return fail("Envie pelo menos uma fotografia ou descreva o que aconteceu.")

		const { website: _hp, ...input } = data
		void _hp
		const claim = await createClaim(input)
		const label = claimLabel(claim.claimType)

		await Promise.all([
			claim.email &&
			notify(
				claim.email,
				`Recebemos a sua participação — ${claim.ref}`,
				`Olá${claim.name ? ` ${claim.name.split(" ")[0]}` : ""},

Recebemos a participação do sinistro "${label}" (referência ${claim.ref}) com ${claim.photos.length} fotografia(s).

Um gestor de sinistros vai analisar a ocorrência e a sua apólice e contacta-o com os próximos passos. Guarde os originais das fotografias e quaisquer documentos (auto da polícia, faturas, relatórios).

Equipa de Sinistros — Global Services Corporation`
			),
			notify(
				TEAM_INBOX,
				`[Sinistro] ${label} — ${claim.name || claim.email} (${claim.ref})`,
				`Novo sinistro participado no site.

- Tipo: ${label}
- Cliente: ${claim.name || "—"} · ${claim.email || "sem email"} ${known ? "(cliente existente)" : "(não registado)"}
- Telefone: ${claim.phone || "—"}
- Fotografias: ${claim.photos.length}

Abra o painel em /admin/sinistros para analisar.`
			),
		])

		return json({ ref: claim.ref }, 201)
	} catch (err) {
		return handle(err)
	}
}
