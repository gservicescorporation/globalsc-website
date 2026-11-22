import Image from "next/image"
import SplitReveal from "@/components/motion/SplitReveal"
import Parallax from "@/components/motion/Parallax"

/** Cabeçalho compacto para páginas interiores. */
export default function PageHero({
	eyebrow,
	title,
	text,
	image = "/images/people-sit.png",
	children,
}: {
	eyebrow: string
	title: React.ReactNode
	text?: React.ReactNode
	image?: string
	children?: React.ReactNode
}) {
	return (
		<section className="relative overflow-hidden bg-ink pt-40 pb-20 text-white sm:pt-48 sm:pb-28">
			<Parallax className="absolute inset-0" speed={12} scale={1.15}>
				<div className="absolute inset-0">
					<Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
				</div>
			</Parallax>
			<div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />

			<div className="container-x relative">
				<span data-reveal="fade" className="eyebrow text-accent">
					{eyebrow}
				</span>
				<SplitReveal as="h1" immediate delay={0.2} className="display-xl mt-6 max-w-5xl text-balance">
					{title}
				</SplitReveal>
				{text && (
					<p data-reveal className="mt-6 max-w-2xl text-lg text-white/65">
						{text}
					</p>
				)}
				{children}
			</div>
		</section>
	)
}
