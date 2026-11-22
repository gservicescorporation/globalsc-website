import { hasDatabase, initDataSource } from "@/lib"
import { Payment } from "@/entities/Payment"
import { getAllEventsForAdmin } from "@/server/events"
import { formatPrice } from "@/app/utils/formatPrice"

export const dynamic = "force-dynamic"
export const metadata = { title: "Pagamentos" }

const STATUS: Record<string, string> = {
	SUCCESS: "bg-emerald-50 text-emerald-700",
	PENDING: "bg-amber-50 text-amber-700",
	FAILED: "bg-red-50 text-red-700",
	ERROR: "bg-red-50 text-red-700",
	CANCELLED: "bg-background text-tertiary",
}
const LABEL: Record<string, string> = {
	SUCCESS: "Pago",
	PENDING: "Pendente",
	FAILED: "Falhou",
	ERROR: "Erro",
	CANCELLED: "Cancelado",
}

export default async function PaymentsPage() {
	let payments: Payment[] = []
	let error: string | null = null
	if (hasDatabase()) {
		try {
			const ds = await initDataSource()
			payments = await ds.getRepository(Payment).find({ order: { createdAt: "DESC" }, take: 200 })
		} catch (e) {
			error = (e as Error).message
		}
	}
	const events = await getAllEventsForAdmin().catch(() => [])
	const names = new Map(events.map((e) => [e.id, e.title]))

	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Pagamentos</h1>
				<p className="mt-1 text-sm text-tertiary">Últimas 200 cobranças (AppyPay).</p>
			</div>
			{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
			<div className="overflow-x-auto rounded-3xl border border-line bg-white">
				<table className="w-full min-w-[720px] text-left text-sm">
					<thead className="border-b border-line text-xs tracking-wider text-muted uppercase">
						<tr>
							<th className="px-5 py-3 font-medium">Data</th>
							<th className="px-5 py-3 font-medium">Transação</th>
							<th className="px-5 py-3 font-medium">Evento</th>
							<th className="px-5 py-3 font-medium">Método</th>
							<th className="px-5 py-3 text-right font-medium">Valor</th>
							<th className="px-5 py-3 font-medium">Estado</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-line">
						{payments.map((p) => (
							<tr key={p.id}>
								<td className="px-5 py-3 whitespace-nowrap text-tertiary">
									{new Intl.DateTimeFormat("pt-PT", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Luanda" }).format(p.createdAt)}
								</td>
								<td className="px-5 py-3 font-mono text-xs">{p.merchantTransactionId}</td>
								<td className="max-w-[16rem] truncate px-5 py-3">{(p.eventId && names.get(p.eventId)) || p.eventId || "—"}</td>
								<td className="px-5 py-3 uppercase">{p.paymentMethod}</td>
								<td className="px-5 py-3 text-right font-medium whitespace-nowrap">{formatPrice(Number(p.amount))} {p.currency}</td>
								<td className="px-5 py-3">
									<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[p.status] ?? ""}`}>{LABEL[p.status] ?? p.status}</span>
								</td>
							</tr>
						))}
						{payments.length === 0 && (
							<tr>
								<td colSpan={6} className="px-5 py-12 text-center text-muted">
									{hasDatabase() ? "Ainda não há pagamentos." : "Base de dados não configurada."}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
