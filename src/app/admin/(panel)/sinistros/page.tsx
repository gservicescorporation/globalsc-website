import { Images, Sparkles } from "lucide-react"
import Link from "next/link"
import { hasDatabase } from "@/lib"
import { CLAIM_STATUS, claimLabel } from "@/content/insurance-catalog"
import { listClaims } from "@/server/mediation"
import { fmtDate } from "../../_components/format"
import { Empty, PageTitle, StatusBadge } from "../../_components/ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Sinistros" }

export default async function SinistrosPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
	const { estado } = await searchParams
	const all = hasDatabase() ? await listClaims().catch(() => []) : []
	const list = estado ? all.filter((c) => c.status === estado) : all
	const count = (s: string) => all.filter((c) => c.status === s).length

	return (
		<div className="grid gap-6">
			<PageTitle title="Sinistros" text="Participações enviadas pelos clientes no site, com fotografias." />
			{!hasDatabase() && <Empty>Base de dados não configurada.</Empty>}

			<nav className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Filtrar por estado">
				<Link href="/admin/sinistros" className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${!estado ? "bg-ink text-white" : "bg-white text-tertiary ring-1 ring-line"}`}>
					Todos ({all.length})
				</Link>
				{Object.entries(CLAIM_STATUS).map(([k, v]) => (
					<Link key={k} href={`/admin/sinistros?estado=${k}`} className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${estado === k ? "bg-ink text-white" : "bg-white text-tertiary ring-1 ring-line"}`}>
						{v.label} ({count(k)})
					</Link>
				))}
			</nav>

			{list.length === 0 ? (
				<Empty>Sem sinistros {estado ? "neste estado" : "ainda"}.</Empty>
			) : (
				<ul className="grid gap-2">
					{list.map((c) => (
						<li key={c.id}>
							<Link href={`/admin/sinistros/${c.id}`} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-royal sm:flex-row sm:items-center sm:gap-6">
								{c.photos[0] ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={c.photos[0]} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
								) : (
									<span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-background text-muted">
										<Images className="h-5 w-5" />
									</span>
								)}
								<span className="font-mono text-sm font-semibold text-royal">{c.ref}</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate font-medium text-ink">{c.name || c.email}</span>
									<span className="text-xs text-muted">
										{claimLabel(c.claimType)} · {c.photos.length} foto(s) · {fmtDate(c.createdAt)}
									</span>
								</span>
								<span className="flex items-center gap-2">
									{c.ai && <Sparkles className="h-4 w-4 text-violet-500" aria-label="Analisado pela IA" />}
									{!c.clientId && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Não registado</span>}
									<StatusBadge kind="claim" status={c.status} />
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
