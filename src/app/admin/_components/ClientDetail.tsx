"use client"

import { ArrowLeft, FileText, Pencil, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { INSURANCE_TYPES, claimLabel, typeLabel } from "@/content/insurance-catalog"
import type { ClaimRow, PolicyRow, QuoteRequestRow } from "@/entities/mediation"
import type { ClientProfile } from "@/server/mediation"
import { deleteClientAction, deletePolicyAction, saveClientAction, savePolicyAction } from "../mediation-actions"
import { Card, Field, ImageListField, TextArea, TextInput, Toggle, inputCls } from "./fields"
import { Empty, StatusBadge, fmtDate, useAction } from "./ui"

type PolicyForm = Partial<PolicyRow> & { clientId: string; insurerId: string; insuranceType: string }

export default function ClientDetail({
	profile,
	insurers,
	companies,
	history,
}: {
	profile: ClientProfile
	insurers: { id: string; name: string }[]
	companies: { id: string; name: string }[]
	history: { quotes: QuoteRequestRow[]; claims: ClaimRow[] }
}) {
	const router = useRouter()
	const { pending, call } = useAction()
	const { client } = profile
	const [c, setC] = useState({ ...client, phone: client.phone ?? "", nif: client.nif ?? "", sector: client.sector ?? "", address: client.address ?? "" })
	const [policy, setPolicy] = useState<PolicyForm | null>(null)

	const own = profile.policies.filter((p) => p.ownedBy === "proprio")
	const companyPolicies = profile.policies.filter((p) => p.ownedBy === "empresa")

	const newPolicy = (): PolicyForm => ({
		clientId: client.id,
		insurerId: insurers[0]?.id ?? "",
		insuranceType: INSURANCE_TYPES.find((t) => t.audiences.includes(client.kind))?.id ?? "outro",
		policyNumber: "",
		startDate: "",
		endDate: "",
		sumInsured: "",
		deductible: "",
		clauses: "",
		documents: [],
		active: true,
	})

	return (
		<div className="grid gap-6 pb-16">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link href="/admin/clientes" aria-label="Voltar" className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white hover:border-royal">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div>
						<h1 className="text-xl font-semibold text-ink">{client.name}</h1>
						<p className="text-xs text-muted">
							{client.kind === "empresa" ? "Empresa" : "Particular"}
							{profile.company ? ` · colaborador de ${profile.company.name}` : ""} · cliente desde {fmtDate(client.createdAt)}
						</p>
					</div>
				</div>
				<button
					type="button"
					disabled={pending}
					onClick={() => {
						if (confirm(`Eliminar ${client.name} e todas as apólices? Pedidos e sinistros ficam, mas sem ligação.`))
							call(() => deleteClientAction(client.id), "Cliente eliminado.", () => router.push("/admin/clientes"))
					}}
					className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50">
					<Trash2 className="h-4 w-4" /> Eliminar
				</button>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				<div className="grid content-start gap-6 lg:col-span-5">
					<Card title="Dados">
						<TextInput label="Nome" value={c.name} onChange={(v) => setC({ ...c, name: v })} />
						<TextInput label="Email" type="email" value={c.email} onChange={(v) => setC({ ...c, email: v })} />
						<div className="grid gap-4 sm:grid-cols-2">
							<TextInput label="Telefone" value={c.phone} onChange={(v) => setC({ ...c, phone: v })} />
							<TextInput label="NIF" value={c.nif} onChange={(v) => setC({ ...c, nif: v })} />
						</div>
						{c.kind === "empresa" ? (
							<TextInput label="Sector" value={c.sector} onChange={(v) => setC({ ...c, sector: v })} />
						) : (
							<Field label="Empresa">
								<select value={c.companyId ?? ""} onChange={(e) => setC({ ...c, companyId: e.target.value || null })} className={inputCls}>
									<option value="">— Nenhuma —</option>
									{companies.map((x) => (
										<option key={x.id} value={x.id}>
											{x.name}
										</option>
									))}
								</select>
							</Field>
						)}
						<TextInput label="Morada" value={c.address} onChange={(v) => setC({ ...c, address: v })} />
						<TextArea label="Notas internas" rows={3} value={c.notes} onChange={(v) => setC({ ...c, notes: v })} />
						<button
							type="button"
							disabled={pending}
							onClick={() =>
								call(
									() => saveClientAction({ ...c, phone: c.phone || null, nif: c.nif || null, sector: c.sector || null, address: c.address || null }),
									"Dados guardados."
								)
							}
							className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
							Guardar dados
						</button>
					</Card>

					{client.kind === "empresa" && (
						<Card title={`Colaboradores (${profile.members.length})`} description="Particulares ligados a esta empresa: usam as apólices da empresa nos sinistros.">
							{profile.members.length ? (
								<ul className="divide-y divide-line text-sm">
									{profile.members.map((m) => (
										<li key={m.id}>
											<Link href={`/admin/clientes/${m.id}`} className="flex justify-between gap-3 py-2.5 hover:text-royal">
												<span className="font-medium">{m.name}</span>
												<span className="truncate text-muted">{m.email}</span>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-muted">Sem colaboradores registados.</p>
							)}
						</Card>
					)}
				</div>

				<div className="grid content-start gap-6 lg:col-span-7">
					<Card title="Apólices" description="Plafond, franquia e cláusulas são usados pela IA para analisar sinistros.">
						<button
							type="button"
							disabled={!insurers.length}
							onClick={() => setPolicy(newPolicy())}
							className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
							<Plus className="h-4 w-4" /> Nova apólice
						</button>
						{!insurers.length && (
							<p className="text-sm text-amber-700">
								Registe primeiro uma seguradora em{" "}
								<Link href="/admin/seguradoras" className="font-semibold underline">
									Seguradoras
								</Link>
								.
							</p>
						)}
						{own.length === 0 && companyPolicies.length === 0 && <Empty>Sem apólices.</Empty>}
						{[...own, ...companyPolicies].map((p) => (
							<div key={p.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line p-4">
								<div className="min-w-0 text-sm">
									<p className="font-semibold text-ink">
										{typeLabel(p.insuranceType)} · {p.insurerName}
										{p.ownedBy === "empresa" && <span className="ml-2 rounded-full bg-royal/10 px-2 py-0.5 text-xs text-royal">da empresa</span>}
										{!p.active && <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">inativa</span>}
									</p>
									<p className="text-muted">
										Nº {p.policyNumber || "s/n"} · {p.startDate || "?"} a {p.endDate || "?"}
									</p>
									{p.sumInsured && <p className="mt-1 text-tertiary">Plafond: {p.sumInsured}</p>}
									{p.documents.length > 0 && (
										<div className="mt-2 flex flex-wrap gap-2">
											{p.documents.map((d, i) => (
												<a key={d} href={d} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-royal hover:underline">
													<FileText className="h-3.5 w-3.5" /> Documento {i + 1}
												</a>
											))}
										</div>
									)}
								</div>
								{p.ownedBy === "proprio" && (
									<div className="flex shrink-0 gap-1">
										<button aria-label="Editar" onClick={() => setPolicy({ ...p })} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background">
											<Pencil className="h-4 w-4" />
										</button>
										<button
											aria-label="Eliminar"
											onClick={() => confirm("Eliminar esta apólice?") && call(() => deletePolicyAction(p.id, client.id), "Apólice eliminada.")}
											className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								)}
							</div>
						))}
					</Card>

					<Card title="Pedidos e sinistros">
						{history.quotes.length + history.claims.length === 0 ? (
							<p className="text-sm text-muted">Sem histórico.</p>
						) : (
							<ul className="divide-y divide-line text-sm">
								{history.quotes.map((q) => (
									<li key={q.id}>
										<Link href={`/admin/pedidos/${q.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-royal">
											<span>
												<span className="font-mono text-xs text-royal">{q.ref}</span> Pedido · {typeLabel(q.insuranceType)}
											</span>
											<StatusBadge kind="quote" status={q.status} />
										</Link>
									</li>
								))}
								{history.claims.map((s) => (
									<li key={s.id}>
										<Link href={`/admin/sinistros/${s.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-royal">
											<span>
												<span className="font-mono text-xs text-royal">{s.ref}</span> Sinistro · {claimLabel(s.claimType)}
											</span>
											<StatusBadge kind="claim" status={s.status} />
										</Link>
									</li>
								))}
							</ul>
						)}
					</Card>
				</div>
			</div>

			{policy && (
				<div className="fixed inset-0 z-50 flex justify-end">
					<button aria-label="Fechar" className="absolute inset-0 bg-ink/50" onClick={() => setPolicy(null)} />
					<div className="relative flex h-full w-full max-w-xl flex-col bg-background shadow-2xl">
						<div className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
							<h2 className="font-semibold text-ink">{policy.id ? "Editar apólice" : "Nova apólice"}</h2>
							<button onClick={() => setPolicy(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
						</div>
						<div className="grid flex-1 content-start gap-4 overflow-y-auto p-6" data-lenis-prevent>
							<div className="grid gap-4 sm:grid-cols-2">
								<Field label="Seguradora">
									<select value={policy.insurerId} onChange={(e) => setPolicy({ ...policy, insurerId: e.target.value })} className={inputCls}>
										{insurers.map((i) => (
											<option key={i.id} value={i.id}>
												{i.name}
											</option>
										))}
									</select>
								</Field>
								<Field label="Ramo">
									<select value={policy.insuranceType} onChange={(e) => setPolicy({ ...policy, insuranceType: e.target.value })} className={inputCls}>
										{INSURANCE_TYPES.map((t) => (
											<option key={t.id} value={t.id}>
												{t.label}
											</option>
										))}
										<option value="outro">Outro</option>
									</select>
								</Field>
							</div>
							<TextInput label="Nº da apólice" value={policy.policyNumber} onChange={(v) => setPolicy({ ...policy, policyNumber: v })} />
							<div className="grid gap-4 sm:grid-cols-2">
								<TextInput label="Início" type="date" value={policy.startDate ?? ""} onChange={(v) => setPolicy({ ...policy, startDate: v || null })} />
								<TextInput label="Fim" type="date" value={policy.endDate ?? ""} onChange={(v) => setPolicy({ ...policy, endDate: v || null })} />
							</div>
							<TextArea label="Capital seguro / plafonds" rows={3} value={policy.sumInsured} onChange={(v) => setPolicy({ ...policy, sumInsured: v })} hint="ex.: Internamento 10.000.000 AOA/ano; ambulatório 2.000.000 AOA" />
							<TextArea label="Franquias" rows={2} value={policy.deductible} onChange={(v) => setPolicy({ ...policy, deductible: v })} />
							<TextArea label="Cláusulas e condições relevantes" rows={6} value={policy.clauses} onChange={(v) => setPolicy({ ...policy, clauses: v })} hint="Cole as cláusulas importantes, exclusões, prazos de participação…" />
							<ImageListField label="Documentos da apólice (PDF)" accept="application/pdf" tileClass="aspect-[3/4]" value={policy.documents ?? []} onChange={(v) => setPolicy({ ...policy, documents: v })} />
							<Toggle label="Apólice ativa" checked={policy.active ?? true} onChange={(v) => setPolicy({ ...policy, active: v })} />
						</div>
						<div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
							<button onClick={() => setPolicy(null)} className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium">Cancelar</button>
							<button
								disabled={pending}
								onClick={() => call(() => savePolicyAction(policy), "Apólice guardada.", () => setPolicy(null))}
								className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
								Guardar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
