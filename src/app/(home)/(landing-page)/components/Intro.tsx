import Counter from "@/components/motion/Counter"
import ScrubText from "@/components/motion/ScrubText"
import type { Stat } from "@/types/content"

export default function Intro({ manifesto, stats }: { manifesto: string; stats: Stat[] }) {
	if (!manifesto && stats.length === 0) return null
	return (
		<section className="section-y relative bg-background">
			<div className="container-x">
				<span data-reveal="fade" className="eyebrow text-royal">
					Quem somos
				</span>
				{manifesto && <ScrubText className="display-md mt-8 max-w-6xl text-ink">{manifesto}</ScrubText>}

				{stats.length > 0 && (
					<dl
						className={`mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-line ring-1 ring-line ${
							stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : ""
						}`}>
						{stats.map((s) => (
							<div key={s.label} data-reveal="up" className="flex flex-col gap-2 bg-paper p-6 sm:p-10">
								<dt className="order-2 text-sm text-tertiary">{s.label}</dt>
								<dd className="order-1 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
									<Counter value={Number(s.value) || 0} suffix={s.suffix} />
								</dd>
							</div>
						))}
					</dl>
				)}
			</div>
		</section>
	)
}
