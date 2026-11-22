import { ArrowUpRight, CalendarClock, CarFront, ClipboardList, Contact, Plus } from "lucide-react"
import Link from "next/link"
import { hasDatabase, initDataSource } from "@/lib"
import { Payment, PaymentStatus } from "@/entities/Payment"
import { countEvents, getAllEventsForAdmin } from "@/server/events"
import { formatLongDate } from "@/app/utils/formatDate"
import { formatPrice } from "@/app/utils/formatPrice"
import { mediationStats } from "@/server/mediation"
import ImportButton from "../_components/ImportButton"

export const dynamic = "force-dynamic"

async function paymentStats() {
	if (!hasDatabase()) return null
	try {
		const ds = await initDataSource()
		const repo = ds.getRepository(Payment)
		const [success, pending] = await Promise.all([
			repo.find({ where: { status: PaymentStatus.SUCCESS } }),
			repo.count({ where: { status: PaymentStatus.PENDING } }),
		])
		const total = success.reduce((acc, p) => acc + Number(p.paidAmount ?? p.amount ?? 0), 0)
		return { count: success.length, total, pending }
	} catch {
		return null
	}
}

export default async function Dashboard() {
	const db = hasDatabase()
	const [events, dbCount, payments, mediation] = await Promise.all([
		getAllEventsForAdmin().catch(() => []),
		db ? countEvents().catch(() => 0) : Promise.resolve(0),
		paymentStats(),
		mediationStats(),
	])
	const today = new Date().toISOString().slice(0, 10)
	const upcoming = events.filter((e) => e.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate))

	// Mediação primeiro: é o negócio principal.
	const stats = [
		{ label: "Pedidos por tratar", value: mediation?.quotesNew ?? "—", icon: ClipboardList, href: "/admin/pedidos?estado=novo" },
		{ label: "Sinistros em aberto", value: mediation?.claimsOpen ?? "—", icon: CarFront, href: "/admin/sinistros?estado=recebido" },
		{ label: "Clientes", value: mediation?.clients ?? "—", icon: Contact, href: "/admin/clientes" },
		{ label: "Próximos eventos", value: upcoming.length, icon: CalendarClock, href: "/admin/events" },
	]

	return (
		<div className="grid gap-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Visão geral</h1>
					<p className="mt-1 text-sm text-tertiary">Mediação de seguros, sinistros e conteúdos do site.</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Link href="/admin/sinistros" className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-royal">
						<CarFront className="h-4 w-4" /> Sinistros
					</Link>
					<Link href="/admin/pedidos" className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-royal">
						<ClipboardList className="h-4 w-4" /> Pedidos
					</Link>
					<Link href="/admin/events/new" className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-royal">
						<Plus className="h-4 w-4" /> Novo evento
					</Link>
				</div>
			</div>

			{!db && (
				<div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
					<p className="font-semibold">Base de dados não configurada</p>
					<p className="mt-1">
						Defina <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> para poder criar e editar eventos. Até
						lá, o site mostra os eventos do ficheiro antigo (apenas leitura).
					</p>
				</div>
			)}
			{db && dbCount === 0 && (
				<div className="flex flex-col gap-4 rounded-3xl border border-royal/20 bg-royal/5 p-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-sm">
						<p className="font-semibold text-ink">Ainda não há eventos na base de dados</p>
						<p className="mt-1 text-tertiary">Importe os eventos e destaques que estavam no site antigo com um clique.</p>
					</div>
					<ImportButton />
				</div>
			)}

			<ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{stats.map(({ label, value, icon: Icon, href }) => (
					<li key={label}>
						<Link href={href} className="block rounded-3xl border border-line bg-white p-5 transition hover:border-royal">
							<Icon className="h-5 w-5 text-royal" />
							<p className="mt-4 text-2xl font-bold tracking-tight text-ink">{value}</p>
							<p className="text-sm text-muted">{label}</p>
						</Link>
					</li>
				))}
			</ul>

			<div className="grid gap-6 lg:grid-cols-2">
				<section className="rounded-3xl border border-line bg-white p-6">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-ink">Próximos eventos</h2>
						<Link href="/admin/events" className="text-sm font-medium text-royal hover:underline">Ver todos</Link>
					</div>
					<ul className="mt-4 divide-y divide-line">
						{upcoming.slice(0, 5).map((e) => (
							<li key={e.id}>
								<Link href={`/admin/events/${e.id}`} className="group flex items-center justify-between gap-4 py-3">
									<span className="min-w-0">
										<span className="block truncate text-sm font-medium text-ink group-hover:text-royal">{e.title}</span>
										<span className="text-xs text-muted">{formatLongDate(e.startDate)}</span>
									</span>
									<ArrowUpRight className="h-4 w-4 shrink-0 text-muted group-hover:text-royal" />
								</Link>
							</li>
						))}
						{upcoming.length === 0 && <li className="py-6 text-center text-sm text-muted">Nenhum evento agendado.</li>}
					</ul>
				</section>

				<section className="rounded-3xl border border-line bg-white p-6">
					<h2 className="font-semibold text-ink">Atalhos</h2>
					<ul className="mt-4 grid gap-2 text-sm">
						{[
							{ href: "/admin/events/new", label: "Criar um novo evento", desc: "Formulário completo com galeria, oradores e bilhetes." },
							{ href: "/admin/slides", label: "Gerir destaques do topo", desc: "Os slides grandes da página inicial e de eventos." },
							{ href: "/admin/payments", label: "Consultar pagamentos", desc: payments ? `${payments.count} confirmados · ${formatPrice(payments.total)} Kz · ${payments.pending} pendentes` : "Histórico de cobranças." },
						].map((l) => (
							<li key={l.href}>
								<Link href={l.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-line p-4 hover:border-royal">
									<span>
										<span className="block font-medium text-ink">{l.label}</span>
										<span className="text-xs text-muted">{l.desc}</span>
									</span>
									<ArrowUpRight className="h-4 w-4 text-muted transition group-hover:rotate-45 group-hover:text-royal" />
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	)
}
