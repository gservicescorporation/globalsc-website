"use client"

import { useRef, type ReactNode } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "./gsap"

/**
 * Move o conteúdo verticalmente ao ritmo do scroll.
 * Use com overflow-hidden no contentor e um filho maior (ex.: h-[120%]).
 */
export default function Parallax({
	children,
	className,
	speed = 15,
	scale,
}: {
	children: ReactNode
	className?: string
	/** Percentagem de deslocamento (yPercent) de cima a baixo. */
	speed?: number
	/** Escala inicial opcional (ex.: 1.2 → 1). */
	scale?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const el = ref.current
			if (!el || prefersReducedMotion()) return
			const inner = el.firstElementChild
			if (!inner) return
			gsap.fromTo(
				inner,
				{ yPercent: -speed, scale: scale ?? 1 },
				{
					yPercent: speed,
					scale: 1,
					ease: "none",
					scrollTrigger: {
						trigger: el,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
					},
				}
			)
		},
		{ scope: ref }
	)

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	)
}
