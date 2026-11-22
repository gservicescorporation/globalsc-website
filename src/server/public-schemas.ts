import { z } from "zod"

/** Só aceitamos ficheiros carregados pelo nosso próprio upload (UploadThing). */
export const isOurUpload = (url: string) => {
	try {
		const host = new URL(url).hostname
		return host === "utfs.io" || host.endsWith(".ufs.sh")
	} catch {
		return false
	}
}

/** Seguro que o cliente já tem (opcional). Todos os campos podem vir vazios. */
export const DeclaredSchema = z
	.object({
		insurer: z.string().max(160).default(""),
		policyNumber: z.string().max(120).default(""),
		endDate: z.string().max(10).default(""),
		documentUrl: z
			.string()
			.max(1000)
			.default("")
			.refine((u) => !u || isOurUpload(u), "Documento inválido."),
	})
	.nullable()
	.default(null)
	.transform((d) => (d && (d.insurer || d.policyNumber || d.endDate || d.documentUrl) ? d : null))
