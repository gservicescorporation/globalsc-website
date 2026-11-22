"use client"

import { AlertTriangle, ArrowLeft, Download, ExternalLink, FileText, Loader2, MapPin, Send, Sparkles, UserPlus, Wand2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CLAIM_STATUS, claimLabel, typeLabel } from "@/content/insurance-catalog"
import type { ClaimRow } from "@/entities/mediation"
import type { ClaimAnalysis } from "@/server/ai"
import type { ClientProfile } from "@/server/mediation"
import {
	analyzeClaimAction,
	convertAction,
	generateFormAction,
	messageClaimClientAction,
	noteClaimAction,
	proposeFormAction,
	setClaimPolicyAction,
	setClaimStatusAction,
} from "../mediation-actions"
import { Card, inputCls } from "./fields"
import { Activity, StatusBadge, fmtDate, useAction } from "./ui"

type Template = { id: string; title: string; claimType: string; insurerId: string; insurerName: string; fieldCount: number }
type Field = { name: string; type: string; options?: string[] }

const VERDICT = {
	coberto: { label: "Provavelmente coberto", tone: "bg-emerald-50 text-emerald-800" },
	parcial: { label: "Cobertura parcial", tone: "bg-amber-50 text-amber-800" },
	nao_coberto: { label: "Provavelmente não coberto", tone: "bg-red-50 text-red-800" },
	incerto: { label: "Incerto — faltam dados", tone: "bg-background text-tertiary" },
}

