"use client"

import { ExternalLink, Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "react-toastify"
import { saveContentAction } from "../actions"
import { SERVICE_ICONS } from "@/content/site"
import type { SiteContent, Stat, TitledText } from "@/types/content"
import { Card, Field, ImageField, ImageListField, Repeater, TextArea, TextInput, Toggle, inputCls } from "./fields"

const TABS = [
	{ id: "inicio", label: "Início", page: "/" },
	{ id: "seguros", label: "Seguros", page: "/seguros" },
	{ id: "servicos", label: "Serviços", page: "/#servicos" },
	{ id: "sobre", label: "Sobre nós", page: "/sobre-nos" },
	{ id: "academia", label: "Academia", page: "/" },
	{ id: "eventos", label: "Página de eventos", page: "/events" },
	{ id: "parceiros", label: "Parceiros", page: "/" },
	{ id: "contactos", label: "Contactos e redes", page: "/contact-us" },
] as const
type TabId = (typeof TABS)[number]["id"]

const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean)

/** Repetidor de pares título + texto (usado em muitas secções). */
function TitledList({
	label,
	items,
	onChange,
	addLabel,
}: {
	label: string
	items: TitledText[]
	onChange: (v: TitledText[]) => void
	addLabel?: string
}) {
	return (
		<Repeater
			label={label}
			addLabel={addLabel}
			items={items}
			onChange={onChange}
			create={() => ({ title: "", text: "" })}
			itemTitle={(t) => t.title}
			render={(t, up) => (
				<>
					<TextInput label="Título" value={t.title} onChange={(v) => up({ title: v })} />
					<TextArea label="Texto" rows={2} value={t.text} onChange={(v) => up({ text: v })} />
				</>
			)}
		/>
	)
}

function StatsList({ items, onChange }: { items: Stat[]; onChange: (v: Stat[]) => void }) {
	return (
		<Repeater
			label="Números"
			addLabel="Adicionar número"
			items={items}
			onChange={onChange}
			create={() => ({ value: 0, suffix: "+", label: "" })}
			itemTitle={(s) => (s.label ? `${s.value}${s.suffix} ${s.label}` : "")}
			render={(s, up) => (
				<div className="grid gap-4 sm:grid-cols-[1fr_100px_2fr]">
					<TextInput label="Valor" type="number" value={s.value} onChange={(v) => up({ value: Number(v) })} />
					<TextInput label="Sufixo" value={s.suffix} onChange={(v) => up({ suffix: v })} placeholder="+ ou %" />
					<TextInput label="Legenda" value={s.label} onChange={(v) => up({ label: v })} />
				</div>
			)}
		/>
	)
}

