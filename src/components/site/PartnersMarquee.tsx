import Image from "next/image"
import Marquee from "@/components/motion/Marquee"

/** Faixa de logótipos. Não renderiza nada se não houver parceiros. */
export default function PartnersMarquee({ logos, title }: { logos: string[]; title: string }) {
	const list = logos.filter(Boolean)
	if (list.length === 0) return null

	const half = Math.ceil(list.length / 2)
	const rows = list.length > 8 ? [list.slice(0, half), list.slice(half)] : [list]
	// Com poucos logótipos, repete-os para a faixa preencher ecrãs largos.
	const fill = (row: string[]) => (row.length < 6 ? [...row, ...row, ...row] : row)

	return (
		<section className="section-y overflow-hidden bg-paper" aria-label={title}>
			<div className="container-x mb-12 flex items-center gap-6">
				<span data-reveal="fade" className="eyebrow shrink-0 text-royal">
					{title}
				</span>
				<span data-reveal="fade" className="h-px flex-1 bg-line" />
			</div>
			<div className="flex flex-col gap-6">
				{rows.map((row, r) => (
					<Marquee key={r} speed={45 + r * 10} reverse={r % 2 === 1} className="mask-fade-x">
						{fill(row).map((logo, i) => (
							<div
								key={`${logo}-${i}`}
								className="mx-3 flex h-24 w-44 items-center justify-center rounded-2xl bg-background px-6 ring-1 ring-line sm:mx-4 sm:h-28 sm:w-56">
								<Image
									src={logo}
									alt="Logótipo de parceiro"
									width={400}
									height={200}
									className="h-14 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 sm:h-16"
								/>
							</div>
						))}
					</Marquee>
				))}
			</div>
		</section>
	)
}
