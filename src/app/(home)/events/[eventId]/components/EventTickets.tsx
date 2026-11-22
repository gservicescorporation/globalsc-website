import { Check } from "lucide-react"
import Link from "next/link"
import SplitReveal from "@/components/motion/SplitReveal"
import { formatPrice } from "@/app/utils/formatPrice"
import type { EventRecord } from "@/types/event"

export default function EventTickets({ event }: { event: EventRecord }) {
	const highlight = Math.min(1, event.tickets.length - 1)
	return (
		<section id="bilhetes" className="section-y relative overflow-hidden bg-ink text-white">
			<div
				className="absolute inset-0 opacity-60"
				style={{ background: "linear-gradient(120deg, var(--ev-primary), var(--ev-secondary))" }}
			/>
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
			<div className="container-x relative">
				<div className="mx-auto max-w-3xl text-center">
					<span className="eyebrow text-white/70">Acesso</span>
					<SplitReveal className="display-lg mt-6 text-balance">Escolha o seu passe.</SplitReveal>
				</div>

				<ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{event.tickets.map((t, i) => (
						<li
							key={t.id}
							data-reveal="up"
							className={`flex flex-col rounded-[2rem] p-8 backdrop-blur-md ${
								i === highlight
									? "bg-white text-ink shadow-2xl lg:-translate-y-4"
									: "bg-white/10 ring-1 ring-white/15"
							}`}>
							<h3 className="text-lg font-semibold">{t.ticketName}</h3>
							<p className="mt-4 text-4xl font-bold tracking-tight">
								{formatPrice(t.price)} <span className="text-base font-medium opacity-60">AOA</span>
							</p>
							<ul className="mt-8 flex flex-1 flex-col gap-3 text-sm">
								{t.benefits.map((b) => (
									<li key={b} className="flex items-start gap-3">
										<Check className={`mt-0.5 h-4 w-4 shrink-0 ${i === highlight ? "text-royal" : "text-accent"}`} />
										<span className={i === highlight ? "text-tertiary" : "text-white/80"}>{b}</span>
									</li>
								))}
							</ul>
							<Link
								href={`/events/${event.slug}/get-ticket`}
								className={`btn mt-10 ${i === highlight ? "btn-dark" : "btn-light"}`}>
								Reservar
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
