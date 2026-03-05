"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface MainMomentsProps {
  primary: string;
  secondary?: string;
  images: string[];
}

export default function MainMoments({ primary, images }: MainMomentsProps) {
  const isVideo = (file: string) => {
    const videoExtensions = [".mp4", ".mov", ".webm", ".avi", ".mkv"];
    return videoExtensions.some((ext) => file.toLowerCase().endsWith(ext));
  };

  return (
    <motion.div
      className="w-full px-18 lg:py-12 flex items-center justify-center gap-4 max-lg:px-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, staggerChildren: 0.3 },
        },
      }}
    >
      <div className="max-w-7xl w-full flex flex-col items-center justify-center gap-12 max-lg:gap-8">
        <motion.div
          className="w-full text-center flex flex-col justify-center items-center gap-4 max-lg:gap-2"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
        >
          <motion.p
            style={{ backgroundColor: primary }}
            className="px-4 py-2 rounded-md text-white w-fit text-sm max-lg:text-xs"
            variants={{
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            Principais momentos
          </motion.p>

          <motion.div
            className="flex flex-col gap-2 text-main px-4 max-lg:px-2 max-w-5xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
          >
            <h1 className="text-4xl font-semibold max-lg:text-2xl max-lg:leading-snug">
              Momentos especiais que marcaram o nosso evento.
            </h1>
            <p className="text-base max-lg:text-sm">
              Reviva os momentos inesquecíveis que tornaram este evento único.
              Cada imagem reflete a energia, as conexões e as experiências que
              marcaram esta edição especial.
            </p>
          </motion.div>
        </motion.div>

        <div className="w-full flex justify-center items-center gap-6 lg:h-screen max-lg:h-96 relative">
          <button className="custom-next absolute z-20 cursor-pointer top-1/2 -translate-y-1/2 right-0 !bg-main  rounded-full h-12 w-12 flex justify-center items-center !text-white">
            <ChevronRight className="w-5" />
          </button>

          <button className="custom-prev absolute z-20 cursor-pointer top-1/2 -translate-y-1/2 left-0 !bg-main  rounded-full h-12 w-12 flex justify-center items-center !text-white">
            <ChevronLeft className="w-5" />
          </button>

          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            speed={2000}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            effect="fade"
            modules={[Autoplay, Navigation, EffectFade]}
            className="w-full h-full"
          >
            {images.map((file, index) => (
              <SwiperSlide key={index} className="w-full h-full lg:px-24">
                {isVideo(file) ? (
                  <video
                    src={file}
                    controls={false}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="rounded-2xl object-cover object-top w-full h-full"
                  />
                ) : (
                  <Image
                    src={file}
                    alt={`Momento ${index + 1}`}
                    width={1920}
                    height={1040}
                    className="rounded-2xl object-cover object-top w-full h-full"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.div>
  );
}
