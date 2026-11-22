import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto"
import { promisify } from "util"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { hasDatabase, initDataSource } from "@/lib"
import { AdminUserEntity } from "@/entities/schemas"
import {
	SESSION_COOKIE,
	SESSION_TTL_SECONDS,
	signSession,
	verifySession,
	type SessionPayload,
} from "@/lib/session"

const scrypt = promisify(scryptCb) as (
	password: string,
	salt: Buffer,
	keylen: number
) => Promise<Buffer>

export async function hashPassword(password: string) {
	const salt = randomBytes(16)
	const hash = await scrypt(password, salt, 64)
	return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string) {
	const [algo, saltHex, hashHex] = stored.split("$")
	if (algo !== "scrypt" || !saltHex || !hashHex) return false
	const expected = Buffer.from(hashHex, "hex")
	const actual = await scrypt(password, Buffer.from(saltHex, "hex"), 64)
	return expected.length === actual.length && timingSafeEqual(expected, actual)
}

async function users() {
	const ds = await initDataSource()
	return ds.getRepository(AdminUserEntity)
}

/**
 * Valida credenciais. Se ainda não existir nenhum administrador, as
 * credenciais ADMIN_EMAIL / ADMIN_PASSWORD do ambiente criam o primeiro.
 */
export async function authenticate(
	email: string,
	password: string
): Promise<SessionPayload | null> {
	const normalized = email.trim().toLowerCase()
	const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
	const envPassword = process.env.ADMIN_PASSWORD

	if (!hasDatabase()) {
		// Modo sem BD: só a conta do ambiente (apenas leitura na prática).
		if (envEmail && envPassword && normalized === envEmail && password === envPassword) {
			return { sub: "env-admin", email: envEmail, name: "Administrador" }
		}
		return null
	}

	const repo = await users()

	if ((await repo.count()) === 0) {
		if (envEmail && envPassword && normalized === envEmail && password === envPassword) {
			const created = await repo.save({
				name: "Administrador",
				email: envEmail,
				passwordHash: await hashPassword(envPassword),
			})
			return { sub: created.id, email: created.email, name: created.name }
		}
		return null
	}

	const user = await repo.findOne({ where: { email: normalized } })
	if (!user || !(await verifyPassword(password, user.passwordHash))) return null
	await repo.update({ id: user.id }, { lastLoginAt: new Date() })
	return { sub: user.id, email: user.email, name: user.name }
}

export async function startSession(payload: SessionPayload) {
	const token = await signSession(payload)
	const jar = await cookies()
	jar.set(SESSION_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: SESSION_TTL_SECONDS,
	})
}

export async function endSession() {
	const jar = await cookies()
	jar.delete(SESSION_COOKIE)
}

export async function getSession() {
	const jar = await cookies()
	return verifySession(jar.get(SESSION_COOKIE)?.value)
}

/** Para páginas e server actions do painel. */
export async function requireAdmin() {
	const session = await getSession()
	if (!session) redirect("/admin/login")
	return session
}

/* ------------------------- Gestão de utilizadores ------------------------ */

export async function listAdmins() {
	if (!hasDatabase()) return []
	const repo = await users()
	const rows = await repo.find({ order: { createdAt: "ASC" } })
	return rows.map((u) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		createdAt: u.createdAt.toISOString(),
		lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
	}))
}

export async function createAdmin(name: string, email: string, password: string) {
	if (password.length < 8)
		throw new Error("A palavra-passe deve ter pelo menos 8 caracteres.")
	const repo = await users()
	const normalized = email.trim().toLowerCase()
	if (await repo.findOne({ where: { email: normalized } }))
		throw new Error("Já existe um administrador com este email.")
	await repo.save({
		name: name.trim() || normalized,
		email: normalized,
		passwordHash: await hashPassword(password),
	})
}

export async function removeAdmin(id: string, currentUserId: string) {
	if (id === currentUserId)
		throw new Error("Não pode remover a sua própria conta.")
	const repo = await users()
	if ((await repo.count()) <= 1)
		throw new Error("Tem de existir pelo menos um administrador.")
	await repo.delete({ id })
}

export async function changePassword(
	userId: string,
	current: string,
	next: string
) {
	if (next.length < 8)
		throw new Error("A nova palavra-passe deve ter pelo menos 8 caracteres.")
	const repo = await users()
	const user = await repo.findOne({ where: { id: userId } })
	if (!user || !(await verifyPassword(current, user.passwordHash)))
		throw new Error("A palavra-passe atual está incorreta.")
	await repo.update({ id: userId }, { passwordHash: await hashPassword(next) })
}
