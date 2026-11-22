"use client"

import { useRouter } from "next/navigation"
import { useTransition, type ReactNode } from "react"
import { toast } from "react-toastify"
import { CLAIM_STATUS, QUOTE_STATUS } from "@/content/insurance-catalog"
import { fmtDate } from "./format"

export { fmtDate }

export function StatusBadge({ kind, status }: { kind: "quote" | "claim"; status: string }) {
	const map = kind === "quote" ? QUOTE_STATUS : CLAIM_STATUS
	const s = (map as Record<string, { label: string; tone: string }>)[status] ?? { label: status, tone: "bg-background text-tertiary" }
	return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${s.tone}`}>{s.label}</span>
}

export function PageTitle({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
	return (
		<div className="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
				{text && <p className="mt-1 text-sm text-tertiary">{text}</p>}
			</div>
			{action}
		</div>
	)
}

export function Empty({ children }: { children: ReactNode }) {
	return <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">{children}</p>
}

/** Executa uma server action com estado de carregamento, toast e refresh. */
export function useAction() {
	const router = useRouter()
	const [pending, start] = useTransition()
	const call = <T,>(
		fn: () => Promise<{ ok: true; data?: T; message?: string } | { ok: false; error: string }>,
		success?: string,
		after?: (data: T | undefined) => void
	) =>
		start(async () => {
			const res = await fn()
			if (!res.ok) return void toast.error(res.error)
			if (success) toast.success(res.message ?? success)
			after?.(res.data)
			router.refresh()
		})
	return { pending, call }
}


export function Activity({ items }: { items: { at: string; by: string; text: string }[] }) {
	return (
		<ol className="relative grid gap-4 border-l border-line pl-5">
			{[...items].reverse().map((a, i) => (
				<li key={i} className="relative">
					<span className="absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full bg-royal ring-4 ring-white" />
					<p className="text-sm text-ink">{a.text}</p>
					<p className="text-xs text-muted">
						{a.by} · {fmtDate(a.at)}
					</p>
				</li>
			))}
		</ol>
	)
}
