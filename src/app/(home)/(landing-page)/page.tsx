import HeroSlider from "@/components/site/HeroSlider"
import EventsShowcase from "@/components/site/EventsShowcase"
import { InsuranceHighlight } from "@/components/site/Insurance"
import PartnersMarquee from "@/components/site/PartnersMarquee"
import { getSiteContent } from "@/server/content"
import { getPublishedEvents, splitByDate } from "@/server/events"
import { getSlidesFor } from "@/server/slides"
import About from "./components/About"
import Academy from "./components/Academy"
import Intro from "./components/Intro"
import Services from "./components/Services"

export const revalidate = 300

export default async function LandingPage() {
	const [slides, events, content] = await Promise.all([
		getSlidesFor("home"),
		getPublishedEvents(),
		getSiteContent(),
	])
	const { upcoming, past } = splitByDate(events)

	return (
		<>
			<HeroSlider slides={slides} />
			{/* Produto principal logo a seguir ao topo */}
			<InsuranceHighlight insurance={content.insurance} />
			<Intro manifesto={content.home.manifesto} stats={content.home.stats} />
			{content.services.length > 0 && <Services services={content.services} />}
			<About story={content.about.story} advantages={content.about.advantages} showLink />
			<Academy academy={content.academy} />
			{events.length > 0 && (
				<EventsShowcase
					eyebrow="Eventos"
					title={
						<>
							Os nossos <span className="serif-accent text-royal">eventos.</span>
						</>
					}
					text="Fóruns, mesas redondas e encontros de networking com decisores do sector público e privado."
					events={[...upcoming, ...past]}
				/>
			)}
			<PartnersMarquee logos={content.partners.logos} title={content.partners.title} />
		</>
	)
}
