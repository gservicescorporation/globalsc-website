"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "./gsap"

/** Elemento que é "atraído" pelo cursor (só em dispositivos com rato). */
export default function Magnetic({
	children,
	strength = 0.35,
	className,
}: {
	children: ReactNode
	strength?: number
	className?: string
}) {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		(_ctx, contextSafe) => {
			const el = ref.current
			if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
				return
			const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" })
			const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" })

			const move = contextSafe!((e: MouseEvent) => {
				const r = el.getBoundingClientRect()
				xTo((e.clientX - (r.left + r.width / 2)) * strength)
				yTo((e.clientY - (r.top + r.height / 2)) * strength)
			})
			const leave = contextSafe!(() => {
				xTo(0)
				yTo(0)
			})
			el.addEventListener("mousemove", move)
			el.addEventListener("mouseleave", leave)
			return () => {
				el.removeEventListener("mousemove", move)
				el.removeEventListener("mouseleave", leave)
			}
		},
		{ scope: ref }
	)

	return (
		<div ref={ref} className={`inline-block ${className ?? ""}`}>
			{children}
		</div>
	)
}
