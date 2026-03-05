"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function InterestPartnership() {
  return (
    <div className="lg:px-8  max-w-7xl w-full flex justify-center pb-16">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-20 bg-primary text-white flex justify-center gap-18 z-20 lg:rounded-2xl w-full h-fit lg:shadow-lg transition-all duration-300
      max-lg:flex-col-reverse max-lg:items-center max-lg:gap-10 max-lg:px-8 max-lg:pt-12 max-lg:text-center">
        <Image
          src={"/logo-contact.png"}
          alt={"Logotipo da Global Services Corporation"}
          width={1920}
          height={1040}
          className="w-130 object-cover object-left 
        max-lg:w-72 max-lg:object-contain"
        />

        <div
          className="flex flex-col gap-8 justify-center max-w-md w-full py-16
      max-lg:py-0 max-lg:items-center">
          <div className="w-full flex flex-col gap-4 max-lg:items-center">
            <h2 className="text-4xl font-semibold text-white max-lg:text-2xl">
              Interessado em ser parceiro?
            </h2>
            <p className="text-gray-200 font-medium max-lg:text-sm">
              Junte-se à nossa rede de parceiros e descubra como podemos crescer
              juntos, criando oportunidades e resultados estratégicos.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="btn-tertiary w-fit 
          max-lg:w-auto max-lg:text-sm max-lg:px-6 max-lg:py-3 max-lg:flex">
            Contactar <ArrowRight className="w-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
