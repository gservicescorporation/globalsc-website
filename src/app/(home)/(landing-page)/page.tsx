"use client";

import "swiper/css";
import "swiper/css/effect-fade";
import ImpactNumbers from "./components/ImpactNumber";
import LandingHero from "./components/Hero";
import OurServices from "./components/OurServices";
import OurAdvantages from "./components/OurAdvantages";
import Image from "next/image";
import OurAcademy from "./components/OurAcademy";
import AboutUs from "./components/AboutUs";
import RecentEvents from "../events/components/RecentEvents";
import ContactUs from "./components/ContactUs";

export default function LandingPage() {
  const imgPositions = ["top-[14%] right-0", "top-[59%] left-0"];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center gap-16">
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
      <LandingHero />
      <div className="flex flex-col gap-16 px-8 max-lg:p-0">
        <ImpactNumbers />
        <OurServices />
        <OurAdvantages />
        <OurAcademy />
        <AboutUs />
        <RecentEvents />
        <ContactUs />
      </div>
    </div>
  );
}
