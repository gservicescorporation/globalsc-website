"use client"

import { ArrowLeft, Minus, Plus, TicketCheck, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useRef, useState } from "react"
import { useEventData } from "@/components/site/useEventData"
import { formatLongDate } from "@/app/utils/formatDate"
import { formatPrice } from "@/app/utils/formatPrice"
import type { Ticket } from "@/types/event"

export default function GetTicket({ params }: { params: Promise<{ eventId: string }> }) {
	const { eventId } = use(params)
	const { event, error } = useEventData(eventId)
	const [cart, setCart] = useState<{ ticket: Ticket; qty: number }[]>([])
	const router = useRouter()
	const summaryRef = useRef<HTMLDivElement>(null)

	const add = (ticket: Ticket) =>
		setCart((prev) => {
			const found = prev.find((i) => i.ticket.id === ticket.id)
			return found
				? prev.map((i) => (i.ticket.id === ticket.id ? { ...i, qty: i.qty + 1 } : i))
				: [...prev, { ticket, qty: 1 }]
		})

	const update = (id: string, qty: number) =>
		setCart((prev) =>
			qty <= 0
				? prev.filter((i) => i.ticket.id !== id)
				: prev.map((i) => (i.ticket.id === id ? { ...i, qty } : i))
		)

	const total = cart.reduce((acc, i) => acc + i.ticket.price * i.qty, 0)

	const submit = () => {
		localStorage.setItem("cart-data", JSON.stringify(cart))
		localStorage.setItem("cart-total", JSON.stringify(total))
		router.push(`/events/${event?.slug ?? eventId}/get-ticket/payment`)
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-ink px-6 text-center text-white">
				<div>
					<h1 className="display-md">Evento não encontrado</h1>
					<Link href="/events" className="btn btn-light mt-8">
						Ver eventos
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div
			className="relative min-h-screen bg-ink px-4 pt-32 pb-28 text-white sm:px-6"
			style={
				{
					"--ev-primary": event?.theme.primary ?? "#242565",
					"--ev-secondary": event?.theme.secondary ?? "#0049af",
				} as React.CSSProperties
			}>
			{event?.theme.imgUrl && (
				<Image src={event.theme.imgUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
			)}
			<div
				className="absolute inset-0 opacity-80"
				style={{ background: "linear-gradient(120deg, var(--ev-primary), var(--ev-secondary))" }}
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-ink/30 to-ink" />

			<div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<Link
						href={`/events/${event?.slug ?? eventId}`}
						className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
						<ArrowLeft className="h-4 w-4" /> Voltar ao evento
					</Link>
					<h1 className="display-md mt-6">{event ? event.title : "A carregar…"}</h1>
					{event && <p className="mt-3 text-white/65">{formatLongDate(event.startDate)} · {event.location}</p>}

					<ul className="mt-10 grid gap-4 sm:grid-cols-2">
						{!event &&
							[0, 1].map((i) => <li key={i} className="h-44 animate-pulse rounded-3xl bg-white/10" />)}
						{event?.tickets.map((t) => (
							<li key={t.id} className="flex flex-col rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-md">
								<h2 className="text-lg font-semibold">{t.ticketName}</h2>
								<p className="mt-2 text-2xl font-bold">
									{formatPrice(t.price)} <span className="text-sm font-medium text-white/60">AOA</span>
								</p>
								{t.benefits.length > 0 && (
									<ul className="mt-4 flex flex-col gap-1 text-sm text-white/70">
										{t.benefits.map((b) => (
											<li key={b}>· {b}</li>
										))}
									</ul>
								)}
								<button type="button" onClick={() => add(t)} className="btn btn-light mt-6">
									<Plus className="h-4 w-4" /> Adicionar
								</button>
							</li>
						))}
					</ul>
				</div>

				<div ref={summaryRef} className="lg:col-span-5">
					<div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl sm:p-8 lg:sticky lg:top-28">
						<h2 className="text-xl font-semibold">Resumo da reserva</h2>
						{cart.length === 0 ? (
							<p className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-tertiary">
								Adicione um ou mais bilhetes para continuar.
							</p>
						) : (
							<ul className="mt-6 flex flex-col divide-y divide-line">
								{cart.map((i) => (
									<li key={i.ticket.id} className="flex items-center justify-between gap-4 py-4">
										<div className="min-w-0">
											<p className="truncate font-semibold">{i.ticket.ticketName}</p>
											<p className="text-sm text-tertiary">{formatPrice(i.ticket.price)} AOA</p>
										</div>
										<div className="flex items-center gap-2">
											<button aria-label="Diminuir" onClick={() => update(i.ticket.id, i.qty - 1)} className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line hover:bg-background">
												<Minus className="h-4 w-4" />
											</button>
											<span className="w-6 text-center font-semibold tabular-nums">{i.qty}</span>
											<button aria-label="Aumentar" onClick={() => update(i.ticket.id, i.qty + 1)} className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line hover:bg-background">
												<Plus className="h-4 w-4" />
											</button>
											<button aria-label="Remover" onClick={() => update(i.ticket.id, 0)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50">
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</li>
								))}
							</ul>
						)}
						<div className="mt-6 flex items-center justify-between border-t border-line pt-6">
							<span className="text-tertiary">Total estimado</span>
							<span className="text-2xl font-bold">{formatPrice(total)} AOA</span>
						</div>
						<button type="button" disabled={!cart.length} onClick={submit} className="btn btn-dark mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40">
							Prosseguir para pagamento
						</button>
					</div>
				</div>
			</div>

			{cart.length > 0 && (
				<button
					type="button"
					onClick={() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
					className="fixed right-5 bottom-5 z-30 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-ink shadow-2xl lg:hidden">
					<TicketCheck className="h-5 w-5" /> Resumo · {formatPrice(total)}
				</button>
			)}
		</div>
	)
}
