import Image from "next/image"
import SectionHeading from "@/components/site/SectionHeading"
import type { EventRecord } from "@/types/event"

export default function EventWhy({ event }: { event: EventRecord }) {
	const { title, subtitle, debates } = event.whySign
	return (
		<section className="section-y bg-paper">
			<div className="container-x">
				<SectionHeading eyebrow="Porque participar" title={title} text={subtitle} />
				<ul className="mt-14 grid gap-6 md:grid-cols-3">
					{debates.map((d, i) => (
						<li
							key={`${d.title}-${i}`}
							data-reveal
							className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] bg-ink p-7 text-white">
							{d.imgUrl && (
								<Image
									src={d.imgUrl}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover opacity-70 transition-transform duration-[1.2s] group-hover:scale-110"
								/>
							)}
							<div
								className="absolute inset-0"
								style={{ background: "linear-gradient(to top, var(--ev-primary), transparent 70%)" }}
							/>
							<span className="absolute top-6 left-7 text-sm font-semibold text-white/70">0{i + 1}</span>
							<div className="relative">
								<h3 className="text-2xl font-semibold">{d.title}</h3>
								<p className="mt-2 text-sm text-white/75">{d.subtitle}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
