"use client"

import { Building2, Plus, Search, User, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import type { ClientRow } from "@/entities/mediation"
import { saveClientAction } from "../mediation-actions"
import { Field, TextInput, inputCls } from "./fields"
import { Empty, useAction } from "./ui"

const blank = { kind: "empresa" as ClientRow["kind"], name: "", email: "", phone: "", nif: "", sector: "", address: "", companyId: "" }

export default function ClientsList({ clients }: { clients: ClientRow[] }) {
	const router = useRouter()
	const { pending, call } = useAction()
	const [q, setQ] = useState("")
	const [kind, setKind] = useState<"todos" | "empresa" | "particular">("todos")
	const [form, setForm] = useState<typeof blank | null>(null)
	const companies = clients.filter((c) => c.kind === "empresa")
	const companyName = new Map(companies.map((c) => [c.id, c.name]))

	const list = useMemo(() => {
		const t = q.trim().toLowerCase()
		return clients
			.filter((c) => kind === "todos" || c.kind === kind)
			.filter((c) => !t || `${c.name} ${c.email} ${c.nif ?? ""} ${c.phone ?? ""}`.toLowerCase().includes(t))
	}, [clients, q, kind])

	return (
		<div className="grid gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
					<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar por nome, email, NIF…" className={`${inputCls} pl-9`} />
				</div>
				<div className="flex gap-1 rounded-xl border border-line bg-white p-1">
					{(["todos", "empresa", "particular"] as const).map((k) => (
						<button key={k} onClick={() => setKind(k)} className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${kind === k ? "bg-ink text-white" : "text-tertiary"}`}>
							{k === "todos" ? "Todos" : k === "empresa" ? "Empresas" : "Particulares"}
						</button>
					))}
				</div>
				<button type="button" onClick={() => setForm(blank)} className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal">
					<Plus className="h-4 w-4" /> Novo cliente
				</button>
			</div>

			{list.length === 0 ? (
				<Empty>Nenhum cliente encontrado.</Empty>
			) : (
				<ul className="grid gap-2">
					{list.map((c) => (
						<li key={c.id}>
							<Link href={`/admin/clientes/${c.id}`} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 hover:border-royal">
								<span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.kind === "empresa" ? "bg-royal/10 text-royal" : "bg-background text-tertiary"}`}>
									{c.kind === "empresa" ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
								</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate font-medium text-ink">{c.name}</span>
									<span className="block truncate text-xs text-muted">
										{c.email}
										{c.companyId && companyName.get(c.companyId) ? ` · ${companyName.get(c.companyId)}` : ""}
										{c.nif ? ` · NIF ${c.nif}` : ""}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}

			{form && (
				<div className="fixed inset-0 z-50 flex justify-end">
					<button aria-label="Fechar" className="absolute inset-0 bg-ink/50" onClick={() => setForm(null)} />
					<div className="relative flex h-full w-full max-w-lg flex-col bg-background shadow-2xl">
						<div className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
							<h2 className="font-semibold text-ink">Novo cliente</h2>
							<button onClick={() => setForm(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
						</div>
						<div className="grid flex-1 content-start gap-4 overflow-y-auto p-6" data-lenis-prevent>
							<div className="grid grid-cols-2 gap-2">
								{(["empresa", "particular"] as const).map((k) => (
									<button key={k} type="button" onClick={() => setForm({ ...form, kind: k })} className={`rounded-xl px-3 py-2.5 text-sm font-semibold ring-1 ${form.kind === k ? "bg-ink text-white ring-ink" : "bg-white ring-line"}`}>
										{k === "empresa" ? "Empresa" : "Particular / colaborador"}
									</button>
								))}
							</div>
							<TextInput label={form.kind === "empresa" ? "Nome da empresa *" : "Nome completo *"} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
							<TextInput label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} hint="É pelo email que o site reconhece o cliente." />
							<div className="grid gap-4 sm:grid-cols-2">
								<TextInput label="Telefone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
								<TextInput label="NIF" value={form.nif} onChange={(v) => setForm({ ...form, nif: v })} />
							</div>
							{form.kind === "empresa" ? (
								<TextInput label="Sector" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} />
							) : (
								<Field label="Empresa onde trabalha">
									<select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className={inputCls}>
										<option value="">— Nenhuma —</option>
										{companies.map((c) => (
											<option key={c.id} value={c.id}>
												{c.name}
											</option>
										))}
									</select>
								</Field>
							)}
							<TextInput label="Morada" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
						</div>
						<div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
							<button onClick={() => setForm(null)} className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium">Cancelar</button>
							<button
								disabled={pending}
								onClick={() =>
									call(
										() => saveClientAction({ ...form, phone: form.phone || null, nif: form.nif || null, sector: form.sector || null, address: form.address || null, companyId: form.companyId || null }),
										"Cliente criado.",
										(id) => {
											setForm(null)
											if (id) router.push(`/admin/clientes/${id}`)
										}
									)
								}
								className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
								Criar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
