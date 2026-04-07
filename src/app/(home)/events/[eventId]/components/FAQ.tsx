"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

interface ChooseTicketProps {
  primary: string;
  secondary: string;
  imgUrl: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export default function FAQ({
  primary,
  secondary,
  imgUrl,
  faqs,
}: ChooseTicketProps) {
  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      className="min-h-200 w-full bg-cover px-8 py-16 flex flex-col max-lg:gap-12 justify-center items-center max-lg:px-6"
      style={{
        backgroundImage: `linear-gradient(to right, ${primary}, ${secondary}), url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="max-w-7xl w-full flex max-lg:flex-col max-lg:items-center max-lg:justify-center gap-8">
        <motion.div
          variants={childVariants}
          className="text-white flex flex-col gap-4 w-full max-w-lg max-lg:text-center max-lg:items-center">
          <motion.p
            variants={childVariants}
            style={{ backgroundColor: primary }}
            className="px-4 py-2 rounded-md text-white w-fit max-lg:text-sm">
            Tudo que precisa saber sobre o evento
          </motion.p>

          <motion.h1
            variants={childVariants}
            className="text-4xl font-semibold text-white max-lg:text-2xl">
            Perguntas frequentes
          </motion.h1>
        </motion.div>

        <motion.div className="w-full max-lg:w-full">
          <div className="flex flex-col gap-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 border-b border-white/20 pb-3">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex justify-between items-center cursor-pointer w-full text-left max-lg:gap-4">
                    <span
                      className={`text-lg font-medium transition-colors text-white max-lg:text-base`}>
                      {faq.question.toUpperCase()}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 0 : 180 }}
                      transition={{ duration: 0.4 }}>
                      <ChevronUp className="w-5 h-5 max-lg:w-4 max-lg:h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        className="text-white/70 max-lg:text-sm"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
