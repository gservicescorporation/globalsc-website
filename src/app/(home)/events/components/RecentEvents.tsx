"use client";

import { motion } from "framer-motion";
import EventsCard from "../../../ui/EventsCard";
import Link from "next/link";
import events from "@/app/data/events.json";

export default function RecentEvents() {
  const today = new Date();

  const pastEvents = events.events
    .filter((event) => new Date(event.event.startDate) < today)
    .sort(
      (a, b) =>
        new Date(b.event.startDate).getTime() -
        new Date(a.event.startDate).getTime()
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col justify-center items-center gap-12 max-w-7xl py-8 z-10 w-full
      max-lg:gap-10 max-lg:px-6 max-lg:py-10 ">
      <div className="text-main flex flex-col justify-center items-center w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold max-lg:text-2xl">
          Eventos recentes
        </h1>
        <p className="text-tertiary font-medium max-lg:text-sm max-lg:mt-2">
          Fique por dentro dos nossos eventos mais recentes e das novidades que
          estamos trazendo para você.
        </p>
      </div>

      <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-start gap-8 max-lg:px-0 max-lg:justify-center list-none">
        {pastEvents.length > 0 ? (
          pastEvents.slice(0, 3).map((event) => (
            <li
              key={event.id}
              className="max-lg:w-full">
              <EventsCard
                date={new Date(event.event.startDate)}
                description={event.event.description}
                imgUrl={event.theme.imgUrl}
                link={`/events/${event.id}`}
                title={event.event.title}
                variant="primary"
                lastTickets={true}
              />
            </li>
          ))
        ) : (
          <div className="flex w-full justify-center items-center min-h-96 h-full">
            <p className="text-tertiary text-lg max-lg:text-sm text-center">
              Em breve, mostraremos aqui os eventos já realizados!
            </p>
          </div>
        )}
      </div>

      {pastEvents.length > 3 && (
        <Link
          href="/events/all"
          className="btn-quaternary max-lg:text-sm max-lg:px-5 max-lg:py-2">
          Ver todos
        </Link>
      )}
    </motion.div>
  );
}
