"use client"

import { useRef, type ElementType, type ReactNode } from "react"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "./gsap"

interface SplitRevealProps {
	as?: ElementType
	children: ReactNode
	className?: string
	/** "lines" (máscara por linha) ou "words" (palavra a palavra). */
	by?: "lines" | "words" | "chars"
	delay?: number
	stagger?: number
	/** Anima logo ao montar (hero) em vez de esperar pelo scroll. */
	immediate?: boolean
	start?: string
}

/** Título que se revela linha a linha (ou palavra a palavra) com máscara. */
export default function SplitReveal({
	as: Tag = "h2",
	children,
	className,
	by = "lines",
	delay = 0,
	stagger,
	immediate = false,
	start = "top 88%",
}: SplitRevealProps) {
	const ref = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			const el = ref.current
			if (!el) return
			if (prefersReducedMotion()) {
				gsap.set(el, { visibility: "visible" })
				return
			}
			const split = SplitText.create(el, {
				type: by === "lines" ? "lines" : by === "words" ? "words,lines" : "chars,words,lines",
				mask: "lines",
				autoSplit: true,
				linesClass: "split-line",
				onSplit(self) {
					gsap.set(el, { visibility: "visible" })
					const targets =
						by === "lines" ? self.lines : by === "words" ? self.words : self.chars
					return gsap.from(targets, {
						yPercent: 115,
						rotate: by === "lines" ? 2 : 0,
						duration: by === "chars" ? 0.9 : 1.25,
						stagger: stagger ?? (by === "lines" ? 0.1 : by === "words" ? 0.04 : 0.018),
						ease: "expo.out",
						delay,
						scrollTrigger: immediate
							? undefined
							: { trigger: el, start, once: true },
					})
				},
			})
			return () => split.revert()
		},
		{ scope: ref, dependencies: [by, delay, immediate] }
	)

	return (
		<Tag ref={ref} className={className} data-split>
			{children}
		</Tag>
	)
}
