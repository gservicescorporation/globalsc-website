import { motion } from "framer-motion";
import ServicesCard from "../../../ui/ServicesCard";

export default function OurServices() {
  const services = [
    {
      iconUrl: "/icons/seguros.svg",
      title: "Mediação de Seguros",
      description:
        "Somos a ponte entre si e as seguradoras, assegurando as melhores soluções para proteger o que mais importa.",
    },
    {
      iconUrl: "/icons/academia.svg",
      title: "Formação e Consultoria",
      description:
        "Cursos práticos e estratégicos para desenvolver talentos e preparar líderes do futuro.",
    },
    {
      iconUrl: "/icons/eventos.svg",
      title: "Gestão de Eventos Corporativos",
      description:
        "Transformamos ideias em eventos marcantes que fortalecem marcas e conectam pessoas.",
    },
    {
      iconUrl: "/icons/marketing.svg",
      title: "Marketing e Comunicação",
      description:
        "Estratégias inovadoras que elevam a sua marca e ampliam o seu alcance no mercado.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full flex items-center justify-between bg-primary max-w-7xl py-16 px-14 lg:rounded-2xl gap-8 z-10 shadow-lg transition-all duration-300
      max-lg:flex-col max-lg:gap-10 max-lg:py-12 max-lg:px-6 max-lg:text-center">
      <div className="max-w-sm w-full flex flex-col gap-4 max-lg:max-w-full">
        <h2 className="text-4xl font-semibold text-white max-lg:text-2xl">
          Nossos serviços
        </h2>
        <p className="text-gray-200 font-medium max-lg:text-sm">
          Descubra a gama completa de soluções que preparamos para si e para a
          sua empresa.
        </p>
      </div>

      <ul className="flex flex-wrap justify-around w-full gap-5 max-w-2xl max-lg:flex-col max-lg:items-center max-lg:gap-6">
        {services.map((service, index) => (
          <li
            key={index}
            className="max-lg:w-full max-lg:max-w-sm">
            <ServicesCard
              variant={"primary"}
              iconUrl={service.iconUrl}
              title={service.title}
              description={service.description}
            />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
