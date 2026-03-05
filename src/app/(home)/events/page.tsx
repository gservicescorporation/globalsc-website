"use client";

import Image from "next/image";
import EventsStats from "./components/EventsStats";
import EventsHero from "./components/Hero";
import LastEvents from "./components/LastEvents";
import InterestPartnership from "./components/InterestPartnership";
import OurBrands from "./components/OurBrands";
import OurPartners from "./components/OurPartners";
import RecentEvents from "./components/RecentEvents";

export default function EventsPage() {
  const imgPositions = ["top-[22%] right-0", "top-[80%] left-0"];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center gap-16 pb-16">
      {imgPositions.map((position, index) => (
        <Image
          key={index}
          src="/logo-opacity.png"
          alt="Footer Background"
          width={2400}
          height={1480}
          className={`w-1/2 absolute ${position} pointer-events-none select-none z-0`}
        />
      ))}
      <EventsHero />

      <div className="flex flex-col gap-16 px-8 max-lg:p-0">
        <EventsStats />
        <LastEvents />
        <OurBrands />
        <OurPartners />
        <RecentEvents />
        <InterestPartnership />
      </div>
    </div>
  );
}
