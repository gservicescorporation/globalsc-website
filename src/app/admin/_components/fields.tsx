"use client"

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, FileText, ImagePlus, Link2, Loader2, Plus, Trash2, X } from "lucide-react"
import { useId, useRef, useState, type ReactNode } from "react"
import { toast } from "react-toastify"
import { endpointFor, useUploadThing } from "./upload"

export const inputCls =
	"w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-royal focus:ring-4 focus:ring-royal/10 placeholder:text-muted"

const isVideo = (u: string) => /\.(mp4|mov|webm)(\?|$)/i.test(u)

export function Field({
	label,
	hint,
	children,
	className = "",
}: {
	label: string
	hint?: string
	children: ReactNode
	className?: string
}) {
	return (
		<label className={`flex flex-col gap-1.5 text-sm ${className}`}>
			<span className="font-medium text-ink">{label}</span>
			{children}
			{hint && <span className="text-xs text-muted">{hint}</span>}
		</label>
	)
}

export function TextInput({
	label,
	hint,
	value,
	onChange,
	className,
	...rest
}: {
	label: string
	hint?: string
	value: string | number | undefined
	onChange: (v: string) => void
	className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
	return (
		<Field label={label} hint={hint} className={className}>
			<input {...rest} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls} />
		</Field>
	)
}

export function TextArea({
	label,
	hint,
	value,
	onChange,
	rows = 4,
	className,
}: {
	label: string
	hint?: string
	value: string | undefined
	onChange: (v: string) => void
	rows?: number
	className?: string
}) {
	return (
		<Field label={label} hint={hint} className={className}>
			<textarea
				rows={rows}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
				className={`${inputCls} resize-y leading-relaxed`}
			/>
		</Field>
	)
}

export function Toggle({
	label,
	hint,
	checked,
	onChange,
}: {
	label: string
	hint?: string
	checked: boolean
	onChange: (v: boolean) => void
}) {
	return (
		<label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-line bg-white p-4">
			<span>
				<span className="block text-sm font-medium text-ink">{label}</span>
				{hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
			</span>
			<span className="relative mt-0.5 inline-flex shrink-0">
				<input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
				<span className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-royal peer-focus-visible:ring-4 peer-focus-visible:ring-royal/20" />
				<span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
			</span>
		</label>
	)
}

export function ColorInput({
	label,
	value,
	onChange,
}: {
	label: string
	value: string
	onChange: (v: string) => void
}) {
	// Suporta #rrggbbaa: o seletor nativo edita só a cor; a opacidade mantém-se.
	const hex = /^#[0-9a-f]{6}/i.test(value) ? value.slice(0, 7) : "#242565"
	const alpha = /^#[0-9a-f]{8}$/i.test(value) ? value.slice(7) : ""
	return (
		<Field label={label} hint="Formato #RRGGBB ou #RRGGBBAA (com transparência).">
			<div className="flex items-center gap-2">
				<input
					type="color"
					value={hex}
					onChange={(e) => onChange(e.target.value + alpha)}
					className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-line bg-white p-1"
				/>
				<input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
			</div>
		</Field>
	)
}

/* ------------------------------ Imagens ------------------------------ */

/** Envia ficheiros para o UploadThing e devolve os URLs públicos. */
function useUploader(accept: string) {
	const [progress, setProgress] = useState<number | null>(null)
	const { startUpload } = useUploadThing(endpointFor(accept), {
		onUploadProgress: (p) => setProgress(p),
	})
	const run = async (files: File[]): Promise<string[]> => {
		setProgress(0)
		try {
			const res = await startUpload(files)
			return (res ?? []).map((r) => r.ufsUrl)
		} catch (err) {
			toast.error((err as Error).message || "Falha no upload.")
			return []
		} finally {
			setProgress(null)
		}
	}
	return { progress, run }
}

function Preview({ src, className = "", doc = false }: { src: string; className?: string; doc?: boolean }) {
	if (!src) return null
	if (doc || /\.pdf(\?|$)/i.test(src))
		return (
			<a href={src} target="_blank" rel="noreferrer" className={`flex h-full w-full flex-col items-center justify-center gap-1 bg-white text-royal ${className}`}>
				<FileText className="h-8 w-8" />
				<span className="text-xs font-medium">PDF</span>
			</a>
		)
	return isVideo(src) ? (
		<video src={src} muted className={`h-full w-full object-cover ${className}`} />
	) : (
		// eslint-disable-next-line @next/next/no-img-element
		<img src={src} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
	)
}

export function ImageField({
	label,
	hint,
	value,
	onChange,
	accept = "image/*",
	aspect = "aspect-video",
}: {
	label: string
	hint?: string
	value: string
	onChange: (v: string) => void
	accept?: string
	aspect?: string
}) {
	const id = useId()
	const input = useRef<HTMLInputElement>(null)
	const { progress, run } = useUploader(accept)

	const onFiles = async (files: FileList | null) => {
		if (!files?.length) return
		const [url] = await run([files[0]])
		if (url) onChange(url)
	}

	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<span className="font-medium text-ink">{label}</span>
			<div
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault()
					onFiles(e.dataTransfer.files)
				}}
				className={`group relative overflow-hidden rounded-2xl border-2 border-dashed border-line bg-background ${aspect}`}>
				{value ? (
					<>
						<Preview src={value} doc={accept === "application/pdf"} />
						<button
							type="button"
							onClick={() => onChange("")}
							aria-label="Remover"
							className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100">
							<X className="h-4 w-4" />
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={() => input.current?.click()}
						className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition hover:text-royal">
						<ImagePlus className="h-6 w-6" />
						<span className="text-xs">Clique ou arraste um ficheiro</span>
					</button>
				)}
				{progress !== null && (
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 text-xs font-medium text-ink">
						<Loader2 className="h-5 w-5 animate-spin text-royal" /> {progress}%
					</div>
				)}
			</div>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
					<input
						id={id}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder="…ou cole o URL"
						className={`${inputCls} pl-9`}
					/>
				</div>
				<button
					type="button"
					onClick={() => input.current?.click()}
					className="shrink-0 rounded-xl border border-line bg-white px-3 text-xs font-medium hover:border-royal hover:text-royal">
					Carregar
				</button>
			</div>
			{hint && <span className="text-xs text-muted">{hint}</span>}
			<input ref={input} type="file" accept={accept} hidden onChange={(e) => onFiles(e.target.files)} />
		</div>
	)
}

