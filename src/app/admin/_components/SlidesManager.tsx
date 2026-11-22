"use client"

import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "react-toastify"
import { deleteSlideAction, reorderSlidesAction, saveSlideAction } from "../actions"
import type { HeroSlideRecord } from "@/types/event"
import { Field, ImageField, TextArea, TextInput, Toggle, inputCls } from "./fields"

const blank = (order: number): HeroSlideRecord => ({
	id: "",
	title: "",
	description: "",
	imageUrl: "",
	videoUrl: "",
	link: "",
	buttonText: "Saber mais",
	overlay: "",
	placement: "both",
	order,
	active: true,
})

const PLACEMENT = { both: "Início e Eventos", home: "Só página inicial", events: "Só página de eventos" }

export default function SlidesManager({ initial, readOnly }: { initial: HeroSlideRecord[]; readOnly: boolean }) {
	const router = useRouter()
	const [editing, setEditing] = useState<HeroSlideRecord | null>(null)
	const [pending, start] = useTransition()
	const isDefault = initial.some((s) => s.id.startsWith("default-"))

	const act = (fn: () => Promise<{ ok: boolean; error?: string }>, msg: string, after?: () => void) =>
		start(async () => {
			const r = await fn()
			if (r.ok) {
				toast.success(msg)
				after?.()
				router.refresh()
			} else toast.error(r.error)
		})

	const move = (i: number, d: number) => {
		const ids = initial.map((s) => s.id)
		const j = i + d
		if (j < 0 || j >= ids.length) return
		;[ids[i], ids[j]] = [ids[j], ids[i]]
		act(() => reorderSlidesAction(ids), "Ordem atualizada.")
	}

	return (
		<div className="grid gap-4">
			{readOnly && (
				<p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Base de dados não configurada — a mostrar os destaques predefinidos (apenas leitura).</p>
			)}
			<div className="flex justify-end">
				<button
					type="button"
					disabled={readOnly}
					onClick={() => setEditing(blank(initial.length))}
					className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
					<Plus className="h-4 w-4" /> Novo destaque
				</button>
			</div>

			<ul className={`grid gap-3 ${pending ? "opacity-60" : ""}`}>
				{initial.map((s, i) => (
					<li key={s.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3 pr-4">
						<span className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-background sm:w-40">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
							{!s.active && <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-xs font-semibold text-white">Inativo</span>}
						</span>
						<span className="min-w-0 flex-1">
							<span className="block truncate font-medium text-ink">{s.title}</span>
							<span className="mt-1 line-clamp-1 text-xs text-muted">{s.description}</span>
							<span className="mt-2 inline-block rounded-full bg-background px-2 py-0.5 text-xs text-tertiary">{PLACEMENT[s.placement]}</span>
						</span>
						{!readOnly && !isDefault && (
							<span className="flex shrink-0 gap-1">
								<button aria-label="Subir" onClick={() => move(i, -1)} className="hidden h-9 w-9 items-center justify-center rounded-xl hover:bg-background sm:flex"><ArrowUp className="h-4 w-4" /></button>
								<button aria-label="Descer" onClick={() => move(i, 1)} className="hidden h-9 w-9 items-center justify-center rounded-xl hover:bg-background sm:flex"><ArrowDown className="h-4 w-4" /></button>
								<button aria-label="Editar" onClick={() => setEditing(s)} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-background"><Pencil className="h-4 w-4" /></button>
								<button
									aria-label="Eliminar"
									onClick={() => confirm(`Eliminar o destaque “${s.title}”?`) && act(() => deleteSlideAction(s.id), "Destaque eliminado.")}
									className="flex h-9 w-9 items-center justify-center rounded-xl text-red-600 hover:bg-red-50">
									<Trash2 className="h-4 w-4" />
								</button>
							</span>
						)}
					</li>
				))}
			</ul>
			{isDefault && !readOnly && (
				<p className="text-sm text-muted">
					Estes são os destaques predefinidos. Use “Importar dados do site antigo” na visão geral para os tornar editáveis, ou crie um novo destaque.
				</p>
			)}

			{editing && (
				<div className="fixed inset-0 z-50 flex justify-end">
					<button aria-label="Fechar" className="absolute inset-0 bg-ink/50" onClick={() => setEditing(null)} />
					<div className="relative flex h-full w-full max-w-xl flex-col bg-background shadow-2xl">
						<div className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
							<h2 className="font-semibold text-ink">{editing.id ? "Editar destaque" : "Novo destaque"}</h2>
							<button onClick={() => setEditing(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
						</div>
						<div className="grid flex-1 content-start gap-5 overflow-y-auto p-6">
							<ImageField label="Imagem *" value={editing.imageUrl} onChange={(v) => setEditing({ ...editing, imageUrl: v })} />
							<TextInput label="Título *" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
							<TextArea label="Descrição" rows={3} value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />
							<div className="grid gap-5 sm:grid-cols-2">
								<TextInput label="Link do botão" value={editing.link} onChange={(v) => setEditing({ ...editing, link: v })} placeholder="/events/… ou https://…" />
								<TextInput label="Texto do botão" value={editing.buttonText} onChange={(v) => setEditing({ ...editing, buttonText: v })} />
							</div>
							<TextInput label="Vídeo de fundo (MP4, opcional)" value={editing.videoUrl} onChange={(v) => setEditing({ ...editing, videoUrl: v })} />
							<Field label="Onde mostrar">
								<select value={editing.placement} onChange={(e) => setEditing({ ...editing, placement: e.target.value as HeroSlideRecord["placement"] })} className={inputCls}>
									{Object.entries(PLACEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
								</select>
							</Field>
							<Toggle label="Ativo" checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} />
						</div>
						<div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
							<button onClick={() => setEditing(null)} className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium">Cancelar</button>
							<button
								disabled={pending}
								onClick={() => act(() => saveSlideAction(editing), "Destaque guardado.", () => setEditing(null))}
								className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
								{pending && <Loader2 className="h-4 w-4 animate-spin" />} Guardar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
