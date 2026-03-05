"use client";

import EventsCard from "@/app/ui/EventsCard";
import { useState } from "react";
import events from "@/app/data/events.json";

export default function AllEvents() {
  const [sortOrder, setSortOrder] = useState("recentes");
  const [year, setYear] = useState("all");

  const filteredEvents = (events.events ?? [])
    .filter((event) => {
      if (
        year !== "all" &&
        new Date(event.event.startDate).getFullYear().toString() !== year
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "a-z")
        return a.event.title.localeCompare(b.event.title);
      if (sortOrder === "z-a")
        return b.event.title.localeCompare(a.event.title);
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
    <section className="w-full max-w-7xl flex flex-col items-center gap-12 z-10 max-lg:gap-8 max-lg:px-4">
      <nav className="w-full flex justify-between items-center gap-8 max-lg:flex-col max-lg:gap-4">
        <h1 className="text-3xl font-semibold text-main max-lg:text-2xl max-lg:text-center">
          Filtros
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

          <li className="bg-input/24 rounded-full px-5 py-4 lg:w-56 w-full flex justify-between items-center gap-4 text-lg font-semibold  max-lg:px-4 max-lg:py-3">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-none w-full text-main outline-none cursor-pointer max-lg:text-sm">
              <option value="all">Todos anos</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </li>
        </ul>
      </nav>

      <ul className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-start gap-8 max-lg:px-0 max-lg:justify-center">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const today = new Date();
            const variant =
              new Date(event.event.startDate) < today ? "primary" : "secondary";

            return (
              <li
                key={event.id}
                className="max-lg:w-full">
                <EventsCard
                  date={new Date(event.event.startDate)}
                  description={event.event.description}
                  imgUrl={event.theme.imgUrl}
                  link={`/events/${event.id}`}
                  title={event.event.title}
                  variant={variant}
                  lastTickets={true}
                />
              </li>
            );
          })
        ) : (
          <div className="flex w-full justify-center items-center h-96 row-span-3 col-span-3">
            <p className="text-tertiary text-lg text-center">
              Nenhum evento encontrado.
            </p>
          </div>
        )}
      </ul>
    </section>
  );
}
