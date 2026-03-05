"use client"

import { Autoplay, EffectFade, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import { PlayCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

interface SlidesProps {
	imgUrl: string
	title: string
	description: string
	videoUrl: string
	color: string
	soon?: boolean
	link?: string
}

export default function EventsHero() {
	const [play, setPlay] = useState(false)

	const slides: SlidesProps[] = [
		{
			imgUrl: "/images/events/mr-nov-2024.jpg",
			title:
				"4ª Edição da Mesa Redonda com CEO’s 2024 - Leadership Innovation In The Oil And Gas Sector",
			description:
				"Este evento reuniu líderes e executivos do setor de óleo e gás para discutir as tendências, desafios e oportunidades no mercado angolano.",
			videoUrl: "https://www.youtube.com/embed/_llumWA1rBE?autoplay=1&rel=0",
			color: "from-primary/90 to-orange-700/80",
		},
		{
			imgUrl: "https://ik.imagekit.io/globalsc/seminario-sme/1.jpeg",
			title: "Seminário para os Efectivos do SME alusivo ao 45º Aniversário",
			description:
				"No âmbito das comemorações do 45º aniversário do Serviço de Migração e Estrangeiros (SME), a instituição promoveu um conjunto de sessões de formação e treinamento voltadas para o desenvolvimento das competências de chefia, liderança e gestão de equipas entre os seus efetivos.",

			videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
			color: "from-[#0049AF]/80 to-[#a5b8d6]/80",
		},
		{
			imgUrl: "https://ik.imagekit.io/globalsc/mr-edicao-fib/23.jpg",
			title: "Mesa Redonda com CEOs – Edição FIB",
			description:
				"A Mesa Redonda com CEOs – Edição FIB realizou-se com grande sucesso durante a Feira Internacional de Benguela, reunindo líderes empresariais, investidores e representantes institucionais para um debate de alto nível sobre o desenvolvimento económico e a nova dinâmica da liderança em Angola.",

			videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
			color: "from-[#0049AF]/80 to-[#a5b8d6]/80",
		},
		{
			imgUrl: "https://ik.imagekit.io/globalsc/baw-jul-2024/5.jpg",
			title: "Business After Work - O Líder Tech",
			description:
				"O Business After Work – O Líder Tech reuniu executivos, empreendedores e especialistas em tecnologia num ambiente moderno e inspirador, para debater o impacto da inovação digital na liderança e no futuro dos negócios em Angola.",

			videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
			color: "from-[#001F5D]/80 to-[#FF7A00]/80",
		},
		{
			imgUrl: "https://ik.imagekit.io/globalsc/baw-jan-2025/10.jpg",
			title: "Business After Work - Welcome Together 2025",
			description:
				"O Business After Work – Welcome Together 2025 marcou o início de mais um ciclo de conexão, inspiração e oportunidades promovido pela Global Services Corporation, reunindo líderes empresariais, executivos e empreendedores num ambiente de elegância, proximidade e networking de alto nível.",

			videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
			color: "from-[#001F5D]/80 to-[#FF7A00]/80",
		},
		{
			imgUrl: "https://ik.imagekit.io/globalsc/seminario-sme-2025/11.jpeg",
			title: "Seminário Nacional sobre Migrações | Co-Organizador",
			description:
				"A Abertura ofícial do evento em representação de SE Director Geral do SME, Dr. José Baptista Jr., foi feita pelo Director Geral Adjunto SE Comissário de Migração, Dr. Tomé João Kuanga. Da Global Services Corporation, a apresentação foi feita pelo Dr. Tomás Brito Administrador, que em sua explanação, reafirmou o compromisso da Global Services Corporation em contribuir no desenvolvimento das instituições Angolanas, sendo que este evento faz parte de uma visão contida em seu plano estratégico, com o programa Líder do Futuro.",

			videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
			color: "from-[#001F5D]/80 to-[#FF7A00]/80",
		},
	]

	return (
		<div className="relative h-screen w-full z-10 max-lg:min-h-screen">
			<Swiper
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				slidesPerView={1}
				loop={true}
				spaceBetween={0}
				navigation={true}
				effect="fade"
				modules={[Autoplay, Navigation, EffectFade]}
				className="h-full w-full"
			>
				{slides.map((slide, index) => (
					<SwiperSlide key={index} className="h-full w-full relative">
						<Image
							src={slide.imgUrl}
							alt={slide.title}
							width={1920}
							height={1040}
							className="w-full h-full z-0 object-cover"
							priority
						/>

						<div
							className={`h-full w-full flex items-center gap-16 justify-center bg-linear-to-r ${slide.color} text-white z-20 absolute left-0 top-0 backdrop-blur-sm px-16
              max-lg:flex-col max-lg:justify-center max-lg:items-center max-lg:gap-8 max-lg:px-6 max-lg:text-center`}
						>
							<div className="w-full flex flex-col items-center gap-4 max-w-xl h-96 relative max-lg:h-56">
								{!play ? (
									<div
										className="w-full h-full flex items-center justify-center bg-black/40 rounded-lg relative"
										style={{
											backgroundImage: `url(${slide.imgUrl})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									>
										<PlayCircle
											onClick={() => setPlay(true)}
											className="w-20 h-20 text-white cursor-pointer hover:scale-110 transition-all duration-300 absolute max-lg:w-14 max-lg:h-14"
										/>
									</div>
								) : (
									<iframe
										width="700"
										height="355"
										src={slide.videoUrl}
										title="YouTube video player"
										className="w-full h-full rounded-lg"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									></iframe>
								)}
							</div>

							<div className="w-full flex flex-col gap-4 max-w-xl max-lg:max-w-none">
								<h2 className="text-4xl font-semibold text-white max-lg:text-2xl">
									{slide.title}
								</h2>
								<p className="text-gray-200 font-medium max-lg:text-sm">
									{slide.description}
								</p>

								{slide.soon && slide.link && (
									<Link
										href={slide.link}
										className="btn-secondary w-fit max-lg:w-full max-lg:justify-center"
									>
										Participar
									</Link>
								)}
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
