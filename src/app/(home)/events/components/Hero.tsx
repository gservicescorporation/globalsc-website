"use client";

import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

interface SlidesProps {
  imgUrl: string;
  title: string;
  description: string;
  videoUrl: string;
  color: string;
  soon?: boolean;
  link?: string;
}

export default function EventsHero() {
  const [play, setPlay] = useState(false);

  const slides: SlidesProps[] = [
    {
      imgUrl: "https://www.mesaredonda.globalsc.ao/logo.jpeg",
      title:
        "Mesa Redonda com CEOS - 5ª Edição",
      description:
        "O Mesa Redonda com CEOS 2026 - 5ª Edição sobre o Papel da Banca e de Outros Agentes do Sistema Financeiro na Mobilização de Financiamento é um espaço estratégico de reflexão, diálogo e partilha de experiências entre decisores públicos, instituições financeiras, investidores, reguladores e especialistas nacionais e internacionais. ",
      videoUrl: "https://www.youtube.com/embed/_llumWA1rBE?autoplay=1&rel=0",
      color: "from-primary/90 to-[#008db1]/80",
	  soon: true,
	  link: "https://www.mesaredonda.globalsc.ao"
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
  ];

  return (
    <div className="relative h-screen w-full z-10 max-lg:min-h-screen">
      <Swiper
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        slidesPerView={1}
        loop={true}
        spaceBetween={0}
        navigation={true}
        effect="fade"
        modules={[Autoplay, Navigation, EffectFade]}
        className="h-full w-full">
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="h-full w-full relative">
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
              max-lg:flex-col max-lg:justify-center max-lg:items-center max-lg:gap-8 max-lg:px-6 max-lg:text-center`}>
              <div className="w-full flex flex-col items-center gap-4 max-w-xl h-96 relative max-lg:h-56">
                <div
                  className="w-full h-full flex items-center justify-center bg-black/40 rounded-lg relative"
                  style={{
                    backgroundImage: `url(${slide.imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}></div>
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
					target="_blank"
                    className="btn-secondary w-fit max-lg:w-full max-lg:justify-center">
                    Participar
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
