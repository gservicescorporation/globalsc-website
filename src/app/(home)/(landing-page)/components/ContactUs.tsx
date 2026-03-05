import { motion } from "framer-motion";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContactUs() {
  const socialMedias = [
    { link: "#", icon: <Facebook /> },
    { link: "#", icon: <Instagram /> },
    { link: "#", icon: <Linkedin /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="px-18 bg-primary text-white flex justify-center gap-18 lg:rounded-2xl w-full max-w-7xl h-fit shadow-lg transition-all duration-300 mb-16
      max-lg:flex-col max-lg:items-center max-lg:gap-10 max-lg:px-8 max-lg:pt-12 max-lg:text-center"
    >
      {/* Texto e botões */}
      <div className="flex flex-col gap-8 max-w-md w-full py-16 
      max-lg:py-0 max-lg:items-center">
        <div className="w-full flex flex-col gap-4 max-lg:items-center">
          <h2 className="text-4xl font-semibold text-white max-lg:text-2xl">
            Entre em contacto de forma simples.
          </h2>
          <p className="text-gray-200 font-medium max-lg:text-sm">
            Seja para esclarecer dúvidas, oferecer suporte ou discutir como
            podemos colaborar, não hesite em nos contatar.
          </p>
        </div>

        <div className="flex items-center justify-between max-w-sm 
        max-lg:flex-col max-lg:gap-6 max-lg:justify-center">
          <Link
            href="/contact-us"
            className="btn-tertiary max-lg:flex max-lg:text-sm max-lg:px-6 max-lg:py-3"
          >
            Contactar <ArrowRight className="w-5" />
          </Link>

          <span className="flex items-center gap-4 text-2xl max-lg:text-xl">
            {socialMedias.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="hover:text-accent transition-colors"
              >
                {item.icon}
              </Link>
            ))}
          </span>
        </div>
      </div>

      {/* Imagem */}
      <Image
        src={"/logo-contact.png"}
        alt={"Contact Us"}
        width={1920}
        height={1080}
        className="w-130 object-cover object-left
        max-lg:w-72 max-lg:object-contain"
      />
    </motion.div>
  );
}
