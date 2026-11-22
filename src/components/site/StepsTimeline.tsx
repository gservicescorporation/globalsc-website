"use client"

import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap"
import type { TitledText } from "@/types/content"

/**
 * Passos ligados por uma linha que se desenha com o scroll.
 * Desktop: linha horizontal; mobile/tablet: linha vertical à esquerda.
 * Cada passo "acende" quando a linha o alcança.
 */
export default function StepsTimeline({ steps }: { steps: TitledText[] }) {
	const root = useRef<HTMLOListElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()
			mm.add(
				{
					desktop: "(min-width: 1024px)",
					motion: "(prefers-reduced-motion: no-preference)",
				},
				(ctx) => {
					const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean }
					const items = gsap.utils.toArray<HTMLElement>("[data-step]")
					if (!motion) {
						items.forEach((el) => el.classList.add("is-active"))
						gsap.set("[data-step-line]", { scaleX: 1, scaleY: 1 })
						return
					}
					gsap.fromTo(
						"[data-step-line]",
						desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
						{
							scaleX: 1,
							scaleY: 1,
							ease: "none",
							scrollTrigger: {
								trigger: root.current,
								start: desktop ? "top 70%" : "top 75%",
								end: desktop ? "bottom 55%" : "bottom 60%",
								scrub: 0.6,
							},
						}
					)
					items.forEach((el) => {
						ScrollTrigger.create({
							trigger: el,
							start: desktop ? "top 62%" : "top 65%",
							onEnter: () => el.classList.add("is-active"),
							onLeaveBack: () => el.classList.remove("is-active"),
						})
					})
				}
			)
			return () => mm.revert()
		},
		{ scope: root }
	)

	return (
		<ol
			ref={root}
			className="relative mt-16 grid gap-10 pl-10 lg:grid-cols-4 lg:gap-8 lg:pt-12 lg:pl-0">
			{/* Trilho + linha animada */}
			<span aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-white/15 lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
			<span
				aria-hidden
				data-step-line
				className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-accent lg:top-[11px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto lg:origin-left"
			/>
			{steps.map((s, i) => (
				<li key={`${s.title}-${i}`} data-step className="group/step relative">
					<span className="absolute top-1 -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink ring-1 ring-white/25 transition-all duration-500 group-[.is-active]/step:bg-accent group-[.is-active]/step:ring-accent lg:-top-12 lg:left-0">
						<span className="h-1.5 w-1.5 rounded-full bg-white/40 transition-colors duration-500 group-[.is-active]/step:bg-ink" />
					</span>
					<span className="text-5xl font-bold tracking-tighter text-white/15 transition-colors duration-700 group-[.is-active]/step:text-accent/80">
						0{i + 1}
					</span>
					<h3 className="mt-3 text-2xl font-semibold">{s.title}</h3>
					<p className="mt-2 text-white/65">{s.text}</p>
				</li>
			))}
		</ol>
	)
}
