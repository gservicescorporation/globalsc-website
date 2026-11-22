"use client"

import { generateReactHelpers } from "@uploadthing/react"
import type { UploadRouter } from "@/app/api/uploadthing/core"

export const { useUploadThing } = generateReactHelpers<UploadRouter>()

/** "document" = PDFs; "media" = imagens e vídeos; "image" = só imagens. */
export const endpointFor = (accept: string) =>
	accept.includes("pdf") ? ("document" as const) : accept.includes("video") ? ("media" as const) : ("image" as const)
