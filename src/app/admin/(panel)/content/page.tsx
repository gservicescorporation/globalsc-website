import { hasDatabase } from "@/lib"
import { getSiteContent } from "@/server/content"
import ContentEditor from "../../_components/ContentEditor"

export const dynamic = "force-dynamic"
export const metadata = { title: "Conteúdo do site" }

export default async function ContentPage() {
	const content = await getSiteContent()
	return <ContentEditor initial={content} readOnly={!hasDatabase()} />
}
