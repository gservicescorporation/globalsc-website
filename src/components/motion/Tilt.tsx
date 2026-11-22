"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "./gsap"

/**
 * Inclinação 3D suave que segue o cursor (só em dispositivos com rato).
 * Expõe --mx/--my (posição do cursor em %) para efeitos de brilho.
 */
export default function Tilt({
	children,
	className,
	max = 6,
}: {
	children: ReactNode
	className?: string
	max?: number
}) {
	const ref = useRef<HTMLDivElement>(null)

	useGSAP(
		(_ctx, contextSafe) => {
			const el = ref.current
			if (!el) return
			const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
			if (!fine.matches) return

			const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" })
			const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" })
			gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" })

			const move = contextSafe!((e: PointerEvent) => {
				const r = el.getBoundingClientRect()
				const px = (e.clientX - r.left) / r.width
				const py = (e.clientY - r.top) / r.height
				ry((px - 0.5) * max * 2)
				rx(-(py - 0.5) * max * 2)
				el.style.setProperty("--mx", `${px * 100}%`)
				el.style.setProperty("--my", `${py * 100}%`)
			})
			const leave = contextSafe!(() => {
				rx(0)
				ry(0)
			})
			el.addEventListener("pointermove", move)
			el.addEventListener("pointerleave", leave)
			return () => {
				el.removeEventListener("pointermove", move)
				el.removeEventListener("pointerleave", leave)
			}
		},
		{ scope: ref }
	)

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	)
}
