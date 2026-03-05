"use client";

import { motion } from "framer-motion";

interface WhySignProps {
  primary: string;
  secondary?: string;
  title: string;
  subtitle: string;
  speakers: {
    fullname: string;
    jobTitle: string;
    imgUrl: string;
  }[];
}

export default function WhySign({
  primary,
  title,
  subtitle,
  speakers,
}: WhySignProps) {
  return (
    <motion.div
      className="w-full px-18 py-12 flex items-center justify-center gap-4 max-lg:px-6 max-lg:py-8"
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
      }}>
      <div className="max-w-7xl w-full flex flex-col items-center justify-center gap-12 max-lg:gap-8">
        <motion.div
          className="w-full text-center flex flex-col justify-center items-center gap-4 max-lg:gap-2"
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}>
          <motion.p
            style={{ backgroundColor: primary }}
            className="px-4 py-2 rounded-md text-white w-fit text-sm max-lg:text-xs"
            variants={{
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0 },
            }}>
            Oradores
          </motion.p>

          <motion.div
            className="flex flex-col gap-2 text-main max-w-5xl max-lg:px-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}>
            <h1 className="text-4xl font-semibold max-lg:text-2xl max-lg:leading-snug">
              {title}
            </h1>
            <p className="text-base max-lg:text-sm">{subtitle}</p>
          </motion.div>
        </motion.div>

        <motion.ul
          className="w-full flex flex-wrap gap-8 justify-center max-lg:gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.3 },
            },
          }}>
          {speakers.map((item, index) => (
            <motion.li
              key={index}
              className="rounded-xl max-w-sm w-full h-124 cursor-pointer bg-top flex items-end justify-center py-8 px-8 max-lg:h-96 max-lg:px-6"
              style={{
                backgroundImage: `linear-gradient(to top, ${primary}, #00000000), url(${item.imgUrl})`,
                backgroundSize: "cover",
              }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.25)",
              }}>
              <div className="p-5 w-full flex flex-col text-white text-center bg-white/20 rounded-lg backdrop-blur-xs transition-all duration-300 max-lg:p-4">
                <h1 className="text-lg font-semibold max-lg:text-base">
                  {item.fullname}
                </h1>
                <p className="text-sm max-lg:text-xs">{item.jobTitle}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
