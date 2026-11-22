"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useLayoutEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "./gsap"

/**
 * Cortina entre páginas: ao clicar num link interno, um painel sobe e cobre o ecrã;
 * depois da nova página montar, continua a subir e revela-a.
 */
export default function PageTransition() {
	const router = useRouter()
	const pathname = usePathname()
	const curtain = useRef<HTMLDivElement>(null)
	const covering = useRef(false)

	const reveal = () => {
		if (!covering.current) return
		covering.current = false
		const el = curtain.current!
		gsap.timeline({ delay: 0.15 })
			.to(el.querySelector("[data-curtain-logo]"), { y: -30, opacity: 0, duration: 0.3 })
			.to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.1")
			.set(el, { autoAlpha: 0, yPercent: 100 })
	}

	// Posição inicial gerida só pelo GSAP (um transform em CSS somar-se-ia ao yPercent).
	useLayoutEffect(() => {
		gsap.set(curtain.current, { yPercent: 100, autoAlpha: 0 })
	}, [])

	// Sair: interceta cliques em links internos (fase de captura, antes do <Link>).
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (prefersReducedMotion() || e.defaultPrevented || e.button !== 0) return
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
			const a = (e.target as HTMLElement | null)?.closest("a")
			if (!a || a.target === "_blank" || a.hasAttribute("download")) return
			const url = new URL(a.href, window.location.href)
			if (url.origin !== window.location.origin) return
			if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) return
			if (url.pathname === window.location.pathname) return // âncoras/mesma página
			e.preventDefault()
			const el = curtain.current!
			covering.current = true
			gsap.killTweensOf(el)
			gsap.timeline()
				.set(el, { yPercent: 100, autoAlpha: 1 })
				.to(el, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
				.from(el.querySelector("[data-curtain-logo]"), { y: 30, opacity: 0, duration: 0.4 }, "-=0.25")
				.add(() => {
					router.push(url.pathname + url.search + url.hash)
					// Salvaguarda: se a rota não mudar (erro, redirect para a mesma página), recolhe.
					window.setTimeout(reveal, 4000)
				})
		}
		window.addEventListener("click", onClick, true)
		return () => window.removeEventListener("click", onClick, true)
	}, [router])

	// Entrar: assim que a nova rota monta, revela-a.
	useLayoutEffect(() => {
		reveal()
	}, [pathname])

	return (
		<div
			ref={curtain}
			aria-hidden
			className="pointer-events-none invisible fixed inset-0 z-80 flex items-center justify-center bg-ink">
			<div aria-hidden className="grid-lines absolute inset-0" />
			<div data-curtain-logo className="relative">
				<Image src="/logo/white.png" alt="" width={1000} height={912} className="h-auto w-28" />
			</div>
		</div>
	)
}
