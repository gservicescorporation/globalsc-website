"use client"

import { ArrowLeft, FileText, Pencil, Plus, Trash2, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CLAIM_TYPES, INSURANCE_TYPES, claimLabel, typeLabel } from "@/content/insurance-catalog"
import type { ClaimTemplateRow, InsurerDocumentRow, InsurerRow } from "@/entities/mediation"
import {
	deleteDocumentAction,
	deleteInsurerAction,
	deleteTemplateAction,
	saveDocumentAction,
	saveInsurerAction,
	saveTemplateAction,
} from "../mediation-actions"
import { Card, Field, ImageField, TextArea, TextInput, Toggle, inputCls } from "./fields"
import { Empty, useAction } from "./ui"

type Doc = Partial<InsurerDocumentRow> & { insurerId: string; insuranceType: string; title: string }
type Tpl = Partial<ClaimTemplateRow> & { insurerId: string; claimType: string; title: string; pdfUrl: string }

export default function InsurerDetail({
	data,
}: {
	data: { insurer: InsurerRow; documents: InsurerDocumentRow[]; templates: ClaimTemplateRow[] }
}) {
	const router = useRouter()
	const { pending, call } = useAction()
	const [ins, setIns] = useState({ ...data.insurer, logoUrl: data.insurer.logoUrl ?? "", email: data.insurer.email ?? "", phone: data.insurer.phone ?? "" })
	const [doc, setDoc] = useState<Doc | null>(null)
	const [tpl, setTpl] = useState<Tpl | null>(null)
	const id = data.insurer.id

	const byType = INSURANCE_TYPES.map((t) => ({ type: t, docs: data.documents.filter((d) => d.insuranceType === t.id) })).filter((g) => g.docs.length)

	return (
		<div className="grid gap-6 pb-16">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link href="/admin/seguradoras" aria-label="Voltar" className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white hover:border-royal">
						<ArrowLeft className="h-4 w-4" />
					</Link>
					<h1 className="text-xl font-semibold text-ink">{data.insurer.name}</h1>
				</div>
				<button
					type="button"
					onClick={() => confirm(`Eliminar ${data.insurer.name} com documentos e modelos?`) && call(() => deleteInsurerAction(id), "Seguradora eliminada.", () => router.push("/admin/seguradoras"))}
					className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50">
					<Trash2 className="h-4 w-4" /> Eliminar
				</button>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				<div className="grid content-start gap-6 lg:col-span-4">
					<Card title="Dados">
						<TextInput label="Nome" value={ins.name} onChange={(v) => setIns({ ...ins, name: v })} />
						<ImageField label="Logótipo" value={ins.logoUrl} onChange={(v) => setIns({ ...ins, logoUrl: v })} aspect="aspect-[2/1]" />
						<TextInput label="Email de sinistros" type="email" value={ins.email} onChange={(v) => setIns({ ...ins, email: v })} />
						<TextInput label="Telefone" value={ins.phone} onChange={(v) => setIns({ ...ins, phone: v })} />
						<TextArea label="Notas para a IA" rows={4} value={ins.notes} onChange={(v) => setIns({ ...ins, notes: v })} hint="Ex.: prazos de resposta, pontos fortes, condições negociadas." />
						<Toggle label="Ativa" hint="Seguradoras inativas não entram nas recomendações." checked={ins.active} onChange={(v) => setIns({ ...ins, active: v })} />
						<button
							disabled={pending}
							onClick={() => call(() => saveInsurerAction({ ...ins, logoUrl: ins.logoUrl || null, email: ins.email || null, phone: ins.phone || null }), "Seguradora guardada.")}
							className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
							Guardar
						</button>
					</Card>
				</div>

				<div className="grid content-start gap-6 lg:col-span-8">
					<Card
						title="Documentos por ramo"
						description="Condições gerais e particulares, tabelas de prémios, propostas-tipo. A IA lê os PDFs e as suas notas para recomendar o melhor seguro.">
						<button
							onClick={() => setDoc({ insurerId: id, insuranceType: INSURANCE_TYPES[0].id, title: "", fileUrl: "", summary: "" })}
							className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal">
							<Plus className="h-4 w-4" /> Adicionar documento
						</button>
						{byType.length === 0 && <Empty>Sem documentos.</Empty>}
						{byType.map(({ type, docs }) => (
							<div key={type.id}>
								<p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">{type.label}</p>
								<ul className="grid gap-2">
									{docs.map((d) => (
										<li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 text-sm">
											<span className="flex min-w-0 items-center gap-2">
												<FileText className="h-4 w-4 shrink-0 text-royal" />
												<span className="truncate">{d.title}</span>
												{!d.fileUrl && <span className="rounded-full bg-background px-2 text-xs text-muted">só notas</span>}
											</span>
											<span className="flex shrink-0 gap-1">
												<button aria-label="Editar" onClick={() => setDoc({ ...d })} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background">
													<Pencil className="h-4 w-4" />
												</button>
												<button aria-label="Eliminar" onClick={() => confirm("Eliminar documento?") && call(() => deleteDocumentAction(d.id, id), "Documento eliminado.")} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
													<Trash2 className="h-4 w-4" />
												</button>
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</Card>

					<Card
						title="Modelos de participação de sinistro"
						description="O PDF editável que a seguradora pede para cada tipo de sinistro. Os campos são lidos automaticamente; as instruções e as correções dos gestores ensinam a IA a preenchê-lo.">
						<button
							onClick={() => setTpl({ insurerId: id, claimType: CLAIM_TYPES[0].id, title: "", pdfUrl: "", instructions: "" })}
							className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal">
							<Plus className="h-4 w-4" /> Adicionar modelo
						</button>
						{data.templates.length === 0 && <Empty>Sem modelos.</Empty>}
						<ul className="grid gap-2">
							{data.templates.map((t) => (
								<li key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 text-sm">
									<span className="min-w-0">
										<span className="block truncate font-medium">{t.title}</span>
										<span className="text-xs text-muted">
											{claimLabel(t.claimType)} · {t.fields.length} campos · {t.examples.length} exemplo(s) aprendido(s)
										</span>
										{t.fields.length === 0 && <span className="block text-xs text-amber-700">PDF sem campos preenchíveis — peça a versão editável.</span>}
									</span>
									<span className="flex shrink-0 gap-1">
										<a href={t.pdfUrl} target="_blank" rel="noreferrer" aria-label="Abrir PDF" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background">
											<FileText className="h-4 w-4" />
										</a>
										<button aria-label="Editar" onClick={() => setTpl({ ...t })} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background">
											<Pencil className="h-4 w-4" />
										</button>
										<button aria-label="Eliminar" onClick={() => confirm("Eliminar modelo?") && call(() => deleteTemplateAction(t.id, id), "Modelo eliminado.")} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
											<Trash2 className="h-4 w-4" />
										</button>
									</span>
								</li>
							))}
						</ul>
					</Card>
				</div>
			</div>

			{doc && (
				<Drawer title={doc.id ? "Editar documento" : "Novo documento"} onClose={() => setDoc(null)} onSave={() => call(() => saveDocumentAction(doc), "Documento guardado.", () => setDoc(null))} pending={pending}>
					<Field label="Ramo">
						<select value={doc.insuranceType} onChange={(e) => setDoc({ ...doc, insuranceType: e.target.value })} className={inputCls}>
							{INSURANCE_TYPES.map((t) => (
								<option key={t.id} value={t.id}>
									{t.label}
								</option>
							))}
						</select>
					</Field>
					<TextInput label="Título" value={doc.title} onChange={(v) => setDoc({ ...doc, title: v })} placeholder="ex.: Condições gerais — Saúde Empresas 2026" />
					<ImageField label="PDF" accept="application/pdf" aspect="aspect-[3/2]" value={doc.fileUrl ?? ""} onChange={(v) => setDoc({ ...doc, fileUrl: v || null })} />
					<TextArea
						label="Notas / resumo"
						rows={8}
						value={doc.summary}
						onChange={(v) => setDoc({ ...doc, summary: v })}
						hint={`O que a IA deve saber sobre este documento para ${typeLabel(doc.insuranceType).toLowerCase()}: prémios, coberturas, limites, condições comerciais.`}
					/>
				</Drawer>
			)}

			{tpl && (
				<Drawer
					title={tpl.id ? "Editar modelo" : "Novo modelo de participação"}
					onClose={() => setTpl(null)}
					onSave={() =>
						call(() => saveTemplateAction(tpl), "Modelo guardado.", (d) => {
							setTpl(null)
							if (d && d.fieldCount === 0) alert("Atenção: este PDF não tem campos preenchíveis. A IA não o conseguirá preencher.")
						})
					}
					pending={pending}>
					<Field label="Tipo de sinistro">
						<select value={tpl.claimType} onChange={(e) => setTpl({ ...tpl, claimType: e.target.value })} className={inputCls}>
							{CLAIM_TYPES.map((t) => (
								<option key={t.id} value={t.id}>
									{t.label}
								</option>
							))}
						</select>
					</Field>
					<TextInput label="Título" value={tpl.title} onChange={(v) => setTpl({ ...tpl, title: v })} placeholder="ex.: Participação de acidente automóvel" />
					<ImageField label="PDF editável" accept="application/pdf" aspect="aspect-[3/2]" value={tpl.pdfUrl} onChange={(v) => setTpl({ ...tpl, pdfUrl: v })} />
					<TextArea
						label="Instruções para a IA"
						rows={8}
						value={tpl.instructions}
						onChange={(v) => setTpl({ ...tpl, instructions: v })}
						hint='Ex.: "O campo Tomador é sempre a empresa; datas em DD/MM/AAAA; na descrição use no máximo 300 caracteres."'
					/>
					{(tpl.examples?.length ?? 0) > 0 && <p className="text-sm text-tertiary">{tpl.examples!.length} exemplo(s) corrigido(s) por gestores já guardado(s).</p>}
				</Drawer>
			)}
		</div>
	)
}

function Drawer({
	title,
	children,
	onClose,
	onSave,
	pending,
}: {
	title: string
	children: React.ReactNode
	onClose: () => void
	onSave: () => void
	pending: boolean
}) {
	return (
		<div className="fixed inset-0 z-50 flex justify-end">
			<button aria-label="Fechar" className="absolute inset-0 bg-ink/50" onClick={onClose} />
			<div className="relative flex h-full w-full max-w-xl flex-col bg-background shadow-2xl">
				<div className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
					<h2 className="font-semibold text-ink">{title}</h2>
					<button onClick={onClose} aria-label="Fechar"><X className="h-5 w-5" /></button>
				</div>
				<div className="grid flex-1 content-start gap-4 overflow-y-auto p-6" data-lenis-prevent>
					{children}
				</div>
				<div className="flex justify-end gap-2 border-t border-line bg-white px-6 py-4">
					<button onClick={onClose} className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium">Cancelar</button>
					<button disabled={pending} onClick={onSave} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
						Guardar
					</button>
				</div>
			</div>
		</div>
	)
}
