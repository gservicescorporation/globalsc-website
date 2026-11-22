import {
	PDFCheckBox,
	PDFDocument,
	PDFDropdown,
	PDFOptionList,
	PDFRadioGroup,
	PDFTextField,
} from "pdf-lib"
import { UTApi, UTFile } from "uploadthing/server"

export interface PdfField {
	name: string
	type: "texto" | "caixa" | "lista" | "opcao" | "outro"
	options?: string[]
}

async function loadPdf(url: string) {
	const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
	if (!res.ok) throw new Error("Não foi possível descarregar o PDF do modelo.")
	return PDFDocument.load(await res.arrayBuffer(), { ignoreEncryption: true })
}

/** Lê os campos preenchíveis (AcroForm) de um PDF. */
export async function extractPdfFields(url: string): Promise<PdfField[]> {
	const pdf = await loadPdf(url)
	return pdf
		.getForm()
		.getFields()
		.map((f): PdfField => {
			const name = f.getName()
			if (f instanceof PDFTextField) return { name, type: "texto" }
			if (f instanceof PDFCheckBox) return { name, type: "caixa" }
			if (f instanceof PDFDropdown || f instanceof PDFOptionList) return { name, type: "lista", options: f.getOptions() }
			if (f instanceof PDFRadioGroup) return { name, type: "opcao", options: f.getOptions() }
			return { name, type: "outro" }
		})
}

const truthy = (v: string) => /^(sim|s|yes|true|x|1|✓)$/i.test(v.trim())

/** Preenche o PDF com os valores, guarda-o no UploadThing e devolve o URL. */
export async function fillPdfAndUpload(url: string, values: Record<string, string>, fileName: string) {
	const pdf = await loadPdf(url)
	const form = pdf.getForm()
	const skipped: string[] = []

	for (const [name, value] of Object.entries(values)) {
		if (!value?.trim()) continue
		try {
			const field = form.getField(name)
			if (field instanceof PDFTextField) field.setText(value)
			else if (field instanceof PDFCheckBox) {
				if (truthy(value)) field.check()
				else field.uncheck()
			}
			else if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
				const opt = field.getOptions().find((o) => o.toLowerCase() === value.trim().toLowerCase())
				if (opt) field.select(opt)
				else skipped.push(name)
			} else if (field instanceof PDFRadioGroup) {
				const opt = field.getOptions().find((o) => o.toLowerCase() === value.trim().toLowerCase())
				if (opt) field.select(opt)
				else skipped.push(name)
			} else skipped.push(name)
		} catch {
			skipped.push(name)
		}
	}

	const bytes = await pdf.save()
	if (!process.env.UPLOADTHING_TOKEN) throw new Error("Uploads não configurados (UPLOADTHING_TOKEN).")
	const utapi = new UTApi()
	const result = await utapi.uploadFiles(new UTFile([new Uint8Array(bytes)], fileName, { type: "application/pdf" }))
	if (result.error || !result.data) throw new Error("Falha ao guardar o PDF preenchido.")
	return { url: result.data.ufsUrl, skipped }
}
