import { ArrowUpRight, Check, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SplitReveal from "@/components/motion/SplitReveal"
import Tilt from "@/components/motion/Tilt"
import { CLAIM_HREF, QUOTE_HREF } from "@/content/site"
import type { SiteContent, TitledText } from "@/types/content"
import StepsTimeline from "./StepsTimeline"

type Insurance = SiteContent["insurance"]

/** Destaque da mediação de seguros (produto principal). */
export function InsuranceHighlight({
	insurance,
	showPageLink = true,
}: {
	insurance: Insurance
	showPageLink?: boolean
}) {
	return (
		<section id="seguros" className="section-y scroll-mt-20 bg-paper">
			<div className="container-x grid gap-14 lg:grid-cols-12">
				<div className={insurance.lines.length ? "lg:col-span-5" : "lg:col-span-8"}>
					<div className="lg:sticky lg:top-32">
						<span data-reveal="fade" className="eyebrow text-royal">
							Mediação de seguros
						</span>
						<SplitReveal className="display-lg mt-6 text-balance text-ink">
							O seguro certo,{" "}
							<span className="serif-accent text-royal">escolhido do seu lado.</span>
						</SplitReveal>
						{insurance.intro && (
							<p data-reveal className="mt-6 text-lg leading-relaxed text-tertiary">
								{insurance.intro}
							</p>
						)}
						{insurance.benefits.length > 0 && (
							<ul className="mt-8 grid gap-3">
								{insurance.benefits.map((b) => (
									<li key={b} data-reveal className="flex gap-3 text-ink">
										<Check className="mt-1 h-4 w-4 shrink-0 text-royal" />
										<span>{b}</span>
									</li>
								))}
							</ul>
						)}
						{insurance.partners.logos.length > 0 && (
							<div data-reveal className="mt-10">
								<p className="text-xs font-semibold tracking-widest text-muted uppercase">
									{insurance.partners.title}
								</p>
								<ul className="mt-4 flex flex-wrap items-center gap-3">
									{insurance.partners.logos.slice(0, 8).map((logo) => (
										<li key={logo} className="flex h-14 w-28 items-center justify-center rounded-xl bg-background px-3 ring-1 ring-line">
											<Image src={logo} alt="Seguradora parceira" width={200} height={100} className="h-8 w-auto object-contain" />
										</li>
									))}
								</ul>
							</div>
						)}
						<div data-reveal className="mt-10 flex flex-wrap gap-3">
							<Link href={QUOTE_HREF} className="btn btn-dark">
								Pedir cotação <ArrowUpRight className="h-4 w-4" />
							</Link>
							{showPageLink && (
								<Link href="/seguros" className="btn btn-outline-dark">
									Ver todos os seguros
								</Link>
							)}
							<Link href={CLAIM_HREF} className="btn btn-outline-dark">
								Participar sinistro
							</Link>
						</div>
					</div>
				</div>

				{insurance.lines.length > 0 && (
					<div className="lg:col-span-7">
						<InsuranceLines lines={insurance.lines} />
					</div>
				)}
			</div>
		</section>
	)
}

export function InsuranceLines({ lines }: { lines: TitledText[] }) {
	return (
		<ul className="grid gap-4 sm:grid-cols-2" style={{ perspective: "1200px" }}>
			{lines.map((l, i) => (
				<li key={`${l.title}-${i}`} data-reveal="up" data-reveal-delay={(i % 2) * 0.06}>
					<Tilt
						className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl p-6 ring-1 transition-colors duration-500 sm:p-7 ${
							i === 0 ? "bg-ink text-white ring-ink" : "bg-background text-ink ring-line hover:bg-ink hover:text-white"
						}`}>
						{/* Brilho que segue o cursor (posição via variáveis CSS do Tilt) */}
						<span
							aria-hidden
							className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							style={{
								background:
									"radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgb(81 183 255 / 0.18), transparent 60%)",
							}}
						/>
						<span
							className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-500 ${
								i === 0 ? "bg-accent text-ink" : "bg-royal/10 text-royal group-hover:bg-accent group-hover:text-ink"
							}`}>
							<ShieldCheck className="h-5 w-5" />
						</span>
						<h3 className="relative text-xl font-semibold tracking-tight">{l.title}</h3>
						<p
							className={`relative text-sm leading-relaxed transition-colors duration-500 ${
								i === 0 ? "text-white/65" : "text-tertiary group-hover:text-white/65"
							}`}>
							{l.text}
						</p>
					</Tilt>
				</li>
			))}
		</ul>
	)
}

export function InsuranceSteps({ steps }: { steps: TitledText[] }) {
	if (!steps.length) return null
	return (
		<section className="section-y relative overflow-hidden bg-ink text-white">
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
			<div className="container-x relative">
				<span data-reveal="fade" className="eyebrow text-accent">
					Como trabalhamos
				</span>
				<SplitReveal className="display-lg mt-6 max-w-3xl text-balance">
					Do pedido ao sinistro,{" "}
					<span className="serif-accent text-white/60">sempre o mesmo interlocutor.</span>
				</SplitReveal>
				<StepsTimeline steps={steps} />
				<Link data-reveal href={QUOTE_HREF} className="btn btn-light mt-14">
					Começar pela análise <ArrowUpRight className="h-4 w-4" />
				</Link>
			</div>
		</section>
	)
}
