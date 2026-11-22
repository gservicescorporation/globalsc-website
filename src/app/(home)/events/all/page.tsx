import type { Metadata } from "next"
import PageHero from "@/components/site/PageHero"
import { getPublishedEvents } from "@/server/events"
import EventsExplorer from "./EventsExplorer"

export const revalidate = 300

export const metadata: Metadata = {
	title: "Todos os eventos",
	description:
		"Arquivo completo dos eventos corporativos organizados pela Global Services Corporation em Angola.",
	alternates: { canonical: "https://www.globalsc.ao/events/all" },
}

export default async function AllEventsPage() {
	const events = await getPublishedEvents()
	return (
		<>
			<PageHero
				eyebrow="Arquivo de eventos"
				title={
					<>
						Todos os nossos <span className="serif-accent text-white/60">eventos.</span>
					</>
				}
				text="Pesquise por nome, filtre por ano ou categoria e reviva cada edição."
			/>
			<EventsExplorer events={events} />
		</>
	)
}
