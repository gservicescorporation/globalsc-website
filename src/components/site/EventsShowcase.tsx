import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import EventsCard from "@/app/ui/EventsCard"
import SectionHeading from "./SectionHeading"
import type { EventSummary } from "@/types/event"

/** Grelha de eventos com cabeçalho e ligação "ver todos". */
export default function EventsShowcase({
	eyebrow,
	title,
	text,
	events,
	limit = 3,
	empty = "Em breve, novidades por aqui.",
	className = "bg-background",
}: {
	eyebrow: string
	title: React.ReactNode
	text?: string
	events: EventSummary[]
	limit?: number
	empty?: string
	className?: string
}) {
	const list = events.slice(0, limit)
	return (
		<section className={`section-y ${className}`}>
			<div className="container-x">
				<SectionHeading
					eyebrow={eyebrow}
					title={title}
					text={text}
					aside={
						events.length > limit ? (
							<Link href="/events/all" className="btn btn-outline-dark">
								Ver todos os eventos <ArrowUpRight className="h-4 w-4" />
							</Link>
						) : undefined
					}
				/>

				{list.length > 0 ? (
					<ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{list.map((e) => (
							<li key={e.id}>
								<EventsCard event={e} />
							</li>
						))}
					</ul>
				) : (
					<p
						data-reveal
						className="mt-14 rounded-[1.75rem] border border-dashed border-line p-12 text-center text-tertiary">
						{empty}
					</p>
				)}
			</div>
		</section>
	)
}
