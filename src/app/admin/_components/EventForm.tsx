"use client"

import { ArrowLeft, ExternalLink, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "react-toastify"
import { saveEventAction } from "../actions"
import type { EventRecord } from "@/types/event"
import {
	Card,
	ColorInput,
	ImageField,
	ImageListField,
	Repeater,
	TextArea,
	TextInput,
	Toggle,
	inputCls,
	Field,
} from "./fields"

const TABS = [
	{ id: "geral", label: "Geral" },
	{ id: "aparencia", label: "Aparência" },
	{ id: "conteudo", label: "Conteúdo" },
	{ id: "galeria", label: "Galeria" },
	{ id: "oradores", label: "Oradores" },
	{ id: "marcas", label: "Parceiros" },
	{ id: "bilhetes", label: "Bilhetes" },
	{ id: "local", label: "Local" },
	{ id: "faq", label: "FAQ" },
] as const
type TabId = (typeof TABS)[number]["id"]

const CATEGORIES = ["Fórum", "Mesa Redonda", "Business After Work", "Seminário", "Conferência", "Feira", "Responsabilidade Social", "Workshop"]

export default function EventForm({ initial, readOnly = false }: { initial: EventRecord; readOnly?: boolean }) {
	const router = useRouter()
	const [e, setE] = useState<EventRecord>(initial)
	const [saved, setSaved] = useState(JSON.stringify(initial))
	const [tab, setTab] = useState<TabId>("geral")
	const [pending, start] = useTransition()
	const dirty = useMemo(() => JSON.stringify(e) !== saved, [e, saved])

	useEffect(() => {
		const warn = (ev: BeforeUnloadEvent) => {
			if (dirty) ev.preventDefault()
		}
		window.addEventListener("beforeunload", warn)
		return () => window.removeEventListener("beforeunload", warn)
	}, [dirty])

	const set = <K extends keyof EventRecord>(key: K, value: EventRecord[K]) => setE((p) => ({ ...p, [key]: value }))
	const patch = <K extends keyof EventRecord>(key: K, value: Partial<EventRecord[K]>) =>
		setE((p) => ({ ...p, [key]: { ...(p[key] as object), ...value } }))

	const save = (status?: EventRecord["status"]) =>
		start(async () => {
			const payload = status ? { ...e, status } : e
			const res = await saveEventAction(payload)
			if (!res.ok) {
				toast.error(res.error)
				return
			}
			const next = { ...payload, id: res.data!.id, slug: res.data!.slug }
			setE(next)
			setSaved(JSON.stringify(next))
			toast.success(status === "published" ? "Evento publicado!" : "Alterações guardadas.")
			if (!initial.id) router.replace(`/admin/events/${res.data!.id}`)
			else router.refresh()
		})

	return (
		<div className="pb-24">
			{/* Barra superior */}
			<div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-line bg-background/90 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<Link href="/admin/events" aria-label="Voltar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white hover:border-royal">
							<ArrowLeft className="h-4 w-4" />
						</Link>
						<div className="min-w-0">
							<h1 className="truncate text-lg font-semibold text-ink">{e.title || "Novo evento"}</h1>
							<p className="flex items-center gap-2 text-xs text-muted">
								<span className={`inline-block h-2 w-2 rounded-full ${e.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
								{e.status === "published" ? "Publicado" : "Rascunho"}
								{dirty && <span className="text-amber-600">· alterações por guardar</span>}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{e.id && (
							<a href={`/events/${e.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium hover:border-royal">
								<ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Ver no site</span>
							</a>
						)}
						{e.status === "draft" && (
							<button type="button" disabled={pending || readOnly} onClick={() => save("published")} className="rounded-xl border border-royal px-3 py-2 text-sm font-semibold text-royal hover:bg-royal hover:text-white disabled:opacity-50">
								Publicar
							</button>
						)}
						<button type="button" disabled={pending || readOnly} onClick={() => save()} className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-royal disabled:opacity-50">
							{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar
						</button>
					</div>
				</div>
				<nav className="no-scrollbar -mb-3 mt-3 flex gap-1 overflow-x-auto" aria-label="Secções do evento">
					{TABS.map((t) => (
						<button
							key={t.id}
							type="button"
							onClick={() => setTab(t.id)}
							className={`shrink-0 border-b-2 px-3 pb-2.5 text-sm font-medium transition ${
								tab === t.id ? "border-royal text-ink" : "border-transparent text-muted hover:text-ink"
							}`}>
							{t.label}
						</button>
					))}
				</nav>
			</div>

			{readOnly && (
				<p className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
					Base de dados não configurada: pode ver os dados, mas não guardar alterações.
				</p>
			)}

			<div className="grid gap-6">
				{tab === "geral" && (
					<>
						<Card title="Informação principal">
							<TextInput label="Título *" value={e.title} onChange={(v) => set("title", v)} placeholder="ex.: Mesa Redonda com CEO's — 6ª Edição" />
							<div className="grid gap-5 sm:grid-cols-3">
								<TextInput label="Data *" type="date" value={e.startDate} onChange={(v) => set("startDate", v)} />
								<TextInput label="Hora" type="time" value={e.startTime} onChange={(v) => set("startTime", v)} hint="Usada na contagem decrescente." />
								<Field label="Categoria">
									<input list="categories" value={e.category} onChange={(ev) => set("category", ev.target.value)} className={inputCls} />
									<datalist id="categories">
										{CATEGORIES.map((c) => (
											<option key={c} value={c} />
										))}
									</datalist>
								</Field>
							</div>
							<TextInput label="Local" value={e.location} onChange={(v) => set("location", v)} placeholder="ex.: Centro de Convenções de Talatona" />
							<TextArea label="Descrição curta" hint="Aparece nos cartões, na pesquisa e no Google." rows={4} value={e.description} onChange={(v) => set("description", v)} />
							<div className="grid gap-5 sm:grid-cols-2">
								<TextInput label="Endereço (slug)" value={e.slug} onChange={(v) => set("slug", v)} hint={`globalsc.ao/events/${e.slug || "gerado-a-partir-do-título"}`} />
								<TextInput label="Site externo do evento" type="url" value={e.externalUrl} onChange={(v) => set("externalUrl", v)} placeholder="https://…" hint="Mostra o botão “Site oficial do evento”." />
							</div>
						</Card>
						<Card title="Visibilidade">
							<Toggle label="Publicado" hint="Rascunhos não aparecem no site." checked={e.status === "published"} onChange={(v) => set("status", v ? "published" : "draft")} />
							<Toggle label="Em destaque" hint="Marca o evento como prioritário nas listagens." checked={e.featured} onChange={(v) => set("featured", v)} />
						</Card>
					</>
				)}

				{tab === "aparencia" && (
					<Card title="Imagens e cores" description="As cores do tema são usadas nos gradientes e destaques da página do evento.">
						<div className="grid gap-5 sm:grid-cols-2">
							<ImageField label="Imagem de capa (cartões)" value={e.coverUrl} onChange={(v) => set("coverUrl", v)} />
							<ImageField label="Imagem de fundo do topo" value={e.theme.imgUrl} onChange={(v) => patch("theme", { imgUrl: v })} />
						</div>
						<div className="grid gap-5 sm:grid-cols-2">
							<ColorInput label="Cor primária" value={e.theme.primary} onChange={(v) => patch("theme", { primary: v })} />
							<ColorInput label="Cor secundária" value={e.theme.secondary} onChange={(v) => patch("theme", { secondary: v })} />
						</div>
						<div className="h-24 rounded-2xl" style={{ background: `linear-gradient(110deg, ${e.theme.primary}, ${e.theme.secondary})` }} aria-label="Pré-visualização do gradiente" />
					</Card>
				)}

				{tab === "conteudo" && (
					<>
						<Card title="Sobre o evento">
							<TextArea label="Texto completo" hint="A primeira frase aparece em grande destaque." rows={8} value={e.about.description} onChange={(v) => patch("about", { description: v })} />
							<div className="grid gap-5 sm:grid-cols-2">
								<ImageField label="Imagem" value={e.about.imgUrl} onChange={(v) => patch("about", { imgUrl: v })} />
								<ImageField label="Vídeo (MP4 ou link YouTube)" accept="video/*" value={e.about.videoUrl} onChange={(v) => patch("about", { videoUrl: v })} hint="Se definido, substitui a imagem." />
							</div>
						</Card>
						<Card title="Porque participar" description="Mostrado apenas antes do evento.">
							<Toggle label="Mostrar secção" checked={e.whySign.enabled} onChange={(v) => patch("whySign", { enabled: v })} />
							<TextInput label="Título" value={e.whySign.title} onChange={(v) => patch("whySign", { title: v })} />
							<TextArea label="Subtítulo" rows={2} value={e.whySign.subtitle} onChange={(v) => patch("whySign", { subtitle: v })} />
							<Repeater
								label="Motivos"
								items={e.whySign.debates}
								onChange={(v) => patch("whySign", { debates: v })}
								create={() => ({ title: "", subtitle: "", imgUrl: "" })}
								itemTitle={(d) => d.title}
								render={(d, up) => (
									<>
										<TextInput label="Título" value={d.title} onChange={(v) => up({ title: v })} />
										<TextArea label="Texto" rows={2} value={d.subtitle} onChange={(v) => up({ subtitle: v })} />
										<ImageField label="Imagem" value={d.imgUrl} onChange={(v) => up({ imgUrl: v })} aspect="aspect-[16/7]" />
									</>
								)}
							/>
						</Card>
					</>
				)}

				{tab === "galeria" && (
					<Card title="Principais momentos" description="Mostrada depois do evento. Arraste ficheiros para a área ou carregue vários de uma vez (imagens e MP4).">
						<ImageListField label="Galeria" value={e.gallery} onChange={(v) => set("gallery", v)} />
					</Card>
				)}

				{tab === "oradores" && (
					<Card title="Oradores">
						<TextInput label="Título da secção" value={e.speakers.title} onChange={(v) => patch("speakers", { title: v })} />
						<TextArea label="Subtítulo" rows={2} value={e.speakers.subtitle} onChange={(v) => patch("speakers", { subtitle: v })} />
						<Repeater
							label="Lista de oradores"
							addLabel="Adicionar orador"
							items={e.speakers.speakers}
							onChange={(v) => patch("speakers", { speakers: v })}
							create={() => ({ fullname: "", jobTitle: "", imgUrl: "" })}
							itemTitle={(s) => s.fullname}
							render={(s, up) => (
								<div className="grid gap-4 sm:grid-cols-[180px_1fr]">
									<ImageField label="Foto" value={s.imgUrl} onChange={(v) => up({ imgUrl: v })} aspect="aspect-[3/4]" />
									<div className="grid content-start gap-4">
										<TextInput label="Nome completo" value={s.fullname} onChange={(v) => up({ fullname: v })} />
										<TextInput label="Cargo / Empresa" value={s.jobTitle} onChange={(v) => up({ jobTitle: v })} />
									</div>
								</div>
							)}
						/>
					</Card>
				)}

				{tab === "marcas" && (
					<>
						{(["partners", "sponsors"] as const).map((k) => (
							<Card key={k} title={k === "partners" ? "Parceiros" : "Patrocinadores"}>
								<TextInput label="Título" value={e[k].title} onChange={(v) => patch(k, { title: v })} />
								<TextArea label="Subtítulo" rows={2} value={e[k].subtitle} onChange={(v) => patch(k, { subtitle: v })} />
								<ImageListField label="Logótipos" accept="image/*" tileClass="aspect-[2/1]" contain value={e[k].logos} onChange={(v) => patch(k, { logos: v })} hint="Use PNG/SVG com fundo transparente." />
							</Card>
						))}
					</>
				)}

				{tab === "bilhetes" && (
					<Card title="Venda de bilhetes">
						<Toggle label="Venda de bilhetes ativa" hint="Mostra a secção de bilhetes e o botão “Garantir o meu lugar”." checked={e.ticketsEnabled} onChange={(v) => set("ticketsEnabled", v)} />
						<Repeater
							label="Tipos de bilhete"
							addLabel="Adicionar bilhete"
							items={e.tickets}
							onChange={(v) => set("tickets", v)}
							create={() => ({ id: "", ticketName: "", price: 0, benefits: [] })}
							itemTitle={(t) => (t.ticketName ? `${t.ticketName} — ${t.price} AOA` : "")}
							render={(t, up) => (
								<>
									<div className="grid gap-4 sm:grid-cols-2">
										<TextInput label="Nome" value={t.ticketName} onChange={(v) => up({ ticketName: v })} />
										<TextInput label="Preço (AOA)" type="number" min={0} value={t.price} onChange={(v) => up({ price: Number(v) })} />
									</div>
									<TextArea label="Benefícios" hint="Um por linha." rows={4} value={t.benefits.join("\n")} onChange={(v) => up({ benefits: v.split("\n").map((s) => s.trim()).filter(Boolean) })} />
								</>
							)}
						/>
					</Card>
				)}

				{tab === "local" && (
					<Card title="Local do evento" description="Mostrado apenas antes do evento.">
						<div className="grid gap-5 sm:grid-cols-2">
							<TextInput label="Título" value={e.venue.title} onChange={(v) => patch("venue", { title: v })} />
							<TextInput label="Subtítulo" value={e.venue.subtitle} onChange={(v) => patch("venue", { subtitle: v })} />
						</div>
						<TextInput label="Morada" value={e.venue.address} onChange={(v) => patch("venue", { address: v })} />
						<div className="grid gap-5 sm:grid-cols-3">
							<TextInput label="Telefone" value={e.venue.phone} onChange={(v) => patch("venue", { phone: v })} />
							<TextInput label="Email" type="email" value={e.venue.email} onChange={(v) => patch("venue", { email: v })} />
							<TextInput label="Link do mapa" type="url" value={e.venue.mapUrl} onChange={(v) => patch("venue", { mapUrl: v })} hint="Opcional. Por defeito usa o Google Maps com a morada." />
						</div>
						<ImageListField label="Fotografias do espaço" accept="image/*" value={e.venue.images} onChange={(v) => patch("venue", { images: v })} hint="São mostradas as duas primeiras." />
					</Card>
				)}

				{tab === "faq" && (
					<Card title="Perguntas frequentes" description="Mostradas apenas antes do evento.">
						<Repeater
							label="Perguntas"
							addLabel="Adicionar pergunta"
							items={e.faqs.questions}
							onChange={(v) => patch("faqs", { questions: v })}
							create={() => ({ question: "", answer: "" })}
							itemTitle={(q) => q.question}
							render={(q, up) => (
								<>
									<TextInput label="Pergunta" value={q.question} onChange={(v) => up({ question: v })} />
									<TextArea label="Resposta" rows={3} value={q.answer} onChange={(v) => up({ answer: v })} />
								</>
							)}
						/>
					</Card>
				)}
			</div>
		</div>
	)
}
