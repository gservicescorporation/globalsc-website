import { z } from "zod"
import { findClientByContact } from "@/server/mediation"
import { fail, json } from "@/server/http"
import { clientIp, rateLimit } from "@/server/rate-limit"

/**
 * POST /api/public/lookup — indica apenas SE o telefone/email já é cliente,
 * para o formulário não pedir dados que já temos. Nunca devolve dados pessoais.
 */
export async function POST(req: Request) {
	if (!rateLimit(`lookup:${clientIp(req)}`, 20, 10 * 60_000)) return fail("Demasiados pedidos. Tente daqui a pouco.", 429)
	const body = (await req.json().catch(() => null)) as { contact?: unknown; email?: unknown } | null
	const parsed = z.string().trim().min(5).max(200).safeParse(body?.contact ?? body?.email)
	if (!parsed.success) return fail("Indique um telefone ou email.")
	try {
		const client = await findClientByContact(parsed.data)
		return json({ known: Boolean(client) })
	} catch {
		return json({ known: false })
	}
}
