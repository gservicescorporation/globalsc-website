import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getSession } from "@/server/auth"
import { clientIp, rateLimit } from "@/server/rate-limit"

const f = createUploadthing()

async function adminOnly() {
	const session = await getSession()
	if (!session) throw new UploadThingError("Não autorizado")
	return { userId: session.sub }
}

/** Rotas de upload do painel (só administradores autenticados). */
export const uploadRouter = {
	/** Imagens: capas, galerias, oradores, logótipos, destaques. */
	image: f({ image: { maxFileSize: "16MB", maxFileCount: 50 } })
		.middleware(adminOnly)
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

	/** PDFs (documentos de seguradoras, apólices, modelos de participação). */
	document: f({ pdf: { maxFileSize: "32MB", maxFileCount: 20 }, image: { maxFileSize: "16MB", maxFileCount: 20 } })
		.middleware(adminOnly)
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

	/**
	 * Fotografias de sinistros e apólices enviadas por clientes (sem conta).
	 * Público, mas limitado por IP: até 12 imagens e 2 PDFs por envio.
	 */
	publicUpload: f({ image: { maxFileSize: "16MB", maxFileCount: 12 }, pdf: { maxFileSize: "16MB", maxFileCount: 2 } })
		.middleware(async ({ req }) => {
			if (!rateLimit(`claim-upload:${clientIp(req)}`, 40, 60 * 60_000)) {
				throw new UploadThingError("Demasiados envios. Tente mais tarde.")
			}
			return { public: true }
		})
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),

	/** Imagens e vídeos curtos (galeria de momentos, vídeo "Sobre"). */
	media: f({
		image: { maxFileSize: "16MB", maxFileCount: 50 },
		video: { maxFileSize: "256MB", maxFileCount: 5 },
	})
		.middleware(adminOnly)
		.onUploadComplete(({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
