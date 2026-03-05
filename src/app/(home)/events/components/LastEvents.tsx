"use client";

import EventsCard from "@/app/ui/EventsCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import events from "@/app/data/events.json";

export default function LastEvents() {
  const [sortOrder, setSortOrder] = useState("a-z");

  const today = new Date();

  const upcomingEvents = (events.events ?? []).filter((event) => {
    const eventDate = new Date(event.event.startDate);
    return eventDate > today;
  });

  const filteredEvents = upcomingEvents.sort((a, b) => {
    if (sortOrder === "a-z") return a.event.title.localeCompare(b.event.title);
    if (sortOrder === "z-a") return b.event.title.localeCompare(a.event.title);
    if (sortOrder === "recentes")
      return (
        new Date(b.event.startDate).getTime() -
        new Date(a.event.startDate).getTime()
      );
    if (sortOrder === "antigos")
      return (
        new Date(a.event.startDate).getTime() -
        new Date(b.event.startDate).getTime()
      );
    return 0;
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full max-w-7xl flex flex-col items-center gap-12 z-10 px-6 max-lg:gap-10">
      <nav className="w-full flex justify-between items-center gap-8 max-lg:flex-col max-lg:gap-6">
        <h1 className="text-3xl font-semibold text-main max-lg:text-2xl max-lg:text-center">
          Próximos eventos
        </h1>

        <ul className="flex items-center gap-4 max-lg:flex-wrap max-lg:w-full max-lg:justify-between z-10">
          <li className="bg-input/24 rounded-full px-5 py-4 lg:w-56 w-full flex justify-between items-center gap-4 text-lg font-semibold max-lg:px-4 max-lg:py-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-none w-full text-main outline-none cursor-pointer max-lg:text-sm">
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="recentes">Mais recentes</option>
              <option value="antigos">Mais antigos</option>
            </select>
          </li>
        </ul>
      </nav>

      <ul className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center gap-8 max-lg:px-0 max-lg:justify-center">
        {filteredEvents.length > 0 ? (
          filteredEvents.slice(0, 6).map((event) => (
            <li key={event.id}>
              <EventsCard
                date={new Date(event.event.startDate)}
                description={event.event.description}
                imgUrl={event.coverUrl}
                link={`/events/${event.id}`}
                title={event.event.title}
                variant="secondary"
                lastTickets={true}
              />
            </li>
          ))
        ) : (
          <div className="flex w-full justify-center lg:col-span-3 md:col-span-2 sm:col-span-1 items-center min-h-96 h-full">
            <p className="text-tertiary text-lg text-center">
              Sem novos eventos por agora.
            </p>
          </div>
        )}
      </ul>

      {(filteredEvents.length ?? 0) > 6 && (
        <Link
          href="/events/all"
          className="btn-quaternary max-lg:text-sm max-lg:px-6">
          Ver todos
        </Link>
      )}
    </motion.section>
  );
}
