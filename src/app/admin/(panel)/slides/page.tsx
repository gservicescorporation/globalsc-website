import { hasDatabase } from "@/lib"
import { getAllSlides } from "@/server/slides"
import SlidesManager from "../../_components/SlidesManager"

export const dynamic = "force-dynamic"
export const metadata = { title: "Destaques" }

export default async function SlidesPage() {
	const slides = await getAllSlides().catch(() => [])
	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Destaques do topo</h1>
				<p className="mt-1 text-sm text-tertiary">
					Os slides em ecrã inteiro da página inicial e da página de eventos. Sem destaques registados, o site usa os
					predefinidos.
				</p>
			</div>
			<SlidesManager initial={slides} readOnly={!hasDatabase()} />
		</div>
	)
}
