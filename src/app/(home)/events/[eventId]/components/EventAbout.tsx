import Image from "next/image"
import Parallax from "@/components/motion/Parallax"
import ScrubText from "@/components/motion/ScrubText"
import type { EventRecord } from "@/types/event"

const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url)
const ytEmbed = (url: string) => {
	const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1]
	return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : url
}

export default function EventAbout({ event }: { event: EventRecord }) {
	const text = event.about.description || event.description
	const [lead, ...rest] = text.split(/(?<=\.)\s+/)
	const video = event.about.videoUrl
	const image = event.about.imgUrl || event.coverUrl

	return (
		<section id="sobre" className="section-y scroll-mt-20 bg-background">
			<div className="container-x">
				<span data-reveal="fade" className="eyebrow" style={{ color: "var(--ev-secondary)" }}>
					Sobre o evento
				</span>
				<ScrubText className="display-md mt-8 max-w-6xl text-ink">{lead}</ScrubText>

				<div className="mt-16 grid items-start gap-12 lg:grid-cols-12">
					{rest.length > 0 && (
						<div className="lg:col-span-5">
							<p data-reveal className="text-lg leading-relaxed text-tertiary">
								{rest.join(" ")}
							</p>
						</div>
					)}
					<div className={rest.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
						<div data-reveal="clip" className="relative aspect-video overflow-hidden rounded-[2rem] bg-ink">
							{video ? (
								isYouTube(video) ? (
									<iframe
										src={ytEmbed(video)}
										title={`Vídeo — ${event.title}`}
										allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
										loading="lazy"
										className="absolute inset-0 h-full w-full"
									/>
								) : (
									<video
										src={video}
										poster={image || undefined}
										controls
										autoPlay
										muted
										loop
										playsInline
										className="absolute inset-0 h-full w-full object-cover"
									/>
								)
							) : image ? (
								<Parallax className="absolute inset-0" speed={8} scale={1.15}>
									<div className="absolute inset-0">
										<Image
											src={image}
											alt={event.title}
											fill
											sizes="(max-width: 1024px) 100vw, 60vw"
											className="object-cover"
										/>
									</div>
								</Parallax>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
