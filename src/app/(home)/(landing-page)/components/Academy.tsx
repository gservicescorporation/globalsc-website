"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { gsap, useGSAP } from "@/components/motion/gsap"
import SplitReveal from "@/components/motion/SplitReveal"
import type { SiteContent } from "@/types/content"

const COLORS = ["bg-royal", "bg-main", "bg-ink"]

/** Cartões que ficam fixos e se empilham à medida que se desce. */
export default function Academy({ academy }: { academy: SiteContent["academy"] }) {
	const ACADEMY_PILLARS = academy.pillars
	const root = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const cards = gsap.utils.toArray<HTMLElement>("[data-pillar]")
				cards.forEach((card, i) => {
					if (i === cards.length - 1) return
					gsap.to(card, {
						scale: 0.9 + i * 0.02,
						filter: "brightness(0.7)",
						ease: "none",
						scrollTrigger: {
							trigger: cards[i + 1],
							start: "top bottom",
							end: "top 30%",
							scrub: true,
						},
					})
				})
			})
			return () => mm.revert()
		},
		{ scope: root }
	)

	if (!academy.enabled) return null

	return (
		<section ref={root} className="section-y relative bg-paper">
			<div className="container-x grid gap-14 lg:grid-cols-12">
				<div className="lg:col-span-5">
					<div className="lg:sticky lg:top-32">
						<span className="eyebrow text-royal">Academia GSC</span>
						<SplitReveal className="display-lg mt-6 text-balance text-ink">
							Formação para quem trabalha{" "}
							<span className="serif-accent text-royal">no mercado angolano.</span>
						</SplitReveal>
						<p data-reveal className="mt-6 max-w-md text-lg text-tertiary">
							{academy.text}
						</p>
						<Link
							data-reveal
							href={academy.url}
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-dark mt-10">
							Ir para a academia <ArrowUpRight className="h-4 w-4" />
						</Link>
					</div>
				</div>

				<div className="flex flex-col gap-6 lg:col-span-7">
					{ACADEMY_PILLARS.map((p, i) => (
						<article
							key={p.title}
							data-pillar
							style={{ top: `${7 + i * 1.5}rem` }}
							className={`sticky flex min-h-[340px] origin-top flex-col justify-between overflow-hidden rounded-[2rem] p-8 text-white sm:min-h-[400px] sm:p-12 ${COLORS[i % COLORS.length]}`}>
							<div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
							<span className="relative text-8xl font-bold tracking-tighter text-white/15 sm:text-9xl">
								0{i + 1}
							</span>
							<div className="relative">
								<h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{p.title}</h3>
								<p className="mt-4 max-w-md text-white/70 sm:text-lg">{p.text}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
