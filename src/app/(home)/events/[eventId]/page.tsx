import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { getEventBySlugOrId } from "@/server/events"
import EventAbout from "./components/EventAbout"
import EventFaq from "./components/EventFaq"
import EventGallery from "./components/EventGallery"
import EventHero from "./components/EventHero"
import EventLogos from "./components/EventLogos"
import EventSpeakers from "./components/EventSpeakers"
import EventTickets from "./components/EventTickets"
import EventVenue from "./components/EventVenue"
import EventWhy from "./components/EventWhy"

export const revalidate = 300

type Params = { params: Promise<{ eventId: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { eventId } = await params
	const event = await getEventBySlugOrId(eventId)
	if (!event) return { title: "Evento não encontrado" }
	const description = event.description.slice(0, 160)
	const image = event.coverUrl || event.theme.imgUrl
	return {
		title: event.title,
		description,
		alternates: { canonical: `https://www.globalsc.ao/events/${event.slug}` },
		openGraph: {
			title: event.title,
			description,
			type: "article",
			url: `https://www.globalsc.ao/events/${event.slug}`,
			images: image ? [{ url: image, alt: event.title }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: event.title,
			description,
			images: image ? [image] : undefined,
		},
	}
}

export default async function EventPage({ params }: Params) {
	const { eventId } = await params
	const event = await getEventBySlugOrId(eventId)
	if (!event) notFound()
	if (decodeURIComponent(eventId) !== event.slug) permanentRedirect(`/events/${event.slug}`)

	const today = new Date().toISOString().slice(0, 10)
	const passed = event.startDate < today

	const style = {
		"--ev-primary": event.theme.primary || "#242565",
		"--ev-secondary": event.theme.secondary || "#0049af",
	} as React.CSSProperties

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.title,
		description: event.description,
		startDate: event.startTime ? `${event.startDate}T${event.startTime}` : event.startDate,
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		image: [event.coverUrl || event.theme.imgUrl].filter(Boolean),
		location: {
			"@type": "Place",
			name: event.location,
			address: { "@type": "PostalAddress", streetAddress: event.venue.address || event.location, addressCountry: "AO" },
		},
		organizer: {
			"@type": "Organization",
			name: "Global Services Corporation",
			url: "https://www.globalsc.ao",
		},
		...(event.ticketsEnabled && event.tickets.length
			? {
					offers: event.tickets.map((t) => ({
						"@type": "Offer",
						name: t.ticketName,
						price: t.price,
						priceCurrency: "AOA",
						url: `https://www.globalsc.ao/events/${event.slug}/get-ticket`,
					})),
				}
			: {}),
	}

	return (
		<div style={style}>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<EventHero event={event} passed={passed} />
			<EventAbout event={event} />
			{!passed && event.whySign.enabled && event.whySign.debates.length > 0 && <EventWhy event={event} />}
			{passed && event.gallery.length > 0 && <EventGallery images={event.gallery} title={event.title} />}
			{event.speakers.speakers.length > 0 && <EventSpeakers block={event.speakers} />}
			{event.partners.logos.length > 0 && <EventLogos block={event.partners} />}
			{event.sponsors.logos.length > 0 && <EventLogos block={event.sponsors} tone="paper" />}
			{!passed && event.ticketsEnabled && event.tickets.length > 0 && <EventTickets event={event} />}
			{!passed && (event.venue.address || event.venue.images.length > 0) && <EventVenue event={event} />}
			{!passed && event.faqs.questions.length > 0 && <EventFaq faqs={event.faqs.questions} />}
		</div>
	)
}
