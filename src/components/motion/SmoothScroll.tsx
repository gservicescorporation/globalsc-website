"use client"

import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import Cursor from "./Cursor"
import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap"
import PageTransition from "./PageTransition"
import ScrollProgress from "./ScrollProgress"

type RevealKind = "up" | "fade" | "scale" | "left" | "right" | "clip"

const FROM: Record<RevealKind, gsap.TweenVars> = {
	up: { y: 48, opacity: 0 },
	fade: { opacity: 0 },
	scale: { scale: 0.92, opacity: 0 },
	left: { x: -60, opacity: 0 },
	right: { x: 60, opacity: 0 },
	clip: { clipPath: "inset(18% 12% 18% 12% round 2rem)", opacity: 0 },
}

const TO: Record<RevealKind, gsap.TweenVars> = {
	up: { y: 0, opacity: 1 },
	fade: { opacity: 1 },
	scale: { scale: 1, opacity: 1 },
	left: { x: 0, opacity: 1 },
	right: { x: 0, opacity: 1 },
	clip: { clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 },
}

/** Procura elementos [data-reveal] ainda não animados e liga-os ao scroll. */
function scanReveals() {
	const els = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])")
	if (!els.length) return

	if (prefersReducedMotion()) {
		els.forEach((el) => {
			el.dataset.revealed = "1"
			gsap.set(el, { opacity: 1 })
		})
		return
	}

	const groups = new Map<RevealKind, HTMLElement[]>()
	els.forEach((el) => {
		el.dataset.revealed = "1"
		const kind = (el.dataset.reveal || "up") as RevealKind
		const key = kind in FROM ? kind : "up"
		groups.set(key, [...(groups.get(key) ?? []), el])
	})

	groups.forEach((items, kind) => {
		gsap.set(items, FROM[kind])
		ScrollTrigger.batch(items, {
			start: "top 90%",
			once: true,
			onEnter: (batch) =>
				gsap.to(batch, {
					...TO[kind],
					duration: kind === "clip" ? 1.4 : 1.1,
					stagger: 0.09,
					ease: "expo.out",
					delay: Number((batch[0] as HTMLElement).dataset.revealDelay ?? 0),
					overwrite: true,
				}),
		})
	})
}

export function refreshReveals() {
	if (typeof window !== "undefined") window.dispatchEvent(new Event("reveal:scan"))
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const lenisRef = useRef<Lenis | null>(null)

	// Lenis + sincronização com ScrollTrigger
	useEffect(() => {
		if (prefersReducedMotion()) return
		const lenis = new Lenis({
			duration: 1.15,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			anchors: { offset: -80 },
			autoRaf: false,
		})
		lenisRef.current = lenis
		lenis.on("scroll", ScrollTrigger.update)
		const tick = (time: number) => lenis.raf(time * 1000)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)
		return () => {
			gsap.ticker.remove(tick)
			lenis.destroy()
			lenisRef.current = null
		}
	}, [])

	// Em cada página: topo, revelações e recálculo dos triggers
	useEffect(() => {
		if (!window.location.hash) {
			lenisRef.current?.scrollTo(0, { immediate: true })
		}
		scanReveals()
		const onScan = () => scanReveals()
		window.addEventListener("reveal:scan", onScan)

		const refresh = () => ScrollTrigger.refresh()
		const t = window.setTimeout(refresh, 300)
		window.addEventListener("load", refresh)
		document.fonts?.ready.then(refresh)

		return () => {
			window.clearTimeout(t)
			window.removeEventListener("reveal:scan", onScan)
			window.removeEventListener("load", refresh)
		}
	}, [pathname])

	return (
		<>
			<ScrollProgress />
			{children}
			<PageTransition />
			<Cursor />
		</>
	)
}
