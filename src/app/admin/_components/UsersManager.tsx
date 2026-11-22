"use client"

import { Loader2, Trash2, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "react-toastify"
import { changePasswordAction, createAdminAction, removeAdminAction } from "../actions"
import { Card, TextInput } from "./fields"

interface Admin {
	id: string
	name: string
	email: string
	createdAt: string
	lastLoginAt: string | null
}

const fmt = (d: string | null) =>
	d ? new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(d)) : "nunca"

export default function UsersManager({ admins, currentId }: { admins: Admin[]; currentId: string }) {
	const router = useRouter()
	const [pending, start] = useTransition()
	const [form, setForm] = useState({ name: "", email: "", password: "" })
	const [pw, setPw] = useState({ current: "", next: "" })

	const act = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>, msg: string, after?: () => void) =>
		start(async () => {
			const r = await fn()
			if (r.ok) {
				toast.success(r.message ?? msg)
				after?.()
				router.refresh()
			} else toast.error(r.error)
		})

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<Card title="Administradores">
				<ul className="divide-y divide-line">
					{admins.map((a) => (
						<li key={a.id} className="flex items-center justify-between gap-4 py-3">
							<span className="min-w-0">
								<span className="block truncate font-medium text-ink">
									{a.name} {a.id === currentId && <span className="text-xs font-normal text-royal">(você)</span>}
								</span>
								<span className="block truncate text-xs text-muted">{a.email} · último acesso: {fmt(a.lastLoginAt)}</span>
							</span>
							{a.id !== currentId && (
								<button
									aria-label={`Remover ${a.name}`}
									onClick={() => confirm(`Remover o acesso de ${a.email}?`) && act(() => removeAdminAction(a.id), "Acesso removido.")}
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-600 hover:bg-red-50">
									<Trash2 className="h-4 w-4" />
								</button>
							)}
						</li>
					))}
					{admins.length === 0 && <li className="py-6 text-center text-sm text-muted">Sem administradores na base de dados.</li>}
				</ul>
			</Card>

			<div className="grid content-start gap-6">
				<Card title="Adicionar administrador">
					<form
						className="grid gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							act(() => createAdminAction(form), "Administrador criado.", () => setForm({ name: "", email: "", password: "" }))
						}}>
						<TextInput label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
						<TextInput label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
						<TextInput label="Palavra-passe inicial" type="password" minLength={8} value={form.password} onChange={(v) => setForm({ ...form, password: v })} hint="Mínimo 8 caracteres." required />
						<button disabled={pending} className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
							{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Adicionar
						</button>
					</form>
				</Card>

				<Card title="Alterar a minha palavra-passe">
					<form
						className="grid gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							act(() => changePasswordAction(pw), "Palavra-passe alterada.", () => setPw({ current: "", next: "" }))
						}}>
						<TextInput label="Atual" type="password" autoComplete="current-password" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} required />
						<TextInput label="Nova" type="password" autoComplete="new-password" minLength={8} value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} required />
						<button disabled={pending} className="rounded-xl border border-ink px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-50">
							Alterar
						</button>
					</form>
				</Card>
			</div>
		</div>
	)
}
