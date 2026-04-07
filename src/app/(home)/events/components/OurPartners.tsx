import { motion } from "framer-motion";
import Image from "next/image";

export default function OurPartners() {
  const logos = [
    "/partners/aec.png",
    "/partners/aes.png",
    "/partners/english-academy.png",
    "/partners/sistec.png",
    "/partners/epic-sana.png",
    "/partners/gda.png",
    "/partners/sta-seguros.png",
    "/partners/td-hotels.png",
    "/partners/tda.png",
    "/partners/teleservice.png",
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex flex-col justify-center items-center gap-12 max-w-7xl px-8 py-8 z-10 w-full max-lg:gap-8 max-lg:px-4 max-lg:py-6">
      
      <div className="text-main flex flex-col justify-center items-center w-full max-w-2xl text-center max-lg:max-w-full">
        <h1 className="text-4xl font-semibold max-lg:text-2xl">
          Parceiros frequentes
        </h1>
        <p className="text-tertiary font-medium max-lg:text-sm max-lg:px-2">
          Parceiros de confiança para impulsionar o seu crescimento com soluções
          integradas e resultados reais.
        </p>
      </div>

      <motion.ul className="w-full flex justify-around items-center gap-16 flex-wrap max-lg:gap-10 max-lg:justify-center">
        {logos.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="max-lg:w-32 max-lg:h-20 flex justify-center items-center">
            <Image
              src={item}
              alt="Logotipo"
              width={2000000}
              height={1000000}
              className="w-44 h-24 object-contain hover:scale-105 transition-all duration-300 cursor-pointer max-lg:w-32 max-lg:h-20"
            />
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
