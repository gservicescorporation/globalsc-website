"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PartnersProps {
  title: string;
  subtitle: string;
  logos: string[];
}

export default function PartnersSponsors({
  title,
  subtitle,
  logos,
}: PartnersProps) {
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
      className="flex flex-col justify-center items-center gap-12 max-w-7xl px-8 py-12 z-10 w-full max-lg:gap-8 max-lg:px-4 max-lg:py-8">
      <div className="text-main flex flex-col justify-center items-center w-full max-w-4xl text-center px-4">
        <h1 className="text-4xl font-semibold max-lg:text-2xl max-lg:leading-snug">
          {title}
        </h1>
        <p className="text-tertiary font-medium max-lg:text-sm max-lg:mt-2">
          {subtitle}
        </p>
      </div>

      <motion.ul className="w-full flex justify-center items-center gap-24 flex-wrap max-lg:gap-8 max-lg:justify-center">
        {logos.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="flex justify-center items-center">
            <Image
              src={item}
              alt="Logotipo"
              width={2000000}
              height={1000000}
              className="w-44 h-24 object-contain hover:scale-105 transition-all duration-300 cursor-pointer max-lg:w-32 max-lg:h-24"
            />
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
