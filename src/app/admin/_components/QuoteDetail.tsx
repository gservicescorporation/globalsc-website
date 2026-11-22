"use client"

import { ArrowLeft, ExternalLink, FileText, Loader2, Mail, Send, Sparkles, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { INSURANCE_TYPES, QUOTE_STATUS, typeLabel } from "@/content/insurance-catalog"
import type { QuoteRequestRow } from "@/entities/mediation"
import type { Recommendation } from "@/server/ai"
import type { ClientProfile } from "@/server/mediation"
import {
	convertAction,
	noteQuoteAction,
	recommendQuoteAction,
	sendProposalAction,
	setQuoteStatusAction,
} from "../mediation-actions"
import { Card, inputCls } from "./fields"
import { Activity, StatusBadge, fmtDate, useAction } from "./ui"

export default function QuoteDetail({
	quote,
	profile,
	docs,
}: {
	quote: QuoteRequestRow
	profile: ClientProfile | null
	docs: { id: string; title: string; insurerName: string; hasFile: boolean }[]
}) {
	const { pending, call } = useAction()
	const ai = quote.ai as Recommendation | null
	const type = INSURANCE_TYPES.find((t) => t.id === quote.insuranceType)
	const [subject, setSubject] = useState(quote.proposal?.subject ?? ai?.proposta.assunto ?? "")
	const [body, setBody] = useState(quote.proposal?.body ?? ai?.proposta.corpo ?? "")
	const [note, setNote] = useState("")

	const generate = () => {
		call(() => recommendQuoteAction(quote.id), "Recomendação gerada.", (data) => {
			if (data) {
				setSubject(data.proposta.assunto)
				setBody(data.proposta.corpo)
			}
		})
	}

	return (
		<div className="grid gap-6 pb-16">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link href="/admin/pedidos" aria-label="Voltar" className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white hover:border-royal">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<div>
						<h1 className="text-xl font-semibold text-ink">
							{typeLabel(quote.insuranceType)} · <span className="font-mono text-royal">{quote.ref}</span>
						</h1>
						<p className="text-xs text-muted">Recebido a {fmtDate(quote.createdAt)}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<StatusBadge kind="quote" status={quote.status} />
					<select
						aria-label="Alterar estado"
						value={quote.status}
						disabled={pending}
						onChange={(e) => call(() => setQuoteStatusAction(quote.id, e.target.value), "Estado atualizado.")}
						className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
						{Object.entries(QUOTE_STATUS).map(([k, v]) => (
							<option key={k} value={k}>
								{v.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Coluna esquerda: pedido e cliente */}
				<div className="grid content-start gap-6 lg:col-span-5">
					<Card title="Pedido">
						<dl className="grid gap-3 text-sm">
							<Row k="Para" v={quote.audience === "empresa" ? "Empresa" : "Particular"} />
							{type?.fields.map((f) => <Row key={f.key} k={f.label} v={quote.answers[f.key] || "—"} />)}
							{quote.message && <Row k="Mensagem" v={quote.message} />}
						</dl>
					</Card>

					{quote.declared && (
						<Card title="Seguro atual (declarado)" description="O cliente indicou que já tem este seguro.">
							<dl className="grid gap-3 text-sm">
								<Row k="Seguradora" v={quote.declared.insurer || "—"} />
								<Row k="Apólice" v={quote.declared.policyNumber || "—"} />
								<Row k="Termina em" v={quote.declared.endDate || "—"} />
							</dl>
							{quote.declared.documentUrl && (
								<a href={quote.declared.documentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-royal hover:underline">
									<FileText className="h-4 w-4" /> Ver documento da apólice
								</a>
							)}
						</Card>
					)}

					<Card title="Cliente">
						{profile ? (
							<div className="grid gap-2 text-sm">
								<p className="font-semibold text-ink">{profile.client.name}</p>
								<p className="text-tertiary">
									{profile.client.email} · {profile.client.phone || "sem telefone"}
								</p>
								{profile.company && <p className="text-tertiary">Colaborador de {profile.company.name}</p>}
								<p className="text-tertiary">{profile.policies.length} apólice(s) registada(s)</p>
								<Link href={`/admin/clientes/${profile.client.id}`} className="mt-2 flex items-center gap-1 font-medium text-royal hover:underline">
									Abrir ficha do cliente <ExternalLink className="h-3.5 w-3.5" />
								</Link>
							</div>
						) : (
							<div className="grid gap-3 text-sm">
								<dl className="grid gap-2">
									{quote.company && <Row k="Empresa" v={`${quote.company}${quote.nif ? ` (NIF ${quote.nif})` : ""}`} />}
									<Row k="Nome" v={quote.name || "—"} />
									<Row k="Email" v={quote.email} />
									<Row k="Telefone" v={quote.phone || "—"} />
								</dl>
								<p className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">Ainda não está na base de clientes.</p>
								<button
									type="button"
									disabled={pending}
									onClick={() => call(() => convertAction("quote", quote.id), "Cliente criado e associado.")}
									className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-semibold text-white hover:bg-royal disabled:opacity-50">
									<UserPlus className="h-4 w-4" /> Criar cliente{quote.declared ? " e registar apólice" : ""}
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
								onClick={() => call(() => noteQuoteAction(quote.id, note), "Nota guardada.", () => setNote(""))}
								className="shrink-0 rounded-xl bg-ink px-3 text-sm font-semibold text-white disabled:opacity-40">
								Guardar
							</button>
						</div>
						<Activity items={quote.activity} />
					</Card>
				</div>

				{/* Coluna direita: IA e proposta */}
				<div className="grid content-start gap-6 lg:col-span-7">
					<section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 sm:p-7">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<h2 className="flex items-center gap-2 font-semibold text-ink">
									<Sparkles className="h-5 w-5 text-violet-600" /> Melhor seguro para este pedido
								</h2>
								<p className="mt-1 text-sm text-tertiary">
									A IA compara {docs.length} documento(s) de seguradoras para {typeLabel(quote.insuranceType).toLowerCase()}.
								</p>
							</div>
							<button
								type="button"
								onClick={generate}
								disabled={pending}
								className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
								{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
								{ai ? "Gerar de novo" : "Gerar recomendação"}
							</button>
						</div>

						{docs.length === 0 && (
							<p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
								Não há documentos de seguradoras para este ramo. Adicione-os em{" "}
								<Link href="/admin/seguradoras" className="font-semibold underline">
									Seguradoras
								</Link>{" "}
								para recomendações fundamentadas.
							</p>
						)}

						{ai && (
							<div className="mt-6 grid gap-4">
								<p className="text-sm text-ink">{ai.resumoPedido}</p>
								{ai.recomendacoes.map((r, i) => (
									<article key={i} className={`rounded-2xl bg-white p-5 ring-1 ${i === 0 ? "ring-violet-300" : "ring-line"}`}>
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div>
												{i === 0 && <span className="mb-1 inline-block rounded-full bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">Recomendada</span>}
												<h3 className="font-semibold text-ink">
													{r.seguradora} — {r.produto}
												</h3>
											</div>
											<span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-ink">{Math.round(r.adequacao)}% adequada</span>
										</div>
										<p className="mt-3 text-sm text-tertiary">{r.porque}</p>
										<p className="mt-3 text-sm">
											<span className="font-semibold text-ink">Prémio: </span>
											<span className="text-tertiary">{r.premioEstimado}</span>
										</p>
										{r.coberturasPrincipais.length > 0 && <List title="Coberturas" items={r.coberturasPrincipais} />}
										{r.franquiasExclusoes.length > 0 && <List title="Franquias e exclusões" items={r.franquiasExclusoes} />}
										{r.documentosBase.length > 0 && <p className="mt-3 text-xs text-muted">Fontes: {r.documentosBase.join("; ")}</p>}
									</article>
								))}
								{ai.informacaoEmFalta.length > 0 && (
									<div className="rounded-2xl bg-amber-50 p-4">
										<List title="Informação em falta" items={ai.informacaoEmFalta} />
									</div>
								)}
								<p className="text-xs text-muted">A IA pode errar. Confirme os valores nos documentos antes de enviar.</p>
							</div>
						)}
					</section>

					<Card title="Proposta para o cliente" description={`Enviada por email para ${quote.email}.`}>
						{quote.proposal?.sentAt && (
							<p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Última proposta enviada a {fmtDate(quote.proposal.sentAt)}.</p>
						)}
						<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto" className={inputCls} />
						<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} placeholder="Gere a recomendação para preencher automaticamente, ou escreva a proposta." className={`${inputCls} leading-relaxed`} />
						<button
							type="button"
							disabled={pending || !subject.trim() || !body.trim()}
							onClick={() => {
								if (confirm(`Enviar esta proposta para ${quote.email}?`))
									call(() => sendProposalAction(quote.id, subject, body), "Proposta enviada ao cliente.")
							}}
							className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
							{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar proposta
						</button>
						<a href={`mailto:${quote.email}`} className="flex items-center justify-center gap-2 text-sm text-tertiary hover:text-ink">
							<Mail className="h-4 w-4" /> Ou escrever do seu email
						</a>
					</Card>
				</div>
			</div>
		</div>
	)
}

function Row({ k, v }: { k: string; v: string }) {
	return (
		<div className="grid gap-0.5 sm:grid-cols-[160px_1fr] sm:gap-3">
			<dt className="text-muted">{k}</dt>
			<dd className="break-words text-ink">{v}</dd>
		</div>
	)
}

function List({ title, items }: { title: string; items: string[] }) {
	return (
		<div className="mt-3">
			<p className="text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
			<ul className="mt-1 grid gap-1 text-sm text-ink">
				{items.map((x, i) => (
					<li key={i}>• {x}</li>
				))}
			</ul>
		</div>
	)
}
