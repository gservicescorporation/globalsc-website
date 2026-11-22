"use client"

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import Magnetic from "@/components/motion/Magnetic"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import { contactLinks, NAV_LINKS, QUOTE_HREF, type SiteChrome } from "@/content/site"

export default function Footer({ chrome }: { chrome: SiteChrome }) {
	const CONTACTS = contactLinks(chrome.contacts)
	const SOCIALS = chrome.socials
	const ref = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			if (prefersReducedMotion()) return
			// Marca gigante ligada ao scroll: as duas linhas deslizam em sentidos opostos
			// e o brilho percorre as letras enquanto o rodapé entra no ecrã.
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: "[data-wordmark]",
					start: "top bottom",
					end: "bottom bottom",
					scrub: 1,
				},
			})
			tl.fromTo("[data-wm-line='1']", { xPercent: -18, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0)
				.fromTo("[data-wm-line='2']", { xPercent: 18, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "none" }, 0)
				.fromTo("[data-wm-shine]", { attr: { x1: "-60%", x2: "-20%" } }, { attr: { x1: "100%", x2: "140%" }, ease: "none" }, 0)
			gsap.from("[data-foot-col]", {
				y: 40,
				opacity: 0,
				stagger: 0.08,
				scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
			})
		},
		{ scope: ref }
	)

	const wordmark = ["GLOBAL SERVICES", "CORPORATION"]

	return (
		<footer ref={ref} className="relative overflow-hidden bg-ink text-white">
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
			<div
				aria-hidden
				className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-royal/25 blur-[140px]"
			/>

			<div className="container-x relative pt-24 pb-10 sm:pt-32">
				{/* CTA */}
				<div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end">
					<div data-foot-col className="max-w-3xl">
						<span className="eyebrow text-accent">Mediação de seguros</span>
						<h2 className="display-lg mt-5">
							Está a pagar pelo seguro certo?{" "}
							<span className="serif-accent text-white/60">Compare connosco.</span>
						</h2>
					</div>
					<div data-foot-col>
						<Magnetic>
							<Link
								href={QUOTE_HREF}
								className="group flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-full bg-accent text-center text-sm font-semibold text-ink transition-transform duration-500 hover:scale-105 sm:h-44 sm:w-44">
								<ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45" />
								Pedir cotação
							</Link>
						</Magnetic>
					</div>
				</div>

				{/* Colunas */}
				<div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
					<div data-foot-col className="lg:col-span-4">
						<Image
							src="/logo/white.png"
							alt="Global Services Corporation"
							width={1000}
							height={912}
							className="h-auto w-28"
						/>
						<p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
							Mediação de seguros para empresas e particulares em Angola. Também
							formação, eventos corporativos e comunicação.
						</p>
					</div>

					<div data-foot-col className="lg:col-span-2">
						<h3 className="eyebrow text-white/40">Navegar</h3>
						<ul className="mt-5 flex flex-col gap-3 text-sm">
							{NAV_LINKS.map((l) => (
								<li key={l.name}>
									<Link
										href={l.href}
										target={l.external ? "_blank" : undefined}
										className="text-white/80 transition-colors hover:text-accent">
										{l.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div data-foot-col className="lg:col-span-3">
						<h3 className="eyebrow text-white/40">Contactos</h3>
						<ul className="mt-5 flex flex-col gap-3 text-sm">
							{[...CONTACTS.phones, ...CONTACTS.emails].map((c) => (
								<li key={c.href}>
									<a href={c.href} className="text-white/80 transition-colors hover:text-accent">
										{c.label}
									</a>
								</li>
							))}
							<li className="text-white/50">{CONTACTS.address}</li>
						</ul>
					</div>

					<div data-foot-col className="lg:col-span-3">
						<h3 className="eyebrow text-white/40">Siga-nos</h3>
						<ul className="mt-5 flex flex-col gap-2">
							{SOCIALS.map((s) => (
								<li key={s.name}>
									<a
										href={s.href}
										target="_blank"
										rel="noreferrer"
										className="group flex items-center justify-between border-b border-white/10 py-2.5 text-sm text-white/80 transition-colors hover:text-white">
										{s.name}
										<ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent" />
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Marca gigante */}
				<div data-wordmark aria-hidden className="flex flex-col gap-1 overflow-hidden select-none">
					<svg width="0" height="0" className="absolute">
						<defs>
							{/* Gradiente "brilho" animado pelo scroll (x1/x2). */}
							<linearGradient id="wm-shine" data-wm-shine gradientUnits="userSpaceOnUse" x1="-60%" x2="-20%" y1="0" y2="0">
								<stop offset="0" stopColor="#fff" stopOpacity="0.06" />
								<stop offset="0.5" stopColor="#51b7ff" stopOpacity="0.35" />
								<stop offset="1" stopColor="#fff" stopOpacity="0.06" />
							</linearGradient>
						</defs>
					</svg>
					{wordmark.map((line, i) => {
						// Tamanho escolhido para a largura natural ≈ 1000 (o textLength só afina).
						const size = i === 0 ? 100 : 128
						return (
							<svg key={line} data-wm-line={i + 1} viewBox={`0 0 1000 ${Math.round(size * 0.9)}`} className="block w-full">
								<text
									x="0"
									y={Math.round(size * 0.8)}
									textLength="1000"
									lengthAdjust="spacingAndGlyphs"
									fill="url(#wm-shine)"
									className="font-extrabold"
									style={{ fontSize: size, letterSpacing: "-0.04em" }}>
									{line}
								</text>
							</svg>
						)
					})}
				</div>

				<div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
					<p>© {new Date().getFullYear()} Global Services Corporation. Todos os direitos reservados.</p>
					<p>Luanda · Angola</p>
				</div>
			</div>
		</footer>
	)
}
