"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

const stats: Stat[] = [
  { value: 10, suffix: "+", label: "Eventos realizados" },
  { value: 1000, suffix: "+", label: "Participantes" },
  { value: 50, suffix: "+", label: "Oradores" },
  { value: 100, suffix: "+", label: "Patrocinadores" },
];

export default function EventsStats() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full flex justify-between max-lg:hidden items-center py-12 px-12 bg-gradient-to-r from-event to-primary lg:shadow-lg transition-all duration-400 max-w-7xl lg:rounded-2xl z-10
      max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:text-center max-lg:gap-10 max-lg:px-6 max-lg:py-8">
      <div className="max-w-sm w-full max-lg:max-w-none">
        <h2 className="text-2xl font-semibold text-white">
          Estatísticas dos eventos
        </h2>
        <p className="text-white/80 font-medium max-lg:text-sm">
          Cada número representa histórias de sucesso e impacto real.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-lg:gap-6 max-lg:w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center font-medium p-2 rounded-md hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-3xl font-semibold text-white max-lg:text-2xl">
              <CountUp
                start={0}
                end={stat.value}
                duration={4}
                suffix={stat.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </div>
            <p className="text-white/80 max-lg:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
