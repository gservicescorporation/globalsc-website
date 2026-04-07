"use client";

import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

interface SlidesProps {
  imgUrl: string;
  title: string;
  description: string;
  videoUrl: string;
  color: string;
  soon?: boolean;
  link?: string;
  btn_text?: string;
}

export default function EventsHero() {
  const slides: SlidesProps[] = [
    {
      imgUrl: "https://ik.imagekit.io/globalsc/mr-jul-2026/third-banner.png",
      title: "Mesa Redonda com CEOS - 5ª Edição",
      description:
        "Mesa Redonda com CEOS 2026 - 5ª Edição sobre o Papel da Banca e de Outros Agentes do Sistema Financeiro na Mobilização de Financiamento é um espaço estratégico de reflexão, diálogo e partilha de experiências entre decisores públicos, instituições financeiras, investidores, reguladores e especialistas nacionais e internacionais. ",
      videoUrl: "https://www.youtube.com/embed/_llumWA1rBE?autoplay=1&rel=0",
      color: "from-[#b48a2c]/60 to-[#0149a7]/70",
      link: "https://www.mesaredonda.globalsc.ao",
      btn_text: "Ver mais sobre o evento",
    },
    {
      imgUrl: "https://ik.imagekit.io/globalsc/mr-jul-2026/banner-lcm.png",
      title: "LOCAL CONTENT MAGAZINE",
      description:
        "A Local Content Magazine é uma publicação editorial de alta qualidade dedicada a apresentar os líderes, empresas e iniciativas que impulsionam o crescimento econômico e fortalecem o ecossistema local. Com curadoria da Global Services Corporation, ela serve como uma plataforma vital para troca de conhecimento e insights estratégicos.",

      videoUrl: "https://www.youtube.com/embed/9n7l8sXoQj0?autoplay=1&rel=0",
      color: "from-[#001F5D]/50 to-[#0149a7]/60",
      link: "https://www.mesaredonda.globalsc.ao/magazine",
      btn_text: "Ver mais sobre revista",
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

                {slide.link && (
                  <Link
                    href={slide.link}
                    target="_blank"
                    className="btn-secondary w-fit max-lg:w-full max-lg:justify-center">
                    {slide.btn_text || "Ver mais"}
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