export default function ClaimDetail({
	claim,
	profile,
	templates,
}: {
	claim: ClaimRow
	profile: ClientProfile | null
	templates: Template[]
}) {
	const { pending, call } = useAction()
	const ai = claim.ai as ClaimAnalysis | null
	const [subject, setSubject] = useState(ai?.mensagemCliente.assunto ?? `Sinistro ${claim.ref}`)
	const [body, setBody] = useState(ai?.mensagemCliente.corpo ?? "")
	const [note, setNote] = useState("")

	// Formulário da seguradora
	const relevantPolicy = profile?.policies.find((p) => p.id === claim.policyId)
	const sorted = [...templates].sort((a, b) => {
		const score = (t: Template) => (t.claimType === claim.claimType ? 2 : 0) + (relevantPolicy && t.insurerId === relevantPolicy.insurerId ? 1 : 0)
		return score(b) - score(a)
	})
	const [templateId, setTemplateId] = useState(sorted[0]?.id ?? "")
	const [fields, setFields] = useState<Field[]>([])
	const [values, setValues] = useState<Record<string, string>>({})
	const [aiValues, setAiValues] = useState<Record<string, string>>({})
	const [notes, setNotes] = useState<string[]>([])


	return (
		<div className="grid gap-6 pb-16">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link href="/admin/sinistros" aria-label="Voltar" className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white hover:border-royal">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div>
						<h1 className="text-xl font-semibold text-ink">
							{claimLabel(claim.claimType)} · <span className="font-mono text-royal">{claim.ref}</span>
						</h1>
						<p className="text-xs text-muted">Participado a {fmtDate(claim.createdAt)}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge kind="claim" status={claim.status} />
					<select
						aria-label="Alterar estado"
						value={claim.status}
						disabled={pending}
						onChange={(e) => call(() => setClaimStatusAction(claim.id, e.target.value), "Estado atualizado.")}
						className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
						{Object.entries(CLAIM_STATUS).map(([k, v]) => (
							<option key={k} value={k}>
								{v.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				<div className="grid content-start gap-6 lg:col-span-5">
					<Card title={`Fotografias (${claim.photos.length})`}>
						{claim.photos.length ? (
							<ul className="grid grid-cols-3 gap-2">
								{claim.photos.map((src, i) => (
									<li key={src}>
										<a href={src} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl bg-background" aria-label={`Abrir fotografia ${i + 1}`}>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={src} alt="" className="h-full w-full object-cover transition hover:scale-105" />
										</a>
									</li>
								))}
							</ul>
						) : (
							<p className="text-sm text-muted">Sem fotografias.</p>
						)}
					</Card>

					<Card title="Ocorrência">
						<dl className="grid gap-3 text-sm">
							<Row k="Quando" v={claim.occurredAt ? claim.occurredAt.replace("T", " às ") : "—"} />
							<Row k="Onde" v={claim.location || "—"} />
							<Row k="Descrição" v={claim.description || "—"} />
						</dl>
						{claim.location && (
							<a
								href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(claim.location.replace(/\s*\(.*\)$/, ""))}`}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-1 text-sm font-medium text-royal hover:underline">
								<MapPin className="h-4 w-4" /> Ver no mapa
							</a>
						)}
					</Card>

					<Card title="Cliente e apólice">
						{profile ? (
							<div className="grid gap-3 text-sm">
								<div>
									<p className="font-semibold text-ink">{profile.client.name}</p>
									<p className="text-tertiary">
										{profile.client.email} · {profile.client.phone || "sem telefone"}
									</p>
									{profile.company && <p className="text-tertiary">Colaborador de {profile.company.name}</p>}
								</div>
								<label className="grid gap-1.5">
									<span className="font-medium text-ink">Apólice a usar</span>
									<select
										value={claim.policyId ?? ""}
										disabled={pending}
										onChange={(e) => call(() => setClaimPolicyAction(claim.id, e.target.value), "Apólice associada.")}
										className={inputCls}>
										<option value="">— Escolher —</option>
										{profile.policies.map((p) => (
											<option key={p.id} value={p.id}>
												{typeLabel(p.insuranceType)} · {p.insurerName} · {p.policyNumber || "s/n"} {p.ownedBy === "empresa" ? "(empresa)" : ""}
											</option>
										))}
									</select>
								</label>
								{relevantPolicy && (
									<dl className="grid gap-2 rounded-xl bg-background p-3">
										<Row k="Capital / plafond" v={relevantPolicy.sumInsured || "—"} />
										<Row k="Franquia" v={relevantPolicy.deductible || "—"} />
										<Row k="Vigência" v={`${relevantPolicy.startDate || "?"} a ${relevantPolicy.endDate || "?"}`} />
									</dl>
								)}
								<Link href={`/admin/clientes/${profile.client.id}`} className="flex items-center gap-1 font-medium text-royal hover:underline">
									Abrir ficha do cliente <ExternalLink className="h-3.5 w-3.5" />
								</Link>
							</div>
						) : (
							<div className="grid gap-3 text-sm">
								<dl className="grid gap-2">
									<Row k="Nome" v={claim.name || "—"} />
									<Row k="Email" v={claim.email} />
									<Row k="Telefone" v={claim.phone || "—"} />
									{claim.company && <Row k="Empresa" v={claim.company} />}
									{claim.declared && <Row k="Apólice declarada" v={[claim.declared.insurer, claim.declared.policyNumber, claim.declared.endDate].filter(Boolean).join(" · ") || "—"} />}
								</dl>
								{claim.declared?.documentUrl && (
									<a href={claim.declared.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-royal hover:underline">
										<FileText className="h-4 w-4" /> Ver documento enviado
									</a>
								)}
								<p className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">Email não registado. Crie o cliente para usar plafonds e cláusulas na análise.</p>
								<button
									type="button"
									disabled={pending}
									onClick={() => call(() => convertAction("claim", claim.id), "Cliente criado e associado.")}
									className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-semibold text-white hover:bg-royal disabled:opacity-50">
									<UserPlus className="h-4 w-4" /> Criar cliente{claim.declared ? " e registar apólice" : ""}
								</button>
							</div>
						)}
					</Card>

					<Card title="Histórico e notas">
						<div className="flex gap-2">
							<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escrever uma nota interna…" className={inputCls} />
							<button
								type="button"
								disabled={pending || !note.trim()}
								onClick={() => call(() => noteClaimAction(claim.id, note), "Nota guardada.", () => setNote(""))}
								className="shrink-0 rounded-xl bg-ink px-3 text-sm font-semibold text-white disabled:opacity-40">
								Guardar
							</button>
						</div>
						<Activity items={claim.activity} />
					</Card>
				</div>

				<div className="grid content-start gap-6 lg:col-span-7">
					{/* Análise IA */}
					<section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-7">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<h2 className="flex items-center gap-2 font-semibold text-ink">
									<Sparkles className="h-5 w-5 text-violet-600" /> Como resolver este sinistro
								</h2>
								<p className="mt-1 text-sm text-tertiary">A IA analisa as fotografias, a descrição e o plafond, franquia e cláusulas da apólice.</p>
							</div>
							<button
								type="button"
								disabled={pending}
								onClick={() =>
									call(() => analyzeClaimAction(claim.id), "Análise concluída.", (d) => {
										if (d) {
											setSubject(d.mensagemCliente.assunto)
											setBody(d.mensagemCliente.corpo)
										}
									})
								}
								className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
								{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
								{ai ? "Analisar de novo" : "Analisar sinistro"}
							</button>
						</div>

						{ai && (
							<div className="mt-6 grid gap-4 text-sm">
								<p className="text-ink">{ai.resumo}</p>
								<div className={`rounded-2xl p-4 ${VERDICT[ai.cobertura.avaliacao].tone}`}>
									<p className="font-semibold">{VERDICT[ai.cobertura.avaliacao].label}</p>
									<p className="mt-1">{ai.cobertura.explicacao}</p>
									<p className="mt-2">
										<strong>Plafond:</strong> {ai.cobertura.plafondDisponivel} · <strong>Franquia:</strong> {ai.cobertura.franquia}
									</p>
								</div>
								{ai.cobertura.clausulasRelevantes.length > 0 && <List title="Cláusulas relevantes" items={ai.cobertura.clausulasRelevantes} />}
								{ai.observacoesFotos.length > 0 && <List title="O que se vê nas fotografias" items={ai.observacoesFotos} />}
								<List title="Passos recomendados" items={ai.passosRecomendados} />
								{ai.documentosNecessarios.length > 0 && <List title="Documentos a pedir" items={ai.documentosNecessarios} />}
								{ai.alertas.length > 0 && (
									<div className="rounded-2xl bg-red-50 p-4 text-red-800">
										<p className="flex items-center gap-2 font-semibold">
											<AlertTriangle className="h-4 w-4" /> Alertas
										</p>
										<ul className="mt-1 grid gap-1">
											{ai.alertas.map((a, i) => (
												<li key={i}>• {a}</li>
											))}
										</ul>
									</div>
								)}
								<p className="text-xs text-muted">A IA pode errar. Confirme sempre nas condições da apólice.</p>
							</div>
						)}
					</section>

					{/* Formulário da seguradora */}
					<Card title="Formulário de participação da seguradora" description="A IA preenche o modelo PDF da seguradora; reveja os valores antes de gerar. As suas correções ensinam a IA para a próxima vez.">
						{templates.length === 0 ? (
							<p className="text-sm text-muted">
								Ainda não há modelos. Carregue os PDFs de participação em{" "}
								<Link href="/admin/seguradoras" className="font-semibold text-royal underline">
									Seguradoras
								</Link>
								.
							</p>
						) : (
							<>
								<div className="flex flex-col gap-2 sm:flex-row">
									<select value={templateId} onChange={(e) => { setTemplateId(e.target.value); setFields([]) }} className={inputCls}>
										{sorted.map((t) => (
											<option key={t.id} value={t.id}>
												{t.insurerName} — {t.title} ({claimLabel(t.claimType)}, {t.fieldCount} campos)
											</option>
										))}
									</select>
									<button
										type="button"
										disabled={pending || !templateId}
										onClick={() =>
											call(() => proposeFormAction(claim.id, templateId), "Valores propostos. Reveja antes de gerar.", (d) => {
												if (!d) return
												const map = Object.fromEntries(d.campos.map((c) => [c.nome, c.valor]))
												setFields(d.fields)
												setValues(map)
												setAiValues(map)
												setNotes(d.notas)
											})
										}
										className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
										<Wand2 className="h-4 w-4" /> Preencher com IA
									</button>
								</div>

								{fields.length > 0 && (
									<>
										{notes.length > 0 && (
											<div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
												<List title="A confirmar" items={notes} />
											</div>
										)}
										<div className="max-h-[480px] overflow-y-auto rounded-2xl border border-line" data-lenis-prevent>
											<table className="w-full text-sm">
												<tbody className="divide-y divide-line">
													{fields.map((f) => (
														<tr key={f.name}>
															<td className="w-2/5 px-3 py-2 align-top text-xs text-muted">{f.name}</td>
															<td className="px-3 py-2">
																{f.options?.length ? (
																	<select value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={inputCls}>
																		<option value="">—</option>
																		{f.options.map((o) => (
																			<option key={o}>{o}</option>
																		))}
																	</select>
																) : f.type === "caixa" ? (
																	<select value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={inputCls}>
																		<option value="">—</option>
																		<option value="sim">Sim (marcar)</option>
																		<option value="não">Não</option>
																	</select>
																) : (
																	<input value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} className={inputCls} />
																)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										<button
											type="button"
											disabled={pending}
											onClick={() => {
												const corrected = JSON.stringify(values) !== JSON.stringify(aiValues)
												call(() => generateFormAction(claim.id, templateId, values, corrected), corrected ? "PDF gerado. Correções guardadas para a IA aprender." : "PDF gerado.", () => setFields([]))
											}}
											className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
											<FileText className="h-4 w-4" /> Gerar PDF preenchido
										</button>
									</>
								)}
							</>
						)}

						{claim.filledForms.length > 0 && (
							<ul className="grid gap-2">
								{claim.filledForms.map((f, i) => (
									<li key={i}>
										<a href={f.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 text-sm hover:border-royal">
											<span className="flex items-center gap-2">
												<FileText className="h-4 w-4 text-royal" /> {f.title}
											</span>
											<span className="flex items-center gap-2 text-xs text-muted">
												{fmtDate(f.createdAt)} <Download className="h-4 w-4" />
											</span>
										</a>
									</li>
								))}
							</ul>
						)}
					</Card>

					<Card title="Mensagem ao cliente" description={`Enviada por email para ${claim.email}.`}>
						<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto" className={inputCls} />
						<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} placeholder="Analise o sinistro para preencher automaticamente, ou escreva a mensagem." className={`${inputCls} leading-relaxed`} />
						<button
							type="button"
							disabled={pending || !subject.trim() || !body.trim()}
							onClick={() => {
								if (confirm(`Enviar esta mensagem para ${claim.email}?`)) call(() => messageClaimClientAction(claim.id, subject, body), "Mensagem enviada.")
							}}
							className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
							<Send className="h-4 w-4" /> Enviar ao cliente
						</button>
					</Card>
				</div>
			</div>
		</div>
	)
}

function Row({ k, v }: { k: string; v: string }) {
	return (
		<div className="grid gap-0.5 sm:grid-cols-[130px_1fr] sm:gap-3">
			<dt className="text-muted">{k}</dt>
			<dd className="break-words text-ink">{v}</dd>
		</div>
	)
}

function List({ title, items }: { title: string; items: string[] }) {
	return (
		<div>
			<p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
			<ul className="mt-1 grid gap-1">
				{items.map((x, i) => (
					<li key={i}>• {x}</li>
				))}
			</ul>
		</div>
	)
}
