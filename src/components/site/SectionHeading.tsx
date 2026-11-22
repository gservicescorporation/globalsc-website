import SplitReveal from "@/components/motion/SplitReveal"
import type { ReactNode } from "react"

/** Cabeçalho de secção: eyebrow + título revelado + texto de apoio. */
export default function SectionHeading({
	eyebrow,
	title,
	text,
	align = "left",
	tone = "dark",
	className = "",
	aside,
}: {
	eyebrow?: string
	title: ReactNode
	text?: ReactNode
	align?: "left" | "center"
	tone?: "dark" | "light"
	className?: string
	aside?: ReactNode
}) {
	const center = align === "center"
	return (
		<div
			className={`flex flex-col gap-6 ${
				center ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"
			} ${className}`}>
			<div className={`flex max-w-3xl flex-col gap-5 ${center ? "items-center" : ""}`}>
				{eyebrow && (
					<span
						data-reveal="fade"
						className={`eyebrow ${tone === "light" ? "text-accent" : "text-royal"}`}>
						{eyebrow}
					</span>
				)}
				<SplitReveal
					className={`display-lg text-balance ${tone === "light" ? "text-white" : "text-ink"}`}>
					{title}
				</SplitReveal>
				{text && (
					<p
						data-reveal
						className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
							tone === "light" ? "text-white/65" : "text-tertiary"
						}`}>
						{text}
					</p>
				)}
			</div>
			{aside && <div data-reveal>{aside}</div>}
		</div>
	)
}
