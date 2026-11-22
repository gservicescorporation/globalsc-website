import { ArrowUpRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Parallax from "@/components/motion/Parallax"
import SplitReveal from "@/components/motion/SplitReveal"
import type { TitledText } from "@/types/content"

/** `showLink`: mostra o botão para a página /sobre-nos (usado na página inicial). */
export default function About({
	story,
	advantages: ADVANTAGES,
	showLink = false,
}: {
	story: string
	advantages: TitledText[]
	showLink?: boolean
}) {
	return (
		<section id="sobre-nos" className="section-y scroll-mt-24 bg-background">
			<div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
				{/* Imagens */}
				<div className="relative lg:col-span-6">
					<div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
						<Parallax className="absolute inset-0" speed={8} scale={1.15}>
							<div className="absolute inset-0">
								<Image
									src="/images/epic-sana-2.jpg"
									alt="Evento corporativo organizado pela Global Services Corporation"
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
								/>
							</div>
						</Parallax>
						<div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
					</div>

					<div
						data-reveal="up"
						className="absolute right-4 -bottom-8 w-56 rounded-3xl bg-ink p-6 text-white shadow-2xl sm:w-64 lg:-right-12">
						<p className="text-5xl font-bold tracking-tight">
							10<span className="text-accent">+</span>
						</p>
						<p className="mt-2 text-sm leading-snug text-white/65">
							anos a criar parcerias de confiança no mercado angolano.
						</p>
					</div>
				</div>

				{/* Texto */}
				<div className="lg:col-span-6">
					<span data-reveal="fade" className="eyebrow text-royal">
						A nossa história
					</span>
					<SplitReveal className="display-lg mt-6 text-balance text-ink">
						Uma parceira estratégica,{" "}
						<span className="serif-accent text-royal">feita em Angola.</span>
					</SplitReveal>
					<p data-reveal className="mt-8 text-lg leading-relaxed text-tertiary">
						{story}
					</p>

					<ul className="mt-10 flex flex-col divide-y divide-line border-y border-line">
						{ADVANTAGES.map((a) => (
							<li key={a.title} data-reveal className="flex gap-5 py-6">
								<span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal/10 text-royal">
									<Check className="h-4 w-4" />
								</span>
								<div>
									<h3 className="text-lg font-semibold text-ink">{a.title}</h3>
									<p className="mt-1 text-tertiary">{a.text}</p>
								</div>
							</li>
						))}
					</ul>
					{showLink && (
						<Link data-reveal href="/sobre-nos" className="btn btn-dark mt-10">
							Conhecer a nossa história <ArrowUpRight className="h-4 w-4" />
						</Link>
					)}
				</div>
			</div>
		</section>
	)
}
