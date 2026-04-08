import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

export default function LandingHero() {
  const heroItems = [
    {
      title: "Mesa Redonda com CEO's - 5ª Edição",
      description:
        "O Papel da Banca e de Outros Agentes do Sistema Financeiro na Mobilização de Financiamento",
      image: "https://ik.imagekit.io/globalsc/mr-jul-2026/second-banner.png",
      link: "https://www.mesaredonda.globalsc.ao",
    },
    {
      title: "LOCAL CONTENT MAGAZINE",
      description:
        "A Local Content Magazine é uma publicação editorial de alta qualidade dedicada a apresentar os líderes, empresas e iniciativas que impulsionam o crescimento econômico e fortalecem o ecossistema local. ",
      image: "https://ik.imagekit.io/globalsc/mr-jul-2026/banner-lcm.png",
      link: "https://www.mesaredonda.globalsc.ao/magazine",
    },
    {
      title: "Criamos Experiências Inesquecíveis e Eventos que Fazem História",
      description:
        "Transformamos ideias em eventos marcantes que fortalecem marcas e conectam pessoas.",
      image: "/images/corporate-event.jpg",
      link: "",
    },
  ];

  return (
    <div className="relative h-screen w-full z-10">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-screen w-full"
        modules={[Autoplay, EffectFade]}>
        {heroItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="h-full w-full relative">
              <Image
                src={item.image}
                alt="Hero Background"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
                priority
              />

              <div className="absolute inset-0 bg-primary/40 text-white backdrop-blur-xs flex items-center justify-center px-8 py-14">
                <div className="flex flex-col gap-4 justify-center items-center text-center max-w-5xl w-full">
                  <h1 className="text-5xl font-bold max-lg:text-3xl max-lg:leading-snug">
                    {item.title}
                  </h1>

                  <p className="text-xl max-w-4xl max-lg:text-base max-lg:max-w-md">
                    {item.description}
                  </p>

                  {item.link && (
                    <div className="flex items-center gap-4 mt-6 max-lg:mt-4">
                      <Link
                        href={item.link}
                         target="_blank"
                        className="btn-secondary ">
                        Saiba mais
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
