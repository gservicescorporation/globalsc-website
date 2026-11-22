"use client"

import { Search, X } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import EventsCard from "@/app/ui/EventsCard"
import type { EventSummary } from "@/types/event"

type Tab = "todos" | "proximos" | "realizados"

const normalize = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export default function EventsExplorer({ events }: { events: EventSummary[] }) {
	const [query, setQuery] = useState("")
	const [year, setYear] = useState("all")
	const [category, setCategory] = useState("all")
	const [tab, setTab] = useState<Tab>("todos")
	const [sort, setSort] = useState<"recentes" | "antigos" | "az">("recentes")
	const grid = useRef<HTMLUListElement>(null)

	const today = new Date().toISOString().slice(0, 10)
	const years = useMemo(
		() => [...new Set(events.map((e) => e.startDate.slice(0, 4)))].sort().reverse(),
		[events]
	)
	const categories = useMemo(
		() => [...new Set(events.map((e) => e.category).filter(Boolean))].sort(),
		[events]
	)

	const filtered = useMemo(() => {
		const q = normalize(query.trim())
		return events
			.filter((e) => (tab === "proximos" ? e.startDate >= today : tab === "realizados" ? e.startDate < today : true))
			.filter((e) => year === "all" || e.startDate.startsWith(year))
			.filter((e) => category === "all" || e.category === category)
			.filter(
				(e) =>
					!q ||
					normalize(`${e.title} ${e.location} ${e.category} ${e.description}`).includes(q)
			)
			.sort((a, b) =>
				sort === "az"
					? a.title.localeCompare(b.title, "pt")
					: sort === "antigos"
						? a.startDate.localeCompare(b.startDate)
						: b.startDate.localeCompare(a.startDate)
			)
	}, [events, query, year, category, tab, sort, today])

	const key = `${query}|${year}|${category}|${tab}|${sort}`

	useGSAP(
		() => {
			if (prefersReducedMotion()) return
			gsap.fromTo(
				"[data-card]",
				{ y: 40, opacity: 0 },
				{ y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "expo.out", overwrite: true }
			)
		},
		{ scope: grid, dependencies: [key] }
	)

	const hasFilters = query || year !== "all" || category !== "all" || tab !== "todos"

	const tabs: { id: Tab; label: string }[] = [
		{ id: "todos", label: "Todos" },
		{ id: "proximos", label: "Próximos" },
		{ id: "realizados", label: "Realizados" },
	]

	return (
		<section className="bg-background pb-28">
			{/* Barra de filtros */}
			<div className="z-30 border-b border-line bg-background/85 py-4 backdrop-blur-xl lg:sticky lg:top-0">
				<div className="container-x flex flex-col gap-4 lg:flex-row lg:items-center">
					<div role="tablist" aria-label="Estado do evento" className="flex shrink-0 rounded-full bg-paper p-1 ring-1 ring-line">
						{tabs.map((t) => (
							<button
								key={t.id}
								role="tab"
								aria-selected={tab === t.id}
								onClick={() => setTab(t.id)}
								className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
									tab === t.id ? "bg-ink text-white" : "text-tertiary hover:text-ink"
								}`}>
								{t.label}
							</button>
						))}
					</div>

					<label className="relative flex-1">
						<span className="sr-only">Pesquisar eventos</span>
						<Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Pesquisar por nome, local ou tema…"
							className="w-full rounded-full bg-paper py-3 pr-4 pl-11 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-royal"
						/>
					</label>

					<div className="grid grid-cols-3 gap-2 lg:flex">
						<select
							aria-label="Ano"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="rounded-full bg-paper px-4 py-3 text-sm ring-1 ring-line outline-none">
							<option value="all">Todos os anos</option>
							{years.map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
						<select
							aria-label="Categoria"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="rounded-full bg-paper px-4 py-3 text-sm ring-1 ring-line outline-none">
							<option value="all">Categorias</option>
							{categories.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<select
							aria-label="Ordenar"
							value={sort}
							onChange={(e) => setSort(e.target.value as typeof sort)}
							className="rounded-full bg-paper px-4 py-3 text-sm ring-1 ring-line outline-none">
							<option value="recentes">Mais recentes</option>
							<option value="antigos">Mais antigos</option>
							<option value="az">A–Z</option>
						</select>
					</div>
				</div>
			</div>

			<div className="container-x pt-10">
				<div className="mb-8 flex items-center justify-between text-sm text-tertiary">
					<p aria-live="polite">
						<strong className="text-ink">{filtered.length}</strong>{" "}
						{filtered.length === 1 ? "evento encontrado" : "eventos encontrados"}
					</p>
					{hasFilters && (
						<button
							onClick={() => {
								setQuery("")
								setYear("all")
								setCategory("all")
								setTab("todos")
							}}
							className="flex items-center gap-1 font-medium text-royal hover:underline">
							<X className="h-4 w-4" /> Limpar filtros
						</button>
					)}
				</div>

				<ul ref={grid} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((e) => (
						<li key={e.id} data-card>
							<EventsCard event={e} reveal={false} />
						</li>
					))}
				</ul>

				{filtered.length === 0 && (
					<div className="rounded-[1.75rem] border border-dashed border-line p-16 text-center">
						<p className="text-lg font-medium text-ink">Nenhum evento encontrado.</p>
						<p className="mt-2 text-tertiary">Experimente outros termos ou limpe os filtros.</p>
					</div>
				)}
			</div>
		</section>
	)
}
