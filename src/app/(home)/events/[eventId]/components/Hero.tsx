"use client";

import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface HeroProps {
  eventTitle: string;
  imgUrl: string;
  primaryColor: string;
  secondaryColor: string;
  startDate: Date;
  location: string;
}

export default function Hero({
  eventTitle,
  imgUrl,
  primaryColor,
  secondaryColor,
  startDate,
  location,
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [eventPassed, setEventPassed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(startDate).getTime();
      const diff = eventTime - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
        setEventPassed(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setEventPassed(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const eventTime = [
    { title: "Dias", number: timeLeft.days },
    { title: "Horas", number: timeLeft.hours },
    { title: "Minutos", number: timeLeft.minutes },
    { title: "Segundos", number: timeLeft.seconds },
  ];

  return (
    <div
      className={`h-screen w-full bg-cover bg-center max-lg:h-auto ${
        eventPassed && "max-lg:flex max-lg:items-center"
      }`}
      style={{
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}), url(${imgUrl})`,
      }}>
      <div className="h-full w-full flex justify-center items-center px-18 py-12 max-lg:flex-col max-lg:px-6 max-lg:py-24 max-lg:gap-10">
        <div
          className={`max-w-7xl w-full flex items-center  justify-between max-lg:flex-col max-lg:text-center max-lg:gap-12`}>
          <motion.div
            className={`flex flex-col gap-6 ${
              eventPassed ? "max-w-3xl" : "max-w-xl"
            } w-full max-lg:items-center`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}>
            <motion.div
              className="flex gap-3 items-center text-white/90 max-lg:flex-col max-lg:gap-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-4" />{" "}
                {new Date(startDate).toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="w-4" /> {location}
              </span>
            </motion.div>

            <motion.h1
              className={`${
                eventPassed
                  ? "text-7xl max-lg:text-4xl"
                  : "text-5xl max-lg:text-3xl"
              } font-bold text-white max-lg:leading-snug`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}>
              {eventTitle}
            </motion.h1>

            {!eventPassed && (
              <motion.div
                className="flex gap-3 items-center max-lg:flex-col max-lg:w-full max-lg:gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}>
                <motion.a
                  href="https://www.mesaredonda.globalsc.ao"
                  target="_blank"
                  className="btn-tertiary cursor-pointer max-lg:w-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                 Ver mais
                </motion.a>
              </motion.div>
            )}
          </motion.div>

          {!eventPassed && (
            <motion.div
              className="max-w-lg w-full flex flex-col justify-end items-start gap-4 text-white max-lg:items-center max-lg:text-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}>
              <motion.p
                className="text-left w-full max-lg:text-center max-lg:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}>
                Descubra a gama completa de soluções que preparamos para si e
                para a sua empresa.
              </motion.p>

              <motion.ul
                className="flex items-center gap-4 w-full max-lg:flex-wrap max-lg:justify-center max-lg:gap-3"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 1.2 },
                  },
                }}>
                {eventTime.map((item, index) => (
                  <motion.li
                    key={index}
                    className="py-4 px-6 rounded-md border border-white/60 bg-white/20 w-full flex flex-col items-center cursor-pointer max-w-30 max-lg:max-w-25"
                    whileHover={{ scale: 1.1 }}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6 }}>
                    <h1 className="text-2xl font-semibold max-lg:text-xl">
                      <CountUp
                        end={item.number}
                        duration={0.8}
                        preserveValue
                      />
                    </h1>
                    <p className="text-lg max-lg:text-sm">{item.title}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
