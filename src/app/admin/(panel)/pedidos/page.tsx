import { Sparkles } from "lucide-react"
import Link from "next/link"
import { hasDatabase } from "@/lib"
import { QUOTE_STATUS, typeLabel } from "@/content/insurance-catalog"
import { listClients, listQuotes } from "@/server/mediation"
import { fmtDate } from "../../_components/format"
import { Empty, PageTitle, StatusBadge } from "../../_components/ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Pedidos de seguro" }

export default async function PedidosPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
	const { estado } = await searchParams
	const [all, clients] = hasDatabase() ? await Promise.all([listQuotes().catch(() => []), listClients().catch(() => [])]) : [[], []]
	// Clientes já registados não repetem os dados no formulário: o nome vem da ficha.
	const clientName = new Map(clients.map((c) => [c.id, c.name]))
	const list = estado ? all.filter((q) => q.status === estado) : all
	const count = (s: string) => all.filter((q) => q.status === s).length

	return (
		<div className="grid gap-6">
			<PageTitle title="Pedidos de seguro" text="Pedidos de cotação feitos no site. Gere a recomendação com IA e envie a proposta." />
			{!hasDatabase() && <Empty>Base de dados não configurada.</Empty>}

			<nav className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Filtrar por estado">
				<Link href="/admin/pedidos" className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${!estado ? "bg-ink text-white" : "bg-white text-tertiary ring-1 ring-line"}`}>
					Todos ({all.length})
				</Link>
				{Object.entries(QUOTE_STATUS).map(([k, v]) => (
					<Link key={k} href={`/admin/pedidos?estado=${k}`} className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${estado === k ? "bg-ink text-white" : "bg-white text-tertiary ring-1 ring-line"}`}>
						{v.label} ({count(k)})
					</Link>
				))}
			</nav>

			{list.length === 0 ? (
				<Empty>Sem pedidos {estado ? "neste estado" : "ainda"}.</Empty>
			) : (
				<ul className="grid gap-2">
					{list.map((q) => (
						<li key={q.id}>
							<Link href={`/admin/pedidos/${q.id}`} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 transition hover:border-royal sm:flex-row sm:items-center sm:gap-6">
								<span className="font-mono text-sm font-semibold text-royal">{q.ref}</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate font-medium text-ink">{q.company || (q.clientId && clientName.get(q.clientId)) || q.name || q.email}</span>
									<span className="text-xs text-muted">
										{typeLabel(q.insuranceType)} · {q.audience === "empresa" ? "Empresa" : "Particular"} · {fmtDate(q.createdAt)}
									</span>
								</span>
								<span className="flex items-center gap-2">
									{q.ai && <Sparkles className="h-4 w-4 text-violet-500" aria-label="Recomendação gerada" />}
									{!q.clientId && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Novo cliente</span>}
									<StatusBadge kind="quote" status={q.status} />
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