export default function ContentEditor({ initial, readOnly }: { initial: SiteContent; readOnly: boolean }) {
	const router = useRouter()
	const [c, setC] = useState<SiteContent>(initial)
	const [saved, setSaved] = useState(JSON.stringify(initial))
	const [tab, setTab] = useState<TabId>("inicio")
	const [pending, start] = useTransition()
	const dirty = useMemo(() => JSON.stringify(c) !== saved, [c, saved])

	useEffect(() => {
		const warn = (e: BeforeUnloadEvent) => {
			if (dirty) e.preventDefault()
		}
		window.addEventListener("beforeunload", warn)
		return () => window.removeEventListener("beforeunload", warn)
	}, [dirty])

	const patch = <K extends keyof SiteContent>(key: K, value: Partial<SiteContent[K]>) =>
		setC((p) => ({ ...p, [key]: Array.isArray(p[key]) ? value : { ...(p[key] as object), ...value } }))

	const save = () =>
		start(async () => {
			const res = await saveContentAction(c)
			if (!res.ok) return void toast.error(res.error)
			setSaved(JSON.stringify(c))
			toast.success("Conteúdo publicado no site.")
			router.refresh()
		})

	const current = TABS.find((t) => t.id === tab)!

	return (
		<div className="pb-24">
			<div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-line bg-background/90 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 className="text-lg font-semibold text-ink sm:text-xl">Conteúdo do site</h1>
						<p className="text-xs text-muted">
							Textos, listas e imagens das páginas.{" "}
							{dirty ? <span className="text-amber-600">Alterações por guardar.</span> : "Tudo guardado."}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<a href={current.page} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium hover:border-royal">
							<ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">Ver página</span>
						</a>
						<button type="button" disabled={pending || readOnly || !dirty} onClick={save} className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
							{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Guardar e publicar
						</button>
					</div>
				</div>
				<nav className="no-scrollbar -mb-3 mt-3 flex gap-1 overflow-x-auto" aria-label="Secções">
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
					Base de dados não configurada: está a ver o conteúdo predefinido (apenas leitura).
				</p>
			)}
			<p className="mb-6 rounded-2xl bg-royal/5 px-4 py-3 text-sm text-tertiary">
				Dica: as secções sem itens são escondidas automaticamente no site — não ficam espaços em branco.
			</p>

			<div className="grid gap-6">
				{tab === "inicio" && (
					<Card title="Página inicial — “Quem somos”" description="Texto grande que acende ao fazer scroll e os números de impacto.">
						<TextArea label="Texto de apresentação" rows={5} value={c.home.manifesto} onChange={(v) => patch("home", { manifesto: v })} />
						<StatsList items={c.home.stats} onChange={(v) => patch("home", { stats: v })} />
					</Card>
				)}

				{tab === "seguros" && (
					<>
						<Card title="Mediação de seguros" description="Aparece logo a seguir ao topo da página inicial e na página /seguros.">
							<TextArea label="Texto de introdução" rows={4} value={c.insurance.intro} onChange={(v) => patch("insurance", { intro: v })} />
							<TextArea label="Vantagens" hint="Uma por linha." rows={5} value={c.insurance.benefits.join("\n")} onChange={(v) => patch("insurance", { benefits: lines(v) })} />
						</Card>
						<Card title="Ramos de seguro">
							<TitledList label="Ramos" addLabel="Adicionar ramo" items={c.insurance.lines} onChange={(v) => patch("insurance", { lines: v })} />
						</Card>
						<Card title="Como trabalhamos" description="Passos mostrados na página /seguros com a linha animada.">
							<TitledList label="Passos" addLabel="Adicionar passo" items={c.insurance.steps} onChange={(v) => patch("insurance", { steps: v })} />
						</Card>
						<Card
							title="Seguradoras parceiras"
							description="Diferentes dos parceiros gerais. Aparecem no destaque de seguros da página inicial e na faixa da página /seguros. Sem logótipos, ficam escondidas.">
							<TextInput
								label="Título"
								value={c.insurance.partners.title}
								onChange={(v) => patch("insurance", { partners: { ...c.insurance.partners, title: v } })}
							/>
							<ImageListField
								label="Logótipos"
								accept="image/*"
								tileClass="aspect-[2/1]"
								contain
								value={c.insurance.partners.logos}
								onChange={(v) => patch("insurance", { partners: { ...c.insurance.partners, logos: v } })}
							/>
						</Card>
					</>
				)}

				{tab === "servicos" && (
					<Card title="Áreas de atuação" description="Cartões do scroll horizontal na página inicial e lista em “Sobre nós”. A primeira deve ser sempre a mediação de seguros.">
						<Repeater
							label="Áreas"
							addLabel="Adicionar área"
							items={c.services}
							onChange={(v) => patch("services", v)}
							create={() => ({ id: crypto.randomUUID(), title: "", description: "", icon: SERVICE_ICONS[0], image: "", tags: [], href: "/contact-us" })}
							itemTitle={(s) => s.title}
							render={(s, up) => (
								<>
									<TextInput label="Título" value={s.title} onChange={(v) => up({ title: v })} />
									<TextArea label="Descrição" rows={3} value={s.description} onChange={(v) => up({ description: v })} />
									<div className="grid gap-4 sm:grid-cols-2">
										<ImageField label="Imagem" value={s.image} onChange={(v) => up({ image: v })} />
										<div className="grid content-start gap-4">
											<Field label="Ícone">
												<div className="flex gap-2">
													{SERVICE_ICONS.map((icon) => (
														<button
															key={icon}
															type="button"
															onClick={() => up({ icon })}
															aria-pressed={s.icon === icon}
															className={`flex h-12 w-12 items-center justify-center rounded-xl border ${s.icon === icon ? "border-royal bg-royal/10" : "border-line bg-white"}`}>
															{/* eslint-disable-next-line @next/next/no-img-element */}
															<img src={icon} alt="" className="h-7 w-7" />
														</button>
													))}
												</div>
											</Field>
											<TextInput label="Etiquetas" hint="Separadas por vírgula." value={s.tags.join(", ")} onChange={(v) => up({ tags: v.split(",").map((t) => t.trim()).filter(Boolean) })} />
											<TextInput label="Link" value={s.href} onChange={(v) => up({ href: v })} placeholder="/seguros ou https://…" />
										</div>
									</div>
								</>
							)}
						/>
					</Card>
				)}

				{tab === "sobre" && (
					<>
						<Card title="A nossa história" description="Página inicial e página Sobre nós.">
							<TextArea label="Texto" rows={6} value={c.about.story} onChange={(v) => patch("about", { story: v })} />
							<TitledList label="Diferenciais" addLabel="Adicionar diferencial" items={c.about.advantages} onChange={(v) => patch("about", { advantages: v })} />
						</Card>
						<Card title="Missão, visão e valores">
							<TitledList label="Blocos" items={c.about.values} onChange={(v) => patch("about", { values: v })} />
						</Card>
					</>
				)}

				{tab === "academia" && (
					<Card title="Secção da Academia" description="Na página inicial, com o botão para a plataforma da academia.">
						<Toggle label="Mostrar secção" checked={c.academy.enabled} onChange={(v) => patch("academy", { enabled: v })} />
						<TextArea label="Texto" rows={3} value={c.academy.text} onChange={(v) => patch("academy", { text: v })} />
						<TextInput label="Link da academia" type="url" value={c.academy.url} onChange={(v) => patch("academy", { url: v })} />
						<TitledList label="Cartões" items={c.academy.pillars} onChange={(v) => patch("academy", { pillars: v })} />
					</Card>
				)}

				{tab === "eventos" && (
					<>
						<Card title="Números dos eventos">
							<StatsList items={c.events.stats} onChange={(v) => patch("events", { stats: v })} />
						</Card>
						<Card title="Marcas registadas">
							<Repeater
								label="Marcas"
								addLabel="Adicionar marca"
								items={c.events.brands}
								onChange={(v) => patch("events", { brands: v })}
								create={() => ({ image: "", title: "", description: "" })}
								itemTitle={(b) => b.title}
								render={(b, up) => (
									<div className="grid gap-4 sm:grid-cols-[200px_1fr]">
										<ImageField label="Imagem" value={b.image} onChange={(v) => up({ image: v })} aspect="aspect-[4/5]" />
										<div className="grid content-start gap-4">
											<TextInput label="Nome" value={b.title} onChange={(v) => up({ title: v })} />
											<TextArea label="Descrição" rows={3} value={b.description} onChange={(v) => up({ description: v })} />
										</div>
									</div>
								)}
							/>
						</Card>
					</>
				)}

				{tab === "parceiros" && (
					<Card title="Parceiros" description="Parceiros gerais: faixa de logótipos em Início, Sobre nós e Eventos. As seguradoras são geridas no separador Seguros. Sem logótipos, a secção desaparece.">
						<TextInput label="Título da faixa" value={c.partners.title} onChange={(v) => patch("partners", { title: v })} />
						<ImageListField label="Logótipos" accept="image/*" tileClass="aspect-[2/1]" contain value={c.partners.logos} onChange={(v) => patch("partners", { logos: v })} hint="PNG ou SVG com fundo transparente." />
					</Card>
				)}

				{tab === "contactos" && (
					<>
						<Card title="Contactos" description="Usados no menu, no rodapé e na página de contactos.">
							<div className="grid gap-5 sm:grid-cols-2">
								<TextArea label="Telefones" hint="Um por linha." rows={3} value={c.contacts.phones.join("\n")} onChange={(v) => patch("contacts", { phones: lines(v) })} />
								<TextArea label="Emails" hint="Um por linha." rows={3} value={c.contacts.emails.join("\n")} onChange={(v) => patch("contacts", { emails: lines(v) })} />
							</div>
							<TextInput label="Morada" value={c.contacts.address} onChange={(v) => patch("contacts", { address: v })} />
							<TextInput label="Horário" value={c.contacts.hours} onChange={(v) => patch("contacts", { hours: v })} />
						</Card>
						<Card title="Redes sociais">
							<Repeater
								label="Redes"
								addLabel="Adicionar rede"
								items={c.socials}
								onChange={(v) => patch("socials", v)}
								create={() => ({ name: "", href: "" })}
								itemTitle={(s) => s.name}
								render={(s, up) => (
									<div className="grid gap-4 sm:grid-cols-[200px_1fr]">
										<Field label="Rede">
											<input list="social-names" value={s.name} onChange={(e) => up({ name: e.target.value })} className={inputCls} />
										</Field>
										<TextInput label="Link" type="url" value={s.href} onChange={(v) => up({ href: v })} />
									</div>
								)}
							/>
							<datalist id="social-names">
								{["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok", "X", "WhatsApp"].map((n) => (
									<option key={n} value={n} />
								))}
							</datalist>
						</Card>
					</>
				)}
			</div>
		</div>
	)
}
