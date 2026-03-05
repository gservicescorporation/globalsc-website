import Image from "next/image";
import { motion } from "framer-motion";
/* 
import Link from "next/link";
import { ArrowRight } from "lucide-react";
*/

export default function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="sobre-nos"
      className="w-full flex justify-center items-center gap-12 max-w-7xl px-8 py-12 z-10
      max-lg:flex-col max-lg:gap-10 max-lg:px-6 max-lg:py-10 max-lg:text-center">
      {/* Imagem ilustrativa */}
      <Image
        src={"/images/illustration-2.png"}
        alt={"Illustration about our advantages"}
        width={1920}
        height={1080}
        className="w-[550px] h-auto max-lg:w-82 max-lg:mx-auto"
      />

      {/* Texto */}
      <div className="max-w-xl px-8 flex flex-col gap-6 text-main max-lg:px-0 max-lg:max-w-full">
        <h1 className="text-4xl font-semibold max-lg:text-2xl">
          A história por trás da nossa empresa
        </h1>
        <p className="text-base text-tertiary max-lg:text-sm">
          A Global Services Corporation (GSC) nasceu do desejo de transformar
          desafios em oportunidades e de apoiar empresas e pessoas a alcançarem
          os seus objetivos com segurança e confiança. A nossa trajetória
          começou com uma visão clara: ser uma parceira estratégica no mercado
          angolano, oferecendo soluções em seguros, consultoria e formação de
          capital humano. Desde o início, acreditamos que proteger, orientar e
          capacitar são passos essenciais para o crescimento sustentável dos
          nossos clientes.
        </p>

        {/* 
        <Link
          href="/about"
          className="btn-primary w-fit max-lg:mx-auto max-lg:text-sm max-lg:px-5 max-lg:py-2">
          Ver mais <ArrowRight className="w-5 max-lg:w-4" />
        </Link> 
        */}
      </div>
    </motion.div>
  );
}
