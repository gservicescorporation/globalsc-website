"use client"

import { useRef, type ElementType, type ReactNode } from "react"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "./gsap"

/** Texto grande cujas palavras "acendem" conforme o scroll avança. */
export default function ScrubText({
	as: Tag = "p",
	children,
	className,
	dim = 0.14,
}: {
	as?: ElementType
	children: ReactNode
	className?: string
	dim?: number
}) {
	const ref = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			const el = ref.current
			if (!el || prefersReducedMotion()) return
			const split = SplitText.create(el, {
				type: "words",
				autoSplit: true,
				onSplit(self) {
					return gsap.fromTo(
						self.words,
						{ opacity: dim },
						{
							opacity: 1,
							ease: "none",
							stagger: 0.1,
							scrollTrigger: {
								trigger: el,
								start: "top 80%",
								end: "bottom 45%",
								scrub: 0.6,
							},
						}
					)
				},
			})
			return () => split.revert()
		},
		{ scope: ref }
	)

	return (
		<Tag ref={ref} className={className}>
			{children}
		</Tag>
	)
}
