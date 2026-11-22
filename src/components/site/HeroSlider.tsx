"use client"

import { ArrowDown, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/components/motion/gsap"
import { QUOTE_HREF } from "@/content/site"
import type { HeroSlideRecord } from "@/types/event"

const DURATION = 7 // segundos por destaque

const isVideo = (url?: string) => !!url && /\.(mp4|webm|mov)(\?|$)/i.test(url)
const isExternal = (url?: string) => !!url && /^https?:\/\//.test(url)

export default function HeroSlider({
	slides,
	eyebrow = "Global Services Corporation",
}: {
	slides: HeroSlideRecord[]
	eyebrow?: string
}) {
	const root = useRef<HTMLElement>(null)
	const [index, setIndex] = useState(0)
	const [paused, setPaused] = useState(false)
	const prev = useRef(0)
	const touchX = useRef<number | null>(null)
	const count = slides.length

	const go = useCallback(
		(next: number) => setIndex(((next % count) + count) % count),
		[count]
	)

	// Intro + parallax de saída ao fazer scroll.
	useGSAP(
		() => {
			if (prefersReducedMotion()) return
			gsap.from("[data-hero-ui]", {
				y: 30,
				opacity: 0,
				stagger: 0.08,
				duration: 1.2,
				delay: 0.5,
			})
			gsap.to("[data-hero-content]", {
				yPercent: -25,
				opacity: 0,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "top top", end: "bottom 30%", scrub: true },
			})
			gsap.to("[data-hero-media]", {
				yPercent: 18,
				scale: 1.08,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
			})
		},
		{ scope: root }
	)

	// Transição entre destaques.
	useGSAP(
		() => {
			const slidesEls = gsap.utils.toArray<HTMLElement>("[data-slide]", root.current)
			const current = slidesEls[index]
			const old = slidesEls[prev.current]
			if (!current) return
			const reduced = prefersReducedMotion()

			slidesEls.forEach((el, i) => {
				if (i !== index && i !== prev.current) gsap.set(el, { autoAlpha: 0, zIndex: 0 })
			})

			const img = current.querySelector("[data-slide-img]")
			const title = current.querySelector<HTMLElement>("[data-slide-title]")
			const rest = current.querySelectorAll("[data-slide-fade]")

			if (reduced) {
				gsap.set(current, { autoAlpha: 1, zIndex: 2 })
				if (old && old !== current) gsap.set(old, { autoAlpha: 0, zIndex: 0 })
				return
			}

			const tl = gsap.timeline()
			if (old && old !== current) {
				gsap.set(old, { zIndex: 1 })
				tl.to(old.querySelectorAll("[data-slide-title], [data-slide-fade]"), {
					y: -30,
					opacity: 0,
					duration: 0.5,
					stagger: 0.03,
					ease: "power2.in",
				})
			}
			tl.set(current, { autoAlpha: 1, zIndex: 2 })
			tl.fromTo(
				current,
				{ clipPath: "inset(0 0 0 100%)" },
				{ clipPath: "inset(0 0 0 0%)", duration: 1.3, ease: "expo.inOut" },
				old && old !== current ? "-=0.15" : 0
			)
			tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: DURATION + 1.5, ease: "power1.out" }, "<")

			let split: SplitText | undefined
			if (title) {
				gsap.set([title, ...rest], { opacity: 1, y: 0 })
				split = SplitText.create(title, { type: "words,lines", mask: "lines" })
				tl.from(split.lines, { yPercent: 115, duration: 1.2, stagger: 0.09 }, "<0.55")
				tl.from(rest, { y: 24, opacity: 0, stagger: 0.08, duration: 1 }, "<0.25")
			}
			if (old && old !== current) tl.set(old, { autoAlpha: 0, zIndex: 0 })

			prev.current = index
			return () => split?.revert()
		},
		{ scope: root, dependencies: [index] }
	)

	// Barra de progresso + avanço automático.
	useGSAP(
		() => {
			if (count < 2) return
			const bar = root.current?.querySelector(`[data-progress="${index}"]`)
			gsap.set("[data-progress]", { scaleX: 0 })
			const tween = gsap.fromTo(
				bar ?? {},
				{ scaleX: 0 },
				{ scaleX: 1, duration: DURATION, ease: "none", onComplete: () => go(index + 1) }
			)
			if (paused) tween.pause()
			return () => tween.kill()
		},
		{ scope: root, dependencies: [index, paused, count] }
	)

	useEffect(() => {
		const onVis = () => setPaused(document.hidden)
		document.addEventListener("visibilitychange", onVis)
		return () => document.removeEventListener("visibilitychange", onVis)
	}, [])

	if (!count) return null

	return (
		<section
			ref={root}
			aria-roledescription="carrossel"
			aria-label="Destaques"
			className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink text-white"
			onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
			onTouchEnd={(e) => {
				if (touchX.current === null) return
				const dx = e.changedTouches[0].clientX - touchX.current
				if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
				touchX.current = null
			}}>
			<div data-hero-media className="absolute inset-0">
				{slides.map((s, i) => {
					const Title = i === 0 ? "h1" : "h2"
					return (
					<div
						key={s.id}
						data-slide
						aria-hidden={i !== index}
						className="absolute inset-0"
						style={{ visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 0 }}>
						<div data-slide-img className="absolute inset-0">
							{isVideo(s.videoUrl) ? (
								<video
									src={s.videoUrl}
									poster={s.imageUrl}
									autoPlay
									muted
									loop
									playsInline
									className="h-full w-full object-cover"
								/>
							) : (
								<Image
									src={s.imageUrl}
									alt=""
									fill
									priority={i === 0}
									sizes="100vw"
									className="object-cover"
								/>
							)}
						</div>
						<div
							className="absolute inset-0"
							style={{
								background:
									s.overlay ||
									"linear-gradient(100deg, rgb(7 11 22 / 0.92) 0%, rgb(7 11 22 / 0.65) 45%, rgb(7 11 22 / 0.2) 100%)",
							}}
						/>
						<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />

						<div
							data-hero-content
							className="container-x relative flex h-full flex-col justify-end pt-32 pb-40 sm:justify-center sm:pb-24">
							<div className="max-w-4xl">
								<span data-slide-fade className="eyebrow text-accent">
									{eyebrow}
								</span>
								<Title
									data-slide-title
									className="display-xl mt-5 text-balance"
									style={{ fontSize: s.title.length > 45 ? "clamp(2.2rem, 5.6vw, 5.25rem)" : undefined }}>
									{s.title}
								</Title>
								{s.description && (
									<p
										data-slide-fade
										className="mt-6 line-clamp-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
										{s.description}
									</p>
								)}
								{s.link && (
									<div data-slide-fade className="mt-9 flex flex-wrap gap-3">
										<Link
											href={s.link}
											target={isExternal(s.link) ? "_blank" : undefined}
											className="btn btn-light">
											{s.buttonText || "Saber mais"} <ArrowUpRight className="h-4 w-4" />
										</Link>
										<Link href={QUOTE_HREF} className="btn btn-outline-light">
											Pedir cotação de seguro
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
					)
				})}
			</div>

			{/* Navegação */}
			<div className="absolute inset-x-0 bottom-0 z-10">
				<div className="container-x flex items-end justify-between gap-6 pb-8">
					{count > 1 && (
						<div
							className="grid flex-1 gap-3 sm:max-w-3xl"
							style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
							onMouseEnter={() => setPaused(true)}
							onMouseLeave={() => setPaused(false)}>
							{slides.map((s, i) => (
								<button
									key={s.id}
									data-hero-ui
									type="button"
									onClick={() => go(i)}
									aria-label={`Ir para o destaque ${i + 1}: ${s.title}`}
									aria-current={i === index}
									className="group flex flex-col gap-3 pt-3 text-left">
									<span className="relative h-[2px] w-full overflow-hidden bg-white/20">
										<span
											data-progress={i}
											className={`absolute inset-0 origin-left ${i < index ? "bg-white/60" : "bg-accent"}`}
											style={{ transform: "scaleX(0)" }}
										/>
									</span>
									<span
										className={`hidden text-xs leading-snug transition-colors sm:line-clamp-1 ${
											i === index ? "text-white" : "text-white/45 group-hover:text-white/80"
										}`}>
										<span className="mr-2 tabular-nums">0{i + 1}</span>
										{s.title}
									</span>
								</button>
							))}
						</div>
					)}
					<a
						href="#a-seguir"
						data-hero-ui
						aria-label="Descer"
						className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full ring-1 ring-white/25 transition-colors hover:bg-white hover:text-ink md:flex">
						<ArrowDown className="h-5 w-5 animate-bounce" />
					</a>
				</div>
			</div>
			<span id="a-seguir" className="absolute bottom-0" />
		</section>
	)
}
