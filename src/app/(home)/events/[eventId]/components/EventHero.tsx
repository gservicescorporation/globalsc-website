"use client"

import { ArrowUpRight, CalendarDays, Clock, MapPin, Ticket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import SplitReveal from "@/components/motion/SplitReveal"
import { formatLongDate, parseDay } from "@/app/utils/formatDate"
import type { EventRecord } from "@/types/event"

function useCountdown(target: Date) {
	const [left, setLeft] = useState<number | null>(null)
	useEffect(() => {
		const tick = () => setLeft(Math.max(0, target.getTime() - Date.now()))
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [target])
	return left
}

export default function EventHero({ event, passed }: { event: EventRecord; passed: boolean }) {
	const root = useRef<HTMLElement>(null)
	const target = useRef(
		(() => {
			const d = parseDay(event.startDate)
			const [h, m] = (event.startTime || "09:00").split(":").map(Number)
			d.setHours(h || 9, m || 0, 0, 0)
			return d
		})()
	).current
	const left = useCountdown(target)

	useGSAP(
		() => {
			if (prefersReducedMotion()) return
			gsap.from("[data-hero-fade]", { y: 30, opacity: 0, stagger: 0.08, duration: 1.2, delay: 0.5 })
			gsap.fromTo("[data-hero-bg]", { scale: 1.2 }, { scale: 1, duration: 2.4, ease: "expo.out" })
			gsap.to("[data-hero-bg]", {
				yPercent: 20,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
			})
			gsap.to("[data-hero-inner]", {
				yPercent: -15,
				opacity: 0.2,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
			})
		},
		{ scope: root }
	)

	const units = left === null
		? null
		: [
				{ label: "Dias", v: Math.floor(left / 86_400_000) },
				{ label: "Horas", v: Math.floor((left / 3_600_000) % 24) },
				{ label: "Min", v: Math.floor((left / 60_000) % 60) },
				{ label: "Seg", v: Math.floor((left / 1000) % 60) },
			]

	const bg = event.theme.imgUrl || event.coverUrl
	const external = event.externalUrl && /^https?:\/\//.test(event.externalUrl)

	return (
		<section ref={root} className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
			<div data-hero-bg className="absolute inset-0">
				{bg && <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover" />}
			</div>
			<div
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(110deg, var(--ev-primary) 0%, color-mix(in srgb, var(--ev-secondary) 85%, transparent) 60%, transparent 100%)",
				}}
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60" />

			<div data-hero-inner className="container-x relative pt-36 pb-14 sm:pb-20">
				<div className="flex flex-wrap items-center gap-2" data-hero-fade>
					{event.category && (
						<span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/25 backdrop-blur">
							{event.category}
						</span>
					)}
					<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/15 backdrop-blur">
						<CalendarDays className="h-3.5 w-3.5" /> {formatLongDate(event.startDate)}
					</span>
					{event.startTime && (
						<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/15 backdrop-blur">
							<Clock className="h-3.5 w-3.5" /> {event.startTime}
						</span>
					)}
					{event.location && (
						<span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/15 backdrop-blur">
							<MapPin className="h-3.5 w-3.5" /> {event.location}
						</span>
					)}
				</div>

				<SplitReveal
					as="h1"
					immediate
					delay={0.25}
					className="display-xl mt-7 max-w-6xl text-balance"
					by="lines">
					{event.title}
				</SplitReveal>

				<div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex flex-wrap gap-3" data-hero-fade>
						{!passed && event.ticketsEnabled && event.tickets.length > 0 && (
							<Link href={`/events/${event.slug}/get-ticket`} className="btn btn-light">
								<Ticket className="h-4 w-4" /> Garantir o meu lugar
							</Link>
						)}
						{event.externalUrl && (
							<Link
								href={event.externalUrl}
								target={external ? "_blank" : undefined}
								className={`btn ${!passed && event.ticketsEnabled ? "btn-outline-light" : "btn-light"}`}>
								Site oficial do evento <ArrowUpRight className="h-4 w-4" />
							</Link>
						)}
						<a href="#sobre" className="btn btn-outline-light">
							{passed ? "Reviver o evento" : "Saber mais"}
						</a>
					</div>

					{!passed && (
						<div data-hero-fade aria-label="Contagem decrescente" className="grid grid-cols-4 gap-2 sm:gap-3">
							{(units ?? [{ label: "Dias", v: 0 }, { label: "Horas", v: 0 }, { label: "Min", v: 0 }, { label: "Seg", v: 0 }]).map((u) => (
								<div
									key={u.label}
									className="flex min-w-[4.5rem] flex-col items-center rounded-2xl bg-white/10 px-3 py-4 ring-1 ring-white/15 backdrop-blur-md sm:min-w-24 sm:py-5">
									<span className="text-3xl font-bold tabular-nums sm:text-5xl" suppressHydrationWarning>
										{units ? String(u.v).padStart(2, "0") : "--"}
									</span>
									<span className="mt-1 text-[0.65rem] tracking-widest text-white/60 uppercase">{u.label}</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
