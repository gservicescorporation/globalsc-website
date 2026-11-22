"use client"

import { useRef, type ReactNode } from "react"
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "./gsap"

/**
 * Faixa infinita. A velocidade acelera e inverte com a direção do scroll.
 */
export default function Marquee({
	children,
	className,
	speed = 40,
	reverse = false,
}: {
	children: ReactNode
	className?: string
	/** segundos por ciclo */
	speed?: number
	reverse?: boolean
}) {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const track = ref.current?.querySelector<HTMLElement>("[data-track]")
			if (!track || prefersReducedMotion()) return

			const tween = gsap.fromTo(
				track,
				{ xPercent: reverse ? -50 : 0 },
				{ xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 }
			)

			// Scroll para baixo → sentido normal e mais rápido; para cima → inverte.
			let resetTimer: ReturnType<typeof setTimeout>
			const st = ScrollTrigger.create({
				onUpdate(self) {
					const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 4)
					const sign = self.direction === 1 ? 1 : -1
					gsap.to(tween, { timeScale: boost * sign, duration: 0.3, overwrite: true })
					clearTimeout(resetTimer)
					resetTimer = setTimeout(() => {
						gsap.to(tween, { timeScale: sign, duration: 0.8, overwrite: true })
					}, 150)
				},
			})

			return () => {
				clearTimeout(resetTimer)
				st.kill()
			}
		},
		{ scope: ref }
	)

	return (
		<div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
			<div data-track className="flex w-max">
				<div className="flex shrink-0 items-center">{children}</div>
				<div className="flex shrink-0 items-center" aria-hidden>
					{children}
				</div>
			</div>
		</div>
	)
}
