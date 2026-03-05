import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

export default function LandingHero() {
  const heroItems = [
    {
      title: "Excelência Corporativa ao Serviço do Futuro de Angola",
      description:
        "Soluções integradas em seguros, eventos e formação para impulsionar o seu sucesso.",
      image: "/images/conference.jpg",
      link: "",
    },
    {
      title: "Receba as melhores propostas de seguro para si e a sua empresa.",
      description:
        "Somos a ponte entre si e as seguradoras, assegurando as melhores soluções para proteger o que mais importa.",
      image: "/images/consulting-clients.jpg",
      link: "",
    },
    {
      title: "Criamos Experiências Inesquecíveis e Eventos que Fazem História",
      description:
        "Transformamos ideias em eventos marcantes que fortalecem marcas e conectam pessoas.",
      image: "/images/corporate-event.jpg",
      link: "",
    },
    {
      title: "Formação que Inspira, Transforma e Constrói Novos Líderes",
      description:
        "Cursos práticos e estratégicos para desenvolver talentos e preparar líderes do futuro.",
      image: "/images/plenaria.jpg",
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
