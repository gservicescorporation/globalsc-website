import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getSession } from "./auth"

/** Utilitários comuns da API REST interna. */

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status })

export const fail = (message: string, status = 400) => NextResponse.json({ message }, { status })

/** Devolve a sessão ou uma resposta 401 (o proxy já filtra, isto é a 2ª linha de defesa). */
export async function guard() {
	const session = await getSession()
	return session ? { session } : { error: fail("Não autorizado", 401) }
}

export async function body<T>(req: Request): Promise<T | null> {
	try {
		return (await req.json()) as T
	} catch {
		return null
	}
}

export function refreshSite() {
	revalidatePath("/", "layout")
}

export function handle(err: unknown) {
	console.error("[api]", err)
	return fail(err instanceof Error ? err.message : "Erro inesperado.", 500)
}
