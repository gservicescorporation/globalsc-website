"use client"

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { gsap, useGSAP } from "@/components/motion/gsap"
import SplitReveal from "@/components/motion/SplitReveal"
import type { ServiceItem } from "@/types/content"

/**
 * Desktop: secção fixa (pinned) com scroll horizontal dos serviços.
 * Mobile: cartões empilhados que se sobrepõem ao descer.
 */
export default function Services({ services: SERVICES }: { services: ServiceItem[] }) {
	const root = useRef<HTMLElement>(null)
	const track = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia()

			mm.add(
				"(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
				() => {
					const el = track.current!
					const distance = () => el.scrollWidth - window.innerWidth
					const tween = gsap.to(el, {
						x: () => -distance(),
						ease: "none",
						scrollTrigger: {
							trigger: root.current,
							start: "top top",
							end: () => `+=${distance()}`,
							pin: true,
							scrub: 1,
							invalidateOnRefresh: true,
						},
					})

					// Imagem de cada cartão com parallax horizontal dentro do scroll.
					gsap.utils.toArray<HTMLElement>("[data-service-img]").forEach((img) => {
						gsap.fromTo(
							img,
							{ xPercent: -12 },
							{
								xPercent: 12,
								ease: "none",
								scrollTrigger: {
									trigger: img.closest("[data-service]"),
									containerAnimation: tween,
									start: "left right",
									end: "right left",
									scrub: true,
								},
							}
						)
					})

					gsap.to("[data-services-progress]", {
						scaleX: 1,
						ease: "none",
						scrollTrigger: {
							trigger: root.current,
							start: "top top",
							end: () => `+=${distance()}`,
							scrub: true,
						},
					})
				}
			)

			mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
				const cards = gsap.utils.toArray<HTMLElement>("[data-service]")
				cards.forEach((card, i) => {
					if (i === cards.length - 1) return
					gsap.to(card, {
						scale: 0.92,
						opacity: 0.5,
						ease: "none",
						scrollTrigger: {
							trigger: cards[i + 1],
							start: "top bottom",
							end: "top 20%",
							scrub: true,
						},
					})
				})
			})

			return () => mm.revert()
		},
		{ scope: root }
	)

	return (
		<section
			ref={root}
			id="servicos"
			className="relative overflow-clip bg-ink text-white lg:h-screen">
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
			<div
				aria-hidden
				className="pointer-events-none absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-royal/30 blur-[160px]"
			/>

			<div
				ref={track}
				className="relative flex flex-col gap-6 px-[var(--gutter)] py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:py-0">
				{/* Introdução */}
				<div className="flex flex-col justify-center lg:w-[34vw] lg:pr-10">
					<span className="eyebrow text-accent">O que fazemos</span>
					<SplitReveal className="display-lg mt-6 text-balance">
						Seguros primeiro.{" "}
						<span className="serif-accent text-white/60">E tudo o que a empresa precisa a seguir.</span>
					</SplitReveal>
					<p className="mt-6 max-w-md text-white/60">
						A mediação de seguros é o nosso núcleo. À volta dela, formação, eventos e
						comunicação com o mesmo interlocutor.
					</p>
					<div className="mt-10 hidden h-px w-64 overflow-hidden bg-white/15 lg:block">
						<div data-services-progress className="h-full origin-left scale-x-0 bg-accent" />
					</div>
				</div>

				{SERVICES.map((s, i) => (
					<article
						key={s.id}
						data-service
						className="group sticky top-24 flex min-h-[70vh] flex-col overflow-hidden rounded-[2rem] bg-night ring-1 ring-white/10 lg:static lg:h-[72vh] lg:min-h-0 lg:w-[min(560px,42vw)] lg:shrink-0">
						<div className="relative h-56 overflow-hidden sm:h-72 lg:h-[46%]">
							<div data-service-img className="absolute inset-[-10%]">
								<Image
									src={s.image}
									alt={s.title}
									fill
									sizes="(max-width: 1024px) 100vw, 560px"
									className="object-cover opacity-80 transition-transform duration-[1.2s] group-hover:scale-105"
								/>
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
							<span className="absolute top-5 left-6 text-sm font-semibold text-white/70 tabular-nums">
								{String(i + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-4 p-7 sm:p-9">
							<div className="flex items-center gap-4">
								<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
									<Image src={s.icon} alt="" width={28} height={28} className="h-7 w-7" />
								</span>
								<h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{s.title}</h3>
							</div>
							<p className="leading-relaxed text-white/60">{s.description}</p>
							<ul className="mt-auto flex flex-wrap gap-2 pt-4">
								{s.tags.map((t) => (
									<li
										key={t}
										className="rounded-full px-3 py-1 text-xs text-white/70 ring-1 ring-white/15">
										{t}
									</li>
								))}
							</ul>
						</div>
					</article>
				))}

				{/* Remate */}
				<div className="flex items-center justify-center py-10 lg:w-[30vw] lg:py-0">
					<Link
						href="/contact-us"
						className="group flex flex-col items-center gap-5 text-center">
						<span className="flex h-28 w-28 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">
							<ArrowUpRight className="h-8 w-8" />
						</span>
						<span className="text-xl font-semibold">Pedir uma proposta</span>
					</Link>
				</div>
			</div>
		</section>
	)
}
