import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function OurBrands() {
  const brands = [
    {
      link: "#",
      imgUrl: "/images/events/baw-logo.png",
      title: "Business After Work",
      description: `Uma marca da Global Services Corporation onde se reúne empresários de diversos sectores para um networking, pós-trabalho.`,
    },
    {
      link: "#",
      imgUrl: "/images/events/mr-logo.png",
      title: "Mesa Redonda com CEOs",
      description: `Uma marca da Global Services Corporation onde se reúne líderes e vários sectores, nacionais e internacionais.`,
    },

    {
      link: "#",
      imgUrl: "/images/events/fsisfcl.png",
      title: "Fórum sobre: O Impacto do Sector Petrolífero no Conteúdo Local",
      description: `O fórum sobre um dos sectores se não o maior sector industrial de Angola, com grandes líderes da área e não só.`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col justify-center items-center gap-12 max-w-7xl py-8 z-10 w-full max-lg:gap-8 max-lg:px-4">
      <div className="text-main flex flex-col justify-center items-center w-full max-w-2xl text-center max-lg:max-w-full">
        <h1 className="text-4xl font-semibold max-lg:text-2xl">
          Nossas marcas registadas
        </h1>
        <p className="text-tertiary font-medium max-lg:text-sm">
          Marcas registadas que refletem a identidade e a excelência dos nossos
          eventos corporativos.
        </p>
      </div>

      <ul className="w-full flex justify-center items-center gap-6 flex-wrap max-lg:flex-col max-lg:items-center max-lg:gap-8">
        {brands.map((item, index) => (
          <li
            key={index}
            className="w-full max-w-sm h-78 relative max-lg:max-w-full max-lg:h-72">
            <Image
              src={item.imgUrl}
              alt={item.title}
              width={1920}
              height={1040}
              className="w-full h-full object-cover object-center rounded-2xl"
            />

            <Link href={item.link}>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/30 to-primary/70 rounded-2xl px-6 py-5 text-white flex flex-col justify-end hover:backdrop-blur-xs transition-all opacity-0 hover:opacity-100 duration-300">
                <h1 className="font-semibold text-lg max-lg:text-base">
                  {item.title}
                </h1>

                <p className="text-xs max-lg:text-[11px] leading-snug">
                  {item.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
