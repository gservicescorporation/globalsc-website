"use client"

import { Check, FileUp, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { useUploadThing } from "@/app/admin/_components/upload"
import { BigField, bigInput } from "./Wizard"

export interface Declared {
	insurer: string
	policyNumber: string
	endDate: string
	documentUrl: string
}

export const emptyDeclared: Declared = { insurer: "", policyNumber: "", endDate: "", documentUrl: "" }

/**
 * "Já tem seguro?" — para clientes que já têm apólice (connosco ou noutra mediadora)
 * mas ainda não estão na nossa base de dados. Tudo opcional.
 */
export default function DeclaredPolicy({
	value,
	onChange,
	question = "Já tem este seguro noutra seguradora?",
}: {
	value: Declared
	onChange: (v: Declared) => void
	question?: string
}) {
	const [open, setOpen] = useState(Boolean(value.insurer || value.policyNumber || value.documentUrl))
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState("")
	const input = useRef<HTMLInputElement>(null)
	const { startUpload } = useUploadThing("publicUpload")

	const upload = async (file?: File) => {
		if (!file) return
		setError("")
		setUploading(true)
		try {
			const res = await startUpload([file])
			if (res?.[0]) onChange({ ...value, documentUrl: res[0].ufsUrl })
			else setError("Não foi possível enviar o ficheiro.")
		} catch {
			setError("Não foi possível enviar o ficheiro.")
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className="rounded-3xl bg-white p-5 ring-2 ring-line sm:p-6" data-stagger>
			<p className="text-base font-semibold text-ink">{question}</p>
			<div className="mt-4 grid grid-cols-2 gap-3">
				{[
					{ v: true, l: "Sim" },
					{ v: false, l: "Não" },
				].map((o) => (
					<button
						key={o.l}
						type="button"
						onClick={() => {
							setOpen(o.v)
							if (!o.v) onChange({ insurer: "", policyNumber: "", endDate: "", documentUrl: "" })
						}}
						aria-pressed={open === o.v}
						className={`h-14 rounded-2xl text-base font-semibold ring-2 transition ${
							open === o.v ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line"
						}`}>
						{o.l}
					</button>
				))}
			</div>

			{open && (
				<div className="mt-6 grid gap-5">
					<p className="text-sm text-tertiary">
						Assim comparamos com o que já paga e tratamos da transição. Preencha só o que souber.
					</p>
					<BigField label="Seguradora atual" optional>
						<input className={bigInput} value={value.insurer} onChange={(e) => onChange({ ...value, insurer: e.target.value })} placeholder="ex.: nome da seguradora" />
					</BigField>
					<div className="grid gap-5 sm:grid-cols-2">
						<BigField label="Nº da apólice" optional>
							<input className={bigInput} value={value.policyNumber} onChange={(e) => onChange({ ...value, policyNumber: e.target.value })} />
						</BigField>
						<BigField label="Termina em" optional>
							<input type="date" className={bigInput} value={value.endDate} onChange={(e) => onChange({ ...value, endDate: e.target.value })} />
						</BigField>
					</div>
					<div data-stagger>
						{value.documentUrl ? (
							<div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-emerald-800">
								<span className="flex items-center gap-2 font-medium">
									<Check className="h-5 w-5" /> Documento da apólice anexado
								</span>
								<button type="button" onClick={() => onChange({ ...value, documentUrl: "" })} aria-label="Remover documento" className="rounded-full p-2 hover:bg-emerald-100">
									<X className="h-5 w-5" />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => input.current?.click()}
								disabled={uploading}
								className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-background text-base font-semibold text-ink hover:border-royal disabled:opacity-60">
								{uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
								{uploading ? "A enviar…" : "Anexar a apólice (PDF ou foto)"}
							</button>
						)}
						{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
						<input ref={input} type="file" accept="application/pdf,image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
					</div>
				</div>
			)}
		</div>
	)
}
