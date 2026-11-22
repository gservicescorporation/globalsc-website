import Image from "next/image"
import SectionHeading from "@/components/site/SectionHeading"
import type { EventRecord } from "@/types/event"

export default function EventSpeakers({ block }: { block: EventRecord["speakers"] }) {
	return (
		<section className="section-y bg-background">
			<div className="container-x">
				<SectionHeading eyebrow="Oradores" title={block.title} text={block.subtitle} />
				<ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
					{block.speakers.map((s, i) => (
						<li
							key={`${s.fullname}-${i}`}
							data-reveal
							className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-ink">
							{s.imgUrl && (
								<Image
									src={s.imgUrl}
									alt={s.fullname}
									fill
									sizes="(max-width: 1024px) 50vw, 25vw"
									className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
								/>
							)}
							<div
								className="absolute inset-0"
								style={{ background: "linear-gradient(to top, var(--ev-primary), transparent 55%)" }}
							/>
							<div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
								<h3 className="text-base font-semibold sm:text-lg">{s.fullname}</h3>
								<p className="mt-1 text-xs text-white/75 sm:text-sm">{s.jobTitle}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