export function ImageListField({
	label,
	hint,
	value,
	onChange,
	accept = "image/*,video/mp4",
	tileClass = "aspect-[4/3]",
	contain = false,
}: {
	label: string
	hint?: string
	value: string[]
	onChange: (v: string[]) => void
	accept?: string
	tileClass?: string
	contain?: boolean
}) {
	const input = useRef<HTMLInputElement>(null)
	const { progress, run } = useUploader(accept)
	const [pasting, setPasting] = useState(false)
	const [pasted, setPasted] = useState("")

	const onFiles = async (files: FileList | null) => {
		if (!files?.length) return
		const urls = await run(Array.from(files))
		if (urls.length) onChange([...value, ...urls])
	}

	const move = (i: number, d: number) => {
		const j = i + d
		if (j < 0 || j >= value.length) return
		const next = [...value]
		;[next[i], next[j]] = [next[j], next[i]]
		onChange(next)
	}

	return (
		<div className="flex flex-col gap-2 text-sm">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<span className="font-medium text-ink">
					{label} <span className="font-normal text-muted">({value.length})</span>
				</span>
				<div className="flex gap-2">
					<button type="button" onClick={() => setPasting((v) => !v)} className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium hover:border-royal hover:text-royal">
						Colar URLs
					</button>
					<button type="button" onClick={() => input.current?.click()} className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-royal">
						Carregar ficheiros
					</button>
				</div>
			</div>
			{hint && <span className="text-xs text-muted">{hint}</span>}

			{pasting && (
				<div className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3">
					<textarea
						rows={3}
						value={pasted}
						onChange={(e) => setPasted(e.target.value)}
						placeholder="Um URL por linha"
						className={inputCls}
					/>
					<button
						type="button"
						onClick={() => {
							const urls = pasted.split(/\s+/).map((s) => s.trim()).filter(Boolean)
							onChange([...value, ...urls])
							setPasted("")
							setPasting(false)
						}}
						className="self-end rounded-lg bg-royal px-3 py-1.5 text-xs font-medium text-white">
						Adicionar
					</button>
				</div>
			)}

			<div
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault()
					onFiles(e.dataTransfer.files)
				}}
				className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-dashed border-line bg-background p-3 sm:grid-cols-3 lg:grid-cols-4">
				{value.map((src, i) => (
					<div key={`${src}-${i}`} className={`group relative overflow-hidden rounded-xl bg-white ring-1 ring-line ${tileClass}`}>
						{contain ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={src} alt="" loading="lazy" className="h-full w-full object-contain p-3" />
						) : (
							<Preview src={src} doc={accept === "application/pdf"} />
						)}
						<span className="absolute top-1.5 left-1.5 rounded-md bg-ink/70 px-1.5 text-[10px] font-semibold text-white">{i + 1}</span>
						<div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
							<div className="flex gap-1">
								<button type="button" aria-label="Mover para trás" onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-ink shadow">
									<ChevronLeft className="h-4 w-4" />
								</button>
								<button type="button" aria-label="Mover para a frente" onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-ink shadow">
									<ChevronRight className="h-4 w-4" />
								</button>
							</div>
							<button type="button" aria-label="Remover" onClick={() => onChange(value.filter((_, k) => k !== i))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white shadow">
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>
					</div>
				))}
				<button
					type="button"
					onClick={() => input.current?.click()}
					className={`flex flex-col items-center justify-center gap-1 rounded-xl text-muted transition hover:bg-white hover:text-royal ${tileClass}`}>
					{progress !== null ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin text-royal" />
							<span className="text-xs">{progress}%</span>
						</>
					) : (
						<>
							<Plus className="h-5 w-5" />
							<span className="text-xs">Adicionar</span>
						</>
					)}
				</button>
			</div>
			<input ref={input} type="file" multiple accept={accept} hidden onChange={(e) => onFiles(e.target.files)} />
		</div>
	)
}

