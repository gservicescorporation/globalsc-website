"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LocationProps {
  primary: string;
  secondary?: string;
  title: string;
  subtitle: string;
  images: string[];
  address: string;
  phone: string;
  email: string;
}

export default function Location({
  primary,
  title,
  subtitle,
  images,
  address,
  phone,
  email,
}: LocationProps) {
  return (
    <motion.div
      className="w-full px-18 lg:py-12 flex items-center justify-center gap-4 max-lg:px-6 max-lg:pb-10"
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
          className="w-full text-center flex flex-col justify-center items-center gap-4 max-lg:gap-2 px-4"
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
            Localização do evento
          </motion.p>

          <motion.div
            className="flex flex-col gap-2 text-main max-w-5xl max-lg:gap-1"
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
          className="w-full flex max-lg:flex-col gap-8 justify-center max-lg:gap-4 h-96"
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
          {images.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
              }}
              className="rounded-2xl overflow-hidden lg:w-1/2 lg:h-full">
              <Image
                src={item}
                alt={"Illustration about event"}
                width={1920}
                height={1080}
                className="w-full rounded-2xl max-lg:h-56 object-cover h-full"
              />
            </motion.li>
          ))}
        </motion.ul>

        <ul className="text-main flex justify-start gap-24 w-full max-lg:flex-col max-lg:gap-6 max-lg:px-4">
          <li>
            <Link
              href={"#"}
              className="flex items-center gap-3 max-lg:gap-2">
              <MapPin className="w-10 h-10 max-lg:w-8 max-lg:h-8" />
              <span>
                <h1 className="font-semibold text-xl max-lg:text-base">
                  Endereço
                </h1>
                <p className="text-sm max-lg:text-xs">{address}</p>
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={`tel: ${phone}`}
              className="flex items-center gap-3 max-lg:gap-2">
              <Phone className="w-10 h-10 max-lg:w-8 max-lg:h-8" />
              <span>
                <h1 className="font-semibold text-xl max-lg:text-base">
                  Telefone
                </h1>
                <p className="text-sm max-lg:text-xs">{phone}</p>
              </span>
            </Link>
          </li>

          <li>
            <Link
              href={`mailto: ${email}`}
              className="flex items-center gap-3 max-lg:gap-2">
              <Mail className="w-10 h-10 max-lg:w-8 max-lg:h-8" />
              <span>
                <h1 className="font-semibold text-xl max-lg:text-base">
                  Email
                </h1>
                <p className="text-sm max-lg:text-xs">{email}</p>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
