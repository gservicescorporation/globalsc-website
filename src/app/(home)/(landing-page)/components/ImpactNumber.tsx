"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

const stats: Stat[] = [
  { value: 10, suffix: "+", label: "Anos no mercado" },
  { value: 500, suffix: "+", label: "Clientes satisfeitos" },
  { value: 98, suffix: "%", label: "Seguradoras renovam" },
  { value: 200, suffix: "+", label: "Empresas apoiadas" },
];

export default function ImpactNumbers() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full flex justify-between items-center py-12 px-12 bg-white lg:shadow-lg transition-all duration-300 max-w-7xl lg:rounded-2xl z-10
      max-lg:flex-col max-lg:gap-8 max-lg:py-10 max-lg:px-6">
      <div className="max-w-sm w-full text-center lg:text-left">
        <h2 className="text-2xl font-semibold text-main max-lg:text-2xl">
          Nossos números de impacto
        </h2>
        <p className="text-tertiary font-medium max-lg:text-sm">
          Cada número representa histórias de sucesso e impacto real.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-lg:gap-6 max-lg:mt-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center font-medium p-2 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer max-lg:p-1">
            <div className="text-3xl font-semibold text-main max-lg:text-xl">
              <CountUp
                start={0}
                end={stat.value}
                duration={4}
                suffix={stat.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </div>
            <p className="text-tertiary text-sm max-lg:text-xs text-center">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
