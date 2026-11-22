"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "./gsap"

/**
 * Anel que segue o cursor (só com rato). Cresce sobre elementos clicáveis e
 * mostra um rótulo sobre elementos com [data-cursor="texto"].
 * O cursor nativo mantém-se — isto é só um reforço visual.
 */
export default function Cursor() {
	const ring = useRef<HTMLDivElement>(null)
	const label = useRef<HTMLSpanElement>(null)

	useGSAP(() => {
		const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
		const el = ring.current
		if (!mq.matches || !el) return

		gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
		const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
		const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
		let shown = false

		const move = (e: PointerEvent) => {
			if (!shown) {
				gsap.to(el, { autoAlpha: 1, duration: 0.3 })
				shown = true
			}
			x(e.clientX)
			y(e.clientY)
		}
		const over = (e: PointerEvent) => {
			const target = e.target as HTMLElement
			const tagged = target.closest<HTMLElement>("[data-cursor]")
			const clickable = target.closest("a, button, [role='button'], input, select, textarea, label")
			if (tagged) {
				label.current!.textContent = tagged.dataset.cursor ?? ""
				gsap.to(el, { width: 88, height: 88, backgroundColor: "rgb(81 183 255 / 0.95)", borderColor: "transparent", duration: 0.35 })
				gsap.to(label.current, { opacity: 1, duration: 0.2 })
			} else if (clickable) {
				gsap.to(el, { width: 56, height: 56, backgroundColor: "rgb(81 183 255 / 0.12)", borderColor: "rgb(81 183 255 / 0.6)", duration: 0.3 })
				gsap.to(label.current, { opacity: 0, duration: 0.15 })
			} else {
				gsap.to(el, { width: 28, height: 28, backgroundColor: "transparent", borderColor: "rgb(127 140 170 / 0.55)", duration: 0.3 })
				gsap.to(label.current, { opacity: 0, duration: 0.15 })
			}
		}
		const leave = () => {
			gsap.to(el, { autoAlpha: 0, duration: 0.3 })
			shown = false
		}
		window.addEventListener("pointermove", move)
		window.addEventListener("pointerover", over)
		document.documentElement.addEventListener("pointerleave", leave)
		return () => {
			window.removeEventListener("pointermove", move)
			window.removeEventListener("pointerover", over)
			document.documentElement.removeEventListener("pointerleave", leave)
		}
	})

	return (
		<div
			ref={ring}
			aria-hidden
			className="pointer-events-none fixed top-0 left-0 z-[90] flex h-7 w-7 items-center justify-center rounded-full border mix-blend-normal"
			style={{ borderColor: "rgb(127 140 170 / 0.55)", visibility: "hidden" }}>
			<span ref={label} className="text-[11px] font-semibold tracking-wide text-ink opacity-0" />
		</div>
	)
}
