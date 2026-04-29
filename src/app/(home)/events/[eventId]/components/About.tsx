"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutProps {
  title: string;
  description: string;
  primary: string;
  imgUrl: string;
  videoUrl?: string;
}

export default function About({
  title,
  description,
  primary,
  imgUrl,
  videoUrl,
}: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      viewport={{ once: true }}
      className="w-full px-6 lg:py-12 flex flex-col justify-center items-center max-lg:text-center">
      <div className="max-w-7xl w-full flex justify-between gap-12 items-center max-lg:flex-col-reverse">
        <motion.div
          className="lg:max-w-2xl lg:px-8 flex flex-col gap-6 text-main max-lg:text-center "
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            show: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
                staggerChildren: 0.5,
              },
            },
          }}>
          <motion.p
            style={{ backgroundColor: primary }}
            className="px-4 py-2 rounded-md text-white w-fit max-lg:mx-auto max-lg:text-xs"
            variants={{
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0 },
            }}>
            Sobre o evento
          </motion.p>

          <motion.h1
            className="text-4xl font-semibold max-lg:text-2xl max-lg:leading-snug"
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}>
            {title}
          </motion.h1>

          <motion.p
            className="text-justify text-base max-lg:text-sm max-lg:text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}>
            {description}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{
            scale: 1.05,
            rotate: 1,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          }}
          className="rounded-2xl overflow-hidden w-full lg:h-125 max-lg:h-60 bg-black">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full rounded-2xl object-contain object-center"
            />
          ) : (
            <Image
              src={imgUrl}
              alt="Illustration about event"
              width={1920}
              height={1080}
              className="w-full h-full rounded-2xl object-cover object-center"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
