import { jwtVerify, SignJWT } from "jose"

/** Utilitários de sessão sem dependências Node (usados também no proxy). */

export const SESSION_COOKIE = "gsc_admin_session"
export const SESSION_TTL_SECONDS = 60 * 60 * 12 // 12 horas

export interface SessionPayload {
	sub: string
	email: string
	name: string
}

function secret() {
	const value = process.env.AUTH_SECRET
	if (!value || value.length < 32) {
		throw new Error(
			"AUTH_SECRET em falta ou demasiado curto (mínimo 32 caracteres)."
		)
	}
	return new TextEncoder().encode(value)
}

export async function signSession(payload: SessionPayload) {
	return new SignJWT({ email: payload.email, name: payload.name })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.sub)
		.setIssuedAt()
		.setExpirationTime(`${SESSION_TTL_SECONDS}s`)
		.sign(secret())
}

export async function verifySession(
	token: string | undefined
): Promise<SessionPayload | null> {
	if (!token) return null
	try {
		const { payload } = await jwtVerify(token, secret(), {
			algorithms: ["HS256"],
		})
		return {
			sub: String(payload.sub),
			email: String(payload.email),
			name: String(payload.name ?? ""),
		}
	} catch {
		return null
	}
}
