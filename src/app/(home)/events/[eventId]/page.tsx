"use client";

import { EventDataInterface } from "@/app/interfaces/event-data";
import About from "./components/About";
import ChooseTicket from "./components/ChooseTicket";
import FAQ from "./components/FAQ";
import Hero from "./components/Hero";
import Location from "./components/Location";
import PartnersSponsors from "./components/PartnersSponsors";
import Speakers from "./components/Speakers";
import { use, useEffect, useState } from "react";
import event from "@/app/data/events.json";
import { toast, ToastContainer } from "react-toastify";
import MainMoments from "./components/MainMoments";

export default function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const [eventData, setEventData] = useState<EventDataInterface>();
  const [eventPassed, setEventPassed] = useState(false);

  useEffect(() => {
    const foundEvent = event.events.find((e) => e.id === eventId);
    if (foundEvent) {
      setEventData({
        ...foundEvent,
        event: {
          ...foundEvent.event,
          startDate: foundEvent.event.startDate,
          images: foundEvent.event.images || [],
        },
        about: {
          ...foundEvent.about,
          videoUrl: foundEvent.about.videoUrl || '',
        },
      });
    } else {
      toast.error("Evento não encontrado");
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventData) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventTime = new Date(eventData.event.startDate).getTime();
      setEventPassed(eventTime - now <= 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [eventData]);

  if (!eventData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-4xl font-semibold text-primary">
          Evento não encontrado
        </h1>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center text-white gap-16">
        <Hero
          eventTitle={eventData.event.title}
          imgUrl={eventData.theme.imgUrl}
          primaryColor={eventData.theme.primary}
          secondaryColor={eventData.theme.secondary}
          startDate={new Date(eventData.event.startDate)}
          location={eventData.event.location}
        />

        <About
          title={eventData.event.title}
          description={eventData.about.description}
          primary={eventData.theme.primary}
          imgUrl={eventData.about.imgUrl}
          videoUrl={eventData.about.videoUrl}
        />

        {eventData.partners.logos.length > 0 && (
          <PartnersSponsors
            title={eventData.partners.title}
            subtitle={eventData.partners.subtitle}
            logos={eventData.partners.logos}
          />
        )}

       {/* {!eventPassed && (
          <WhySign
            primary={eventData.theme.primary}
            secondary={eventData.theme.secondary}
            title={eventData.whySign.title}
            subtitle={eventData.whySign.subtitle}
            debates={eventData.whySign.debates}
          />
        )} */}

        {eventPassed && (
          <MainMoments
            primary={eventData.theme.primary}
            secondary={eventData.theme.secondary}
            images={eventData.event.images}
          />
        )}

        {eventData.speakers.speakers.length > 0 && (
          <Speakers
            primary={eventData.theme.primary}
            title={eventData.speakers.title}
            subtitle={eventData.speakers.subtitle}
            speakers={eventData.speakers.speakers}
          />
        )}

        {eventData.sponsors.logos.length > 0 && (
          <PartnersSponsors
            title={eventData.sponsors.title}
            subtitle={eventData.sponsors.subtitle}
            logos={eventData.sponsors.logos}
          />
        )}

        {!eventPassed && !eventData.tickets && (
          <ChooseTicket
            primary={eventData.theme.primary}
            secondary={eventData.theme.secondary}
            imgUrl={eventData.theme.imgUrl}
            tickets={eventData.tickets}
          />
        )}

        {!eventPassed && (
          <Location
            primary={eventData.theme.primary}
            title={eventData.location.title}
            subtitle={eventData.location.subtitle}
            images={eventData.location.images}
            address={eventData.location.address}
            phone={eventData.location.phone}
            email={eventData.location.email}
          />
        )}

        {!eventPassed && (
          <FAQ
            primary={eventData.theme.primary}
            secondary={eventData.theme.secondary}
            imgUrl={eventData.faqs.imgUrl}
            faqs={eventData.faqs.questions}
          />
        )}
      </div>
    </>
  );
}
