import Image from "next/image"
import Marquee from "@/components/motion/Marquee"
import SectionHeading from "@/components/site/SectionHeading"
import type { LogoBlock } from "@/types/event"

export default function EventLogos({
	block,
	tone = "background",
}: {
	block: LogoBlock
	tone?: "background" | "paper"
}) {
	const many = block.logos.length > 5
	const logo = (src: string, i: number) => (
		<div
			key={`${src}-${i}`}
			className="mx-3 flex h-28 w-48 items-center justify-center rounded-2xl bg-paper px-6 ring-1 ring-line sm:w-56">
			<Image src={src} alt="Logótipo" width={400} height={200} className="h-16 w-auto object-contain" />
		</div>
	)

	return (
		<section className={`section-y overflow-hidden ${tone === "paper" ? "bg-paper" : "bg-background"}`}>
			<div className="container-x">
				<SectionHeading align="center" title={block.title} text={block.subtitle} />
			</div>
			<div className="mt-14">
				{many ? (
					<Marquee speed={40} className="mask-fade-x">
						{block.logos.map(logo)}
					</Marquee>
				) : (
					<div className="container-x flex flex-wrap justify-center gap-y-6">
						{block.logos.map((src, i) => (
							<div key={`${src}-${i}`} data-reveal="scale">
								{logo(src, i)}
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	)
}
