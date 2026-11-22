"use client"

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { useRef, type ReactNode } from "react"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"

/** Moldura de um assistente passo-a-passo: progresso, conteúdo animado e navegação grande. */
export function WizardShell({
	steps,
	current,
	children,
	onBack,
	onNext,
	nextLabel = "Continuar",
	nextDisabled,
	busy,
	hint,
}: {
	steps: string[]
	current: number
	children: ReactNode
	onBack?: () => void
	onNext?: () => void
	nextLabel?: string
	nextDisabled?: boolean
	busy?: boolean
	hint?: ReactNode
}) {
	const body = useRef<HTMLDivElement>(null)

	// Cada passo entra com um deslize suave e os elementos em cascata.
	useGSAP(
		() => {
			if (prefersReducedMotion() || !body.current) return
			gsap.fromTo(body.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" })
			gsap.fromTo(
				body.current.querySelectorAll("[data-stagger]"),
				{ y: 24, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "expo.out", delay: 0.05 }
			)
		},
		{ dependencies: [current] }
	)

	const pct = ((current + 1) / steps.length) * 100

	return (
		<div className="mx-auto w-full max-w-3xl">
			{/* Progresso */}
			<div className="mb-8">
				<div className="flex items-center justify-between text-sm">
					<span className="font-semibold text-ink">
						Passo {current + 1} de {steps.length}
					</span>
					<span className="text-tertiary">{steps[current]}</span>
				</div>
				<div className="mt-3 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={steps.length}>
					<div className="h-full rounded-full bg-royal transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
				</div>
			</div>

			<div ref={body} key={current}>
				{children}
			</div>

			{(onBack || onNext) && (
				<div className="sticky bottom-0 z-10 -mx-4 mt-10 flex items-center gap-3 border-t border-line bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="flex h-14 items-center gap-2 rounded-2xl border border-line bg-white px-5 text-base font-semibold text-ink active:scale-[0.98]">
							<ArrowLeft className="h-5 w-5" /> <span className="max-sm:sr-only">Voltar</span>
						</button>
					)}
					{onNext && (
						<button
							type="button"
							onClick={onNext}
							disabled={nextDisabled || busy}
							className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-6 text-base font-semibold text-white transition-colors hover:bg-royal active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40">
							{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
							{nextLabel}
							{!busy && <ArrowRight className="h-5 w-5" />}
						</button>
					)}
				</div>
			)}
			{hint && <p className="mt-4 text-center text-sm text-tertiary">{hint}</p>}
		</div>
	)
}

export function StepTitle({ title, text }: { title: string; text?: string }) {
	return (
		<div className="mb-8" data-stagger>
			<h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
			{text && <p className="mt-3 text-lg text-tertiary">{text}</p>}
		</div>
	)
}

/** Cartão de escolha grande (toque fácil no telemóvel). */
export function ChoiceCard({
	selected,
	onClick,
	icon,
	title,
	text,
	badge,
}: {
	selected: boolean
	onClick: () => void
	icon?: ReactNode
	title: string
	text?: string
	badge?: string
}) {
	return (
		<button
			type="button"
			data-stagger
			onClick={onClick}
			aria-pressed={selected}
			className={`group relative flex min-h-24 w-full items-center gap-4 rounded-3xl p-5 text-left ring-2 transition-all duration-300 active:scale-[0.99] sm:p-6 ${
				selected ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line hover:ring-royal"
			}`}>
			{icon && (
				<span
					className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors ${
						selected ? "bg-accent text-ink" : "bg-royal/10 text-royal"
					}`}>
					{icon}
				</span>
			)}
			<span className="min-w-0 flex-1">
				<span className="flex flex-wrap items-center gap-2 text-lg font-semibold">
					{title}
					{badge && (
						<span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${selected ? "bg-white/15 text-white" : "bg-accent/20 text-royal"}`}>{badge}</span>
					)}
				</span>
				{text && <span className={`mt-1 block text-sm ${selected ? "text-white/70" : "text-tertiary"}`}>{text}</span>}
			</span>
			<span
				className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 transition-all ${
					selected ? "bg-accent text-ink ring-accent" : "ring-line"
				}`}>
				{selected && <Check className="h-4 w-4" />}
			</span>
		</button>
	)
}

export const bigInput =
	"h-14 w-full rounded-2xl border-2 border-line bg-white px-4 text-lg text-ink outline-none transition focus:border-royal focus:ring-4 focus:ring-royal/10 placeholder:text-muted"

export function BigField({
	label,
	hint,
	optional,
	children,
}: {
	label: string
	hint?: string
	optional?: boolean
	children: ReactNode
}) {
	return (
		<label className="flex flex-col gap-2" data-stagger>
			<span className="text-base font-semibold text-ink">
				{label} {optional && <span className="font-normal text-muted">(opcional)</span>}
			</span>
			{children}
			{hint && <span className="text-sm text-tertiary">{hint}</span>}
		</label>
	)
}

/** Reduz fotografias grandes no próprio telemóvel antes de enviar (máx. 2000px, JPEG). */
export async function compressImage(file: File, max = 2000, quality = 0.82): Promise<File> {
	if (!file.type.startsWith("image/") || file.type === "image/gif") return file
	try {
		const bitmap = await createImageBitmap(file)
		const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
		if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file
		const canvas = document.createElement("canvas")
		canvas.width = Math.round(bitmap.width * scale)
		canvas.height = Math.round(bitmap.height * scale)
		canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
		const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality))
		if (!blob) return file
		return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
	} catch {
		return file
	}
}

/** Pergunta à API se o email/telefone já é cliente (só sim/não). */
export async function lookupEmail(email: string): Promise<boolean> {
	try {
		const res = await fetch("/api/public/lookup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ contact: email }),
		})
		if (!res.ok) return false
		return Boolean((await res.json()).known)
	} catch {
		return false
	}
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Faz scroll até ao início do assistente, descontando o header fixo. */
export function scrollToWizard() {
	const el = document.getElementById("assistente")
	if (!el) return
	window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" })
}
