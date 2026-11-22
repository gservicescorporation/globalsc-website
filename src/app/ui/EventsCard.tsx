import { ArrowUpRight, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getDateCalendar } from "../utils/formatDate"
import type { EventSummary } from "@/types/event"

/** Cartão de evento com imagem em zoom, data em destaque e seta animada. */
export default function EventsCard({
	event,
	size = "md",
	reveal = true,
}: {
	event: EventSummary
	size?: "md" | "lg"
	reveal?: boolean
}) {
	const { mes, dia, ano } = getDateCalendar(event.startDate)
	const today = new Date().toISOString().slice(0, 10)
	const upcoming = event.startDate >= today

	return (
		<Link
			href={`/events/${event.slug}`}
			data-reveal={reveal ? "up" : undefined}
			data-cursor="Ver"
			className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-paper ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgb(14_22_40/0.35)]">
			<div
				className={`relative overflow-hidden ${
					size === "lg" ? "aspect-[16/11]" : "aspect-[4/3]"
				}`}>
				<Image
					src={event.coverUrl || "/images/conference.jpg"}
					alt={event.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
					className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.07]"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

				<div className="absolute top-4 left-4 flex flex-col items-center rounded-2xl bg-white/90 px-3 py-2 text-ink shadow-lg backdrop-blur">
					<span className="text-[0.65rem] font-bold tracking-widest text-royal">{mes}</span>
					<span className="text-2xl leading-none font-bold">{dia}</span>
					<span className="text-[0.6rem] font-medium text-muted">{ano}</span>
				</div>

				{upcoming && (
					<span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
						<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
						Brevemente
					</span>
				)}
				{event.category && (
					<span className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-md">
						{event.category}
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-3 p-6">
				<h3 className="line-clamp-2 text-lg leading-snug font-semibold text-ink sm:text-xl">
					{event.title}
				</h3>
				{event.location && (
					<p className="flex items-center gap-1.5 text-sm text-tertiary">
						<MapPin className="h-4 w-4 shrink-0 text-royal" />
						<span className="line-clamp-1">{event.location}</span>
					</p>
				)}
				<p className="line-clamp-2 text-sm leading-relaxed text-muted">{event.description}</p>

				<span className="mt-auto flex items-center justify-between pt-4 text-sm font-semibold text-ink">
					{upcoming ? "Ver detalhes" : "Reviver o evento"}
					<span className="flex h-10 w-10 items-center justify-center rounded-full bg-background transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
						<ArrowUpRight className="h-4 w-4" />
					</span>
				</span>
			</div>
		</Link>
	)
}
