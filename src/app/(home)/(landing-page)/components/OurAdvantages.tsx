import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function OurAdvantages() {
  const advantages = [
    {
      title: "Experiência multissetorial",
      description:
        "Atuamos em Eventos Corporativos, Mediação de Seguros e Formação, oferecendo soluções integradas e adaptadas às necessidades de cada cliente.",
    },
    {
      title: "Equipe especializada",
      description:
        "Nossa equipe é composta por profissionais altamente qualificados e experientes, dedicados a fornecer o melhor serviço possível.",
    },
    {
      title: "Atendimento personalizado",
      description:
        "Oferecemos soluções sob medida, adaptadas às especificidades de cada cliente e projeto.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full flex justify-center items-center gap-12 max-w-7xl px-8 py-16 z-10
      max-lg:flex-col-reverse max-lg:gap-10 max-lg:px-6 max-lg:py-10 max-lg:text-center">
      
      {/* Texto e lista */}
      <div className="max-w-xl px-8 flex flex-col gap-6 text-main max-lg:px-0 max-lg:max-w-full">
        <h1 className="text-4xl font-semibold max-lg:text-2xl">
          O que ganha ao trabalhar connosco?
        </h1>
        <p className="text-base text-tertiary max-lg:text-sm">
          Ao escolher a Global Services Corporation, está a optar por um parceiro
          comprometido com a excelência, inovação e impacto positivo. Beneficie de
          soluções personalizadas, uma vasta rede de contactos e uma equipa dedicada
          ao seu sucesso. Juntos, podemos transformar desafios em oportunidades e
          alcançar resultados extraordinários.
        </p>

        <ul className="w-full flex flex-col gap-4 max-lg:items-start max-lg:gap-3">
          {advantages.map((advantage, index) => (
            <li
              key={index}
              className="flex gap-2 w-full max-lg:gap-3 max-lg:items-start max-lg:justify-center">
              <CircleCheck className="w-8 text-accent max-lg:w-6 mx-auto max-lg:mx-0 max-lg:hidden" />
              <div className="text-left max-lg:text-center">
                <h3 className="font-semibold text-lg text-main max-lg:text-base">
                  {advantage.title}
                </h3>
                <p className="text-tertiary text-sm max-lg:text-xs">
                  {advantage.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Imagem ilustrativa */}
      <Image
        src={"/images/illustration.png"}
        alt={"Illustration about our advantages"}
        width={1920}
        height={1080}
        className="w-[600px] h-auto max-lg:w-82"
      />
    </motion.div>
  );
}
