"use client"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import SplitReveal from "@/components/motion/SplitReveal"

const isVideo = (f: string) => /\.(mp4|mov|webm)(\?|$)/i.test(f)
const PAGE = 18

/** Galeria em colunas com parallax a velocidades diferentes + lightbox. */
export default function EventGallery({ images, title }: { images: string[]; title: string }) {
	const root = useRef<HTMLElement>(null)
	const dialog = useRef<HTMLDialogElement>(null)
	const [visible, setVisible] = useState(PAGE)
	const [active, setActive] = useState<number | null>(null)

	const shown = images.slice(0, visible)
	const columns = useMemo(() => {
		const cols: { src: string; i: number }[][] = [[], [], []]
		shown.forEach((src, i) => cols[i % 3].push({ src, i }))
		return cols
	}, [shown])

	useGSAP(
		() => {
			const mm = gsap.matchMedia()
			mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
				gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, i) => {
					gsap.fromTo(
						col,
						{ y: [60, -40, 120][i] },
						{
							y: [-60, 40, -120][i],
							ease: "none",
							scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
						}
					)
				})
			})
			if (!prefersReducedMotion()) {
				gsap.fromTo(
					"[data-shot]:not([data-shown])",
					{ opacity: 0, scale: 0.94 },
					{
						opacity: 1,
						scale: 1,
						stagger: 0.04,
						duration: 1,
						onStart() {
							gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((el) => (el.dataset.shown = "1"))
						},
						scrollTrigger: { trigger: "[data-gallery-grid]", start: "top 85%", once: true },
					}
				)
			}
			return () => mm.revert()
		},
		{ scope: root, dependencies: [visible] }
	)

	const open = (i: number) => {
		setActive(i)
		dialog.current?.showModal()
	}
	const close = () => {
		dialog.current?.close()
		setActive(null)
	}
	const step = useCallback(
		(d: number) => setActive((a) => (a === null ? a : (a + d + images.length) % images.length)),
		[images.length]
	)

	useEffect(() => {
		if (active === null) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") step(1)
			if (e.key === "ArrowLeft") step(-1)
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [active, step])

	return (
		<section ref={root} className="section-y overflow-hidden bg-ink text-white">
			<div className="container-x">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl">
						<span className="eyebrow text-accent">Principais momentos</span>
						<SplitReveal className="display-lg mt-6 text-balance">
							Galeria <span className="serif-accent text-white/60">do evento.</span>
						</SplitReveal>
					</div>
					<p className="max-w-sm text-white/60">{images.length} fotografias e vídeos desta edição.</p>
				</div>

				<div data-gallery-grid className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
					{columns.map((col, c) => (
						<div key={c} data-col className={`flex flex-col gap-3 sm:gap-4 ${c === 2 ? "max-md:hidden" : ""}`}>
							{col.map(({ src, i }) => (
								<button
									key={`${src}-${i}`}
									data-shot
									data-cursor="Ampliar"
									type="button"
									onClick={() => open(i)}
									aria-label={`Abrir imagem ${i + 1}`}
									className={`group relative overflow-hidden rounded-2xl bg-night ${
										i % 4 === 0 ? "aspect-[3/4]" : i % 4 === 2 ? "aspect-square" : "aspect-[4/3]"
									}`}>
									{isVideo(src) ? (
										<video src={src} muted loop playsInline autoPlay className="h-full w-full object-cover" />
									) : (
										<Image
											src={src}
											alt={`${title} — momento ${i + 1}`}
											fill
											sizes="(max-width: 768px) 50vw, 33vw"
											className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110"
										/>
									)}
									<span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
								</button>
							))}
						</div>
					))}
				</div>
				{/* No mobile a 3ª coluna fica oculta: repomos essas imagens nas 2 primeiras via lista simples. */}
				<div className="mt-3 grid grid-cols-2 gap-3 md:hidden">
					{columns[2].map(({ src, i }) => (
						<button
							key={`m-${src}-${i}`}
							type="button"
							onClick={() => open(i)}
							aria-label={`Abrir imagem ${i + 1}`}
							className="relative aspect-square overflow-hidden rounded-2xl bg-night">
							{isVideo(src) ? (
								<video src={src} muted loop playsInline autoPlay className="h-full w-full object-cover" />
							) : (
								<Image src={src} alt={`${title} — momento ${i + 1}`} fill sizes="50vw" className="object-cover" />
							)}
						</button>
					))}
				</div>

				{visible < images.length && (
					<div className="mt-14 flex justify-center">
						<button type="button" onClick={() => setVisible((v) => v + PAGE)} className="btn btn-outline-light">
							Ver mais momentos ({images.length - visible})
						</button>
					</div>
				)}
			</div>

			<dialog
				ref={dialog}
				onClose={() => setActive(null)}
				onClick={(e) => e.target === dialog.current && close()}
				className="m-0 h-full max-h-none w-full max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
				data-lenis-prevent>
				{active !== null && (
					<div className="relative flex h-full w-full items-center justify-center p-4 sm:p-12">
						<div className="relative h-full w-full">
							{isVideo(images[active]) ? (
								<video src={images[active]} controls autoPlay className="h-full w-full object-contain" />
							) : (
								<Image
									src={images[active]}
									alt={`${title} — momento ${active + 1}`}
									fill
									sizes="100vw"
									className="object-contain"
								/>
							)}
						</div>
						<span className="absolute top-5 left-5 text-sm text-white/60 tabular-nums">
							{active + 1} / {images.length}
						</span>
						<button onClick={close} aria-label="Fechar" className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
							<X className="h-5 w-5" />
						</button>
						<button onClick={() => step(-1)} aria-label="Anterior" className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-6">
							<ChevronLeft className="h-5 w-5" />
						</button>
						<button onClick={() => step(1)} aria-label="Seguinte" className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6">
							<ChevronRight className="h-5 w-5" />
						</button>
					</div>
				)}
			</dialog>
		</section>
	)
}
