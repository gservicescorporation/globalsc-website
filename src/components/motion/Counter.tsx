"use client"

import { useRef } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "./gsap"

/** Número que conta até ao valor final quando entra no ecrã. */
export default function Counter({
	value,
	prefix = "",
	suffix = "",
	duration = 2.2,
	className,
}: {
	value: number
	prefix?: string
	suffix?: string
	duration?: number
	className?: string
}) {
	const ref = useRef<HTMLSpanElement>(null)
	const format = (n: number) =>
		`${prefix}${Math.round(n).toLocaleString("pt-PT")}${suffix}`

	useGSAP(
		() => {
			const el = ref.current
			if (!el) return
			if (prefersReducedMotion()) {
				el.textContent = format(value)
				return
			}
			const state = { n: 0 }
			gsap.to(state, {
				n: value,
				duration,
				ease: "power3.out",
				scrollTrigger: { trigger: el, start: "top 92%", once: true },
				onUpdate: () => {
					el.textContent = format(state.n)
				},
			})
		},
		{ scope: ref, dependencies: [value] }
	)

	return (
		<span ref={ref} className={`tabular-nums ${className ?? ""}`}>
			{format(0)}
		</span>
	)
}