/* ------------------------------ Repetidor ------------------------------ */

export function Repeater<T>({
	label,
	items,
	onChange,
	create,
	render,
	itemTitle,
	addLabel = "Adicionar",
}: {
	label: string
	items: T[]
	onChange: (v: T[]) => void
	create: () => T
	render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode
	itemTitle: (item: T, index: number) => string
	addLabel?: string
}) {
	const update = (i: number, patch: Partial<T>) =>
		onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)))
	const move = (i: number, d: number) => {
		const j = i + d
		if (j < 0 || j >= items.length) return
		const next = [...items]
		;[next[i], next[j]] = [next[j], next[i]]
		onChange(next)
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-ink">
					{label} <span className="font-normal text-muted">({items.length})</span>
				</span>
				<button type="button" onClick={() => onChange([...items, create()])} className="flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-royal">
					<Plus className="h-3.5 w-3.5" /> {addLabel}
				</button>
			</div>
			{items.length === 0 && (
				<p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">Nenhum item ainda.</p>
			)}
			{items.map((item, i) => (
				<details key={i} open={items.length <= 3} className="group rounded-2xl border border-line bg-white">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
						<span className="truncate text-sm font-medium text-ink">
							<span className="mr-2 text-muted tabular-nums">{i + 1}.</span>
							{itemTitle(item, i) || "Sem título"}
						</span>
						<span className="flex shrink-0 gap-1" onClick={(e) => e.preventDefault()}>
							<button type="button" aria-label="Subir" onClick={() => move(i, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background">
								<ArrowUp className="h-3.5 w-3.5" />
							</button>
							<button type="button" aria-label="Descer" onClick={() => move(i, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background">
								<ArrowDown className="h-3.5 w-3.5" />
							</button>
							<button type="button" aria-label="Remover" onClick={() => onChange(items.filter((_, k) => k !== i))} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</span>
					</summary>
					<div className="grid gap-4 border-t border-line p-4">{render(item, (p) => update(i, p), i)}</div>
				</details>
			))}
		</div>
	)
}

export function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
	return (
		<section className="rounded-3xl border border-line bg-white p-5 sm:p-7">
			<header className="mb-5">
				<h2 className="text-base font-semibold text-ink">{title}</h2>
				{description && <p className="mt-1 text-sm text-muted">{description}</p>}
			</header>
			<div className="grid gap-5">{children}</div>
		</section>
	)
}
