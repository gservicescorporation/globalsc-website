"use client"

import { Copy, Eye, EyeOff, MoreHorizontal, Pencil, Search, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "react-toastify"
import { deleteEventAction, duplicateEventAction, setEventFlagsAction } from "../actions"
import { formatLongDate } from "@/app/utils/formatDate"
import type { EventSummary } from "@/types/event"
import { inputCls } from "./fields"

type Filter = "todos" | "proximos" | "realizados" | "rascunhos"

export default function EventsTable({ events, readOnly }: { events: EventSummary[]; readOnly: boolean }) {
	const router = useRouter()
	const [q, setQ] = useState("")
	const [filter, setFilter] = useState<Filter>("todos")
	const [menu, setMenu] = useState<string | null>(null)
	const [pending, start] = useTransition()
	const today = new Date().toISOString().slice(0, 10)

	const list = useMemo(() => {
		const term = q.trim().toLowerCase()
		return events
			.filter((e) =>
				filter === "proximos" ? e.startDate >= today : filter === "realizados" ? e.startDate < today : filter === "rascunhos" ? e.status === "draft" : true
			)
			.filter((e) => !term || `${e.title} ${e.category} ${e.location}`.toLowerCase().includes(term))
	}, [events, q, filter, today])

	const run = (fn: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
		start(async () => {
			setMenu(null)
			const res = await fn()
			if (res.ok) {
				toast.success(success)
				router.refresh()
			} else toast.error(res.error)
		})

	return (
		<div className="grid gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
					<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar eventos…" className={`${inputCls} pl-9`} />
				</div>
				<div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1">
					{(["todos", "proximos", "realizados", "rascunhos"] as Filter[]).map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${filter === f ? "bg-ink text-white" : "text-tertiary hover:text-ink"}`}>
							{f === "proximos" ? "Próximos" : f}
						</button>
					))}
				</div>
			</div>

			<ul className={`grid gap-3 ${pending ? "opacity-60" : ""}`}>
				{list.map((e) => (
					<li key={e.id} className="relative flex items-center gap-4 rounded-2xl border border-line bg-white p-3 pr-4">
						<Link href={`/admin/events/${e.id}`} className="flex min-w-0 flex-1 items-center gap-4">
							<span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-background sm:w-28">
								{e.coverUrl && (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={e.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
								)}
							</span>
							<span className="min-w-0">
								<span className="flex items-center gap-2">
									{e.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
									<span className="truncate font-medium text-ink">{e.title}</span>
								</span>
								<span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
									<span>{formatLongDate(e.startDate)}</span>
									{e.category && <span>{e.category}</span>}
									<span
										className={`rounded-full px-2 py-0.5 font-medium ${
											e.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
										}`}>
										{e.status === "published" ? "Publicado" : "Rascunho"}
									</span>
									{e.startDate >= today && <span className="rounded-full bg-royal/10 px-2 py-0.5 font-medium text-royal">Próximo</span>}
								</span>
							</span>
						</Link>

						<button
							type="button"
							aria-label="Ações"
							aria-expanded={menu === e.id}
							disabled={readOnly}
							onClick={() => setMenu(menu === e.id ? null : e.id)}
							className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-background disabled:opacity-30">
							<MoreHorizontal className="h-4 w-4" />
						</button>

						{menu === e.id && (
							<>
								<button aria-label="Fechar" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenu(null)} />
								<div className="absolute top-14 right-3 z-20 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1 text-sm shadow-xl">
									<Link href={`/admin/events/${e.id}`} className="flex items-center gap-2 px-4 py-2.5 hover:bg-background">
										<Pencil className="h-4 w-4" /> Editar
									</Link>
									<a href={`/events/${e.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 hover:bg-background">
										<Eye className="h-4 w-4" /> Ver no site
									</a>
									<button
										onClick={() =>
											run(
												() => setEventFlagsAction(e.id, { status: e.status === "published" ? "draft" : "published" }),
												e.status === "published" ? "Evento ocultado." : "Evento publicado."
											)
										}
										className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-background">
										{e.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										{e.status === "published" ? "Passar a rascunho" : "Publicar"}
									</button>
									<button onClick={() => run(() => setEventFlagsAction(e.id, { featured: !e.featured }), "Destaque atualizado.")} className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-background">
										<Star className="h-4 w-4" /> {e.featured ? "Remover destaque" : "Destacar"}
									</button>
									<button onClick={() => run(() => duplicateEventAction(e.id), "Evento duplicado como rascunho.")} className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-background">
										<Copy className="h-4 w-4" /> Duplicar
									</button>
									<button
										onClick={() => {
											if (confirm(`Eliminar definitivamente “${e.title}”? Esta ação não pode ser desfeita.`))
												run(() => deleteEventAction(e.id), "Evento eliminado.")
										}}
										className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-red-600 hover:bg-red-50">
										<Trash2 className="h-4 w-4" /> Eliminar
									</button>
								</div>
							</>
						)}
					</li>
				))}
				{list.length === 0 && (
					<li className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">Nenhum evento encontrado.</li>
				)}
			</ul>
		</div>
	)
}
