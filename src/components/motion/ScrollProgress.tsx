"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "./gsap"

/** Fina barra de progresso da leitura no topo do ecrã. */
export default function ScrollProgress() {
	const ref = useRef<HTMLDivElement>(null)
	useGSAP(() => {
		gsap.to(ref.current, {
			scaleX: 1,
			ease: "none",
			scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
		})
	})
	return (
		<div
			ref={ref}
			aria-hidden
			className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-royal via-accent to-gold"
		/>
	)
}
