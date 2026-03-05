import ServicesCard from "../../../ui/ServicesCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OurAcademy() {
  const services = [
    {
      iconUrl: "/icons/seguros.svg",
      title: "1. Aprendizagem Prática",
      description:
        "Os nossos cursos são desenhados para o mercado angolano, com conteúdos aplicáveis ao dia a dia profissional.",
    },
    {
      iconUrl: "/icons/academia.svg",
      title: "2. Instrutores Experientes",
      description:
        "Formadores com know-how comprovado no setor, prontos para transmitir conhecimento de forma clara e eficaz.",
    },
    {
      iconUrl: "/icons/eventos.svg",
      title: "3. Networking de Valor",
      description:
        "Conecte-se com profissionais e empresas, ampliando oportunidades de carreira e negócios.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-background-secondary w-full gap-8 py-18 px-14 flex flex-col justify-center items-center lg:rounded-2xl max-w-7xl z-10 lg:shadow-md transition-all duration-300
      max-lg:px-6 max-lg:py-12 max-lg:gap-10 max-lg:text-center">
      <h1 className="text-main text-4xl font-semibold max-w-2xl text-center max-lg:text-2xl max-lg:max-w-md">
        Por que fazer uma formação na nossa academia?
      </h1>

      <ul className="flex justify-center w-full gap-5 max-lg:flex-col max-lg:items-center max-lg:gap-6">
        {services.map((service, index) => (
          <li
            key={index}
            className="max-lg:w-full max-lg:max-w-sm">
            <ServicesCard
              variant={"secondary"}
              iconUrl={service.iconUrl}
              title={service.title}
              description={service.description}
            />
          </li>
        ))}
      </ul>

      <Link
        href="https://academy.globalsc.ao"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 flex items-center gap-2 max-lg:mt-6 max-lg:text-sm max-lg:px-5 max-lg:py-2">
        Ir para academia <ArrowRight className="w-5 max-lg:w-4" />
      </Link>
    </motion.div>
  );
}
