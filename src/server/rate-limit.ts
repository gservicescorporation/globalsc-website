/**
 * Limite simples de pedidos por IP (em memória, por instância do servidor).
 * Suficiente para travar abusos básicos nos formulários públicos.
 */
const hits = new Map<string, number[]>()

export function clientIp(req: Request) {
	return (
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		req.headers.get("x-real-ip") ||
		"desconhecido"
	)
}

export function rateLimit(key: string, max: number, windowMs: number) {
	const now = Date.now()
	const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
	if (list.length >= max) {
		hits.set(key, list)
		return false
	}
	list.push(now)
	hits.set(key, list)
	if (hits.size > 5000) {
		for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k)
	}
	return true
}
