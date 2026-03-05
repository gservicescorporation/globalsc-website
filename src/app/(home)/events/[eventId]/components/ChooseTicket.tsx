"use client";

import { formatPrice } from "@/app/utils/formatPrice";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import eventDataFile from "@/app/data/events.json";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EventDataInterface } from "@/app/interfaces/event-data";

interface ChooseTicketProps {
  primary: string;
  secondary: string;
  imgUrl: string;
  tickets: {
    id: string;
    benefits: string[];
    ticketName: string;
    price: number;
  }[];
}

export default function ChooseTicket({
  primary,
  secondary,
  imgUrl,
  tickets,
}: ChooseTicketProps) {
  const router = useRouter();
  const { eventId } = useParams() as { eventId: string };
  const [eventData, setEventData] = useState<EventDataInterface | null>(null);

  useEffect(() => {
    const foundEvent = eventDataFile.events.find((ev) => ev.id === eventId);

    if (foundEvent) {
      setEventData({
        ...foundEvent,
        event: {
          ...foundEvent.event,
          startDate: foundEvent.event.startDate,
          images: foundEvent.event.images ?? [],
        },
      });
    } else {
      toast.error("Evento não encontrado");
    }
  }, [eventId]);

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
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
      }}
      className="min-h-screen w-full bg-cover px-16 py-18 text-center flex flex-col items-center gap-8 max-lg:px-6 max-lg:py-10 max-lg:gap-6"
      style={{
        backgroundImage: `linear-gradient(to right, ${primary}, ${secondary}), url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        variants={childVariants}
        className="text-white flex flex-col justify-center gap-4 items-center w-full max-w-4xl text-center max-lg:gap-2"
      >
        <motion.p
          variants={childVariants}
          style={{ backgroundColor: primary }}
          className="px-4 py-2 rounded-md text-white w-fit text-sm max-lg:text-xs"
        >
          Acesso
        </motion.p>

        <motion.span
          variants={childVariants}
          className="flex flex-col gap-2 max-lg:gap-1 px-4"
        >
          <motion.h1
            variants={childVariants}
            className="text-4xl font-semibold text-white max-lg:text-2xl max-lg:leading-snug"
          >
            Escolha o seu passe de acesso
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="text-white/80 font-medium text-base max-lg:text-sm"
          >
            Parceiros de confiança para impulsionar o seu crescimento com
            soluções integradas e resultados reais.
          </motion.p>
        </motion.span>
      </motion.div>

      <motion.div
        variants={childVariants}
        className="flex items-center justify-center w-full h-full flex-wrap gap-8 max-lg:gap-6"
      >
        {tickets.map((item) => (
          <motion.div
            key={item.id}
            variants={childVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.25)",
            }}
            className="px-10 py-14 rounded-2xl backdrop-blur-sm bg-white/10 max-w-xs w-full h-full flex flex-col gap-4 min-h-96 max-lg:px-6 max-lg:py-8 max-lg:min-h-80"
          >
            <motion.h1
              variants={childVariants}
              className="text-2xl max-lg:text-xl"
            >
              {item.ticketName}
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="text-2xl font-semibold text-secondary max-lg:text-xl"
            >
              {formatPrice(item.price)} AOA
            </motion.p>

            <motion.p
              variants={childVariants}
              className="text-sm max-lg:text-xs"
            >
              Benefícios
            </motion.p>

            <motion.hr
              variants={childVariants}
              className="border border-white/40 origin-left w-1/2 mx-auto"
            />

            <motion.ul
              variants={childVariants}
              className="w-full flex flex-col justify-center items-center gap-4 max-lg:gap-3"
            >
              {item.benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  variants={childVariants}
                  className="flex items-center gap-2 text-sm max-lg:text-xs"
                >
                  <Check className="w-4 max-lg:w-3" /> {benefit}
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!eventData}
              className="text-semibold px-6 py-4 rounded-xl cursor-pointer hover:opacity-50 transition-all duration-300 mt-8 disabled:opacity-50 max-lg:mt-6 max-lg:py-3 max-lg:text-sm"
              style={{ backgroundColor: primary }}
              onClick={() => {
                if (eventData) router.push(`/events/${eventData.id}/get-ticket`);
              }}
            >
              Reservar
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
