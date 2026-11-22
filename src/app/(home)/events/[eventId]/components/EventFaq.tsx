"use client"

import { Plus } from "lucide-react"
import { useRef, useState } from "react"
import { gsap, useGSAP } from "@/components/motion/gsap"
import SplitReveal from "@/components/motion/SplitReveal"
import type { Faq } from "@/types/event"

export default function EventFaq({ faqs }: { faqs: Faq[] }) {
	const root = useRef<HTMLElement>(null)
	const [open, setOpen] = useState<number | null>(0)

	useGSAP(
		() => {
			gsap.utils.toArray<HTMLElement>("[data-answer]").forEach((el, i) => {
				gsap.to(el, {
					height: i === open ? "auto" : 0,
					opacity: i === open ? 1 : 0,
					duration: 0.6,
					ease: "expo.out",
				})
			})
		},
		{ scope: root, dependencies: [open] }
	)

	return (
		<section ref={root} className="section-y bg-background">
			<div className="container-x grid gap-12 lg:grid-cols-12">
				<div className="lg:col-span-4">
					<div className="lg:sticky lg:top-32">
						<span className="eyebrow" style={{ color: "var(--ev-secondary)" }}>
							Tudo o que precisa de saber
						</span>
						<SplitReveal className="display-lg mt-6 text-ink">Perguntas frequentes</SplitReveal>
					</div>
				</div>
				<ul className="divide-y divide-line border-y border-line lg:col-span-8">
					{faqs.map((f, i) => {
						const isOpen = open === i
						return (
							<li key={`${f.question}-${i}`} data-reveal>
								<h3>
									<button
										type="button"
										aria-expanded={isOpen}
										aria-controls={`faq-${i}`}
										onClick={() => setOpen(isOpen ? null : i)}
										className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold text-ink sm:text-xl">
										{f.question}
										<span
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-line transition-all duration-500 ${
												isOpen ? "rotate-45 bg-ink text-white ring-ink" : ""
											}`}>
											<Plus className="h-4 w-4" />
										</span>
									</button>
								</h3>
								<div
									id={`faq-${i}`}
									data-answer
									role="region"
									className="overflow-hidden"
									style={{ height: i === 0 ? "auto" : 0, opacity: i === 0 ? 1 : 0 }}>
									<p className="max-w-3xl pb-6 leading-relaxed text-tertiary">{f.answer}</p>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</section>
	)
}
