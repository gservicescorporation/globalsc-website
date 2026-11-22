"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
	authenticate,
	changePassword,
	createAdmin,
	endSession,
	removeAdmin,
	requireAdmin,
	startSession,
} from "@/server/auth"
import {
	deleteEvent,
	duplicateEvent,
	getEventById,
	importLegacyEvents,
	saveEvent,
} from "@/server/events"
import {
	deleteSlide,
	importDefaultSlides,
	reorderSlides,
	saveSlide,
} from "@/server/slides"
import type { EventRecord, HeroSlideRecord } from "@/types/event"
import type { SiteContent } from "@/types/content"
import { saveSiteContent } from "@/server/content"

export type ActionResult<T = undefined> =
	| { ok: true; data?: T; message?: string }
	| { ok: false; error: string }

function fail(err: unknown): { ok: false; error: string } {
	console.error("[admin]", err)
	return {
		ok: false,
		error: err instanceof Error ? err.message : "Ocorreu um erro inesperado.",
	}
}

function refreshSite() {
	revalidatePath("/", "layout")
}

/* --------------------------------- Sessão -------------------------------- */

export async function loginAction(
	_prev: { error?: string } | undefined,
	formData: FormData
) {
	const email = String(formData.get("email") ?? "")
	const password = String(formData.get("password") ?? "")
	const next = String(formData.get("next") ?? "/admin")
	let session
	try {
		session = await authenticate(email, password)
	} catch (err) {
		return fail(err)
	}
	if (!session) return { ok: false, error: "Email ou palavra-passe incorretos." }
	await startSession(session)
	redirect(next.startsWith("/admin") ? next : "/admin")
}

export async function logoutAction() {
	await endSession()
	redirect("/admin/login")
}

/* -------------------------------- Eventos -------------------------------- */

export async function saveEventAction(
	record: EventRecord
): Promise<ActionResult<{ id: string; slug: string }>> {
	await requireAdmin()
	try {
		const saved = await saveEvent(record)
		refreshSite()
		return { ok: true, data: { id: saved.id, slug: saved.slug } }
	} catch (err) {
		return fail(err)
	}
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
	await requireAdmin()
	try {
		await deleteEvent(id)
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function duplicateEventAction(
	id: string
): Promise<ActionResult<{ id: string }>> {
	await requireAdmin()
	try {
		const copy = await duplicateEvent(id)
		refreshSite()
		return { ok: true, data: { id: copy.id } }
	} catch (err) {
		return fail(err)
	}
}

export async function setEventFlagsAction(
	id: string,
	flags: Partial<Pick<EventRecord, "status" | "featured">>
): Promise<ActionResult> {
	await requireAdmin()
	try {
		const current = await getEventById(id)
		if (!current) throw new Error("Evento não encontrado.")
		await saveEvent({ ...current, ...flags })
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function importLegacyAction(): Promise<ActionResult> {
	await requireAdmin()
	try {
		const events = await importLegacyEvents()
		const slides = await importDefaultSlides()
		refreshSite()
		return {
			ok: true,
			message: `${events} evento(s) e ${slides} destaque(s) importados.`,
		}
	} catch (err) {
		return fail(err)
	}
}

/* ------------------------------- Destaques ------------------------------- */

export async function saveSlideAction(
	slide: HeroSlideRecord
): Promise<ActionResult> {
	await requireAdmin()
	try {
		await saveSlide(slide)
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function deleteSlideAction(id: string): Promise<ActionResult> {
	await requireAdmin()
	try {
		await deleteSlide(id)
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function reorderSlidesAction(ids: string[]): Promise<ActionResult> {
	await requireAdmin()
	try {
		await reorderSlides(ids)
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

/* ----------------------------- Utilizadores ------------------------------ */

export async function createAdminAction(input: {
	name: string
	email: string
	password: string
}): Promise<ActionResult> {
	await requireAdmin()
	try {
		await createAdmin(input.name, input.email, input.password)
		revalidatePath("/admin/users")
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function removeAdminAction(id: string): Promise<ActionResult> {
	const session = await requireAdmin()
	try {
		await removeAdmin(id, session.sub)
		revalidatePath("/admin/users")
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}

export async function changePasswordAction(input: {
	current: string
	next: string
}): Promise<ActionResult> {
	const session = await requireAdmin()
	try {
		await changePassword(session.sub, input.current, input.next)
		return { ok: true, message: "Palavra-passe alterada." }
	} catch (err) {
		return fail(err)
	}
}

/* --------------------------- Conteúdo do site ---------------------------- */

export async function saveContentAction(content: SiteContent): Promise<ActionResult> {
	await requireAdmin()
	try {
		await saveSiteContent(content)
		refreshSite()
		return { ok: true }
	} catch (err) {
		return fail(err)
	}
}
