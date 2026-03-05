"use client";

import { use, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EventDataInterface } from "@/app/interfaces/event-data";
import { toast } from "react-toastify";
import event from "@/app/data/events.json";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/app/utils/formatPrice";
import { TicketCheck } from "lucide-react";

type Ticket = {
  id: string;
  ticketName: string;
  benefits: string[];
  price: number;
};

export default function GetTicket({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);

  const [eventData, setEventData] = useState<EventDataInterface>();
  const [cart, setCart] = useState<{ ticket: Ticket; qty: number }[]>([]);
  const router = useRouter();
  const resumoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findedEvent = event.events.find((event) => event.id === eventId);
    if (findedEvent) {
      setEventData({
        ...findedEvent,
        event: {
          ...findedEvent.event,
          startDate: findedEvent.event.startDate,
          images: findedEvent.event.images ?? [],
        },
      });
    } else {
      toast.error("Evento não encontrado");
    }
  }, [eventId]);

  const addToCart = (ticket: Ticket) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.ticket.id === ticket.id);
      if (exists) {
        return prev.map((item) =>
          item.ticket.id === ticket.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ticket, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.ticket.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.ticket.id === id ? { ...item, qty } : item))
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.ticket.price * item.qty,
    0
  );

  const handleSubmit = () => {
    localStorage.setItem("cart-data", JSON.stringify(cart));
    localStorage.setItem("cart-total", JSON.stringify(total));
    router.push(`/events/${eventId}/get-ticket/payment`);
  };

  const handleScrollToResumo = () => {
    if (window.innerWidth <= 1024 && resumoRef.current) {
      resumoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      className="min-h-screen flex w-full justify-center items-start py-24 px-8 text-secondary max-lg:px-4"
      style={{
        backgroundImage: `linear-gradient(to right, ${eventData?.theme.primary}, ${eventData?.theme.secondary}), url(${eventData?.theme.imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div className="flex items-start justify-start w-full max-w-7xl gap-12 max-lg:flex-col max-lg:gap-8 max-lg:items-center">
        <div className="w-full max-lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold mb-6 text-white max-lg:text-lg">
            Tickets de Acesso - {eventData?.event.title}
          </motion.h2>

          <div className="flex flex-wrap gap-4 justify-start max-lg:justify-center">
            {eventData?.tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl w-full sm:w-[45%] backdrop-blur-sm bg-white/10 p-6 text-white shadow-lg max-lg:w-full">
                <h3 className="text-lg font-bold">{ticket.ticketName}</h3>
                <p className="text-lg font-semibold mt-2">
                  {formatPrice(ticket.price)} AOA
                </p>
                <p className="text-sm mt-1">
                  {new Date(eventData?.event.startDate).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(ticket)}
                  style={{ backgroundColor: eventData?.theme.primary }}
                  className="mt-4 w-full py-2 rounded-xl font-bold">
                  Adicionar
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {cart.length > 0 && (
          <div
            ref={resumoRef} // 👈 referência aqui
            className="flex flex-col max-w-154 w-full max-lg:w-full">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold mb-6 text-white max-lg:text-lg max-lg:text-center">
              Resumo da reserva
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: `${eventData?.theme.secondary}`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full p-6 rounded-xl backdrop-blur-xs shadow-md mb-6 text-white max-lg:p-4">
              {cart.map((item) => (
                <div
                  key={item.ticket.id}
                  className="flex justify-between items-center mb-4 max-lg:flex-col max-lg:items-start max-lg:gap-2">
                  <div>
                    <h3 className="font-bold">{item.ticket.ticketName}</h3>
                    <p className="text-sm text-white/80">
                      {formatPrice(item.ticket.price)} AOA
                    </p>
                  </div>

                  <div className="flex items-center gap-3 max-lg:w-full max-lg:justify-between">
                    <button
                      onClick={() => updateQty(item.ticket.id, item.qty - 1)}
                      style={{ background: `${eventData?.theme.primary}` }}
                      className="px-3 py-1 rounded hover:scale-105 transition-all">
                      -
                    </button>
                    <span className="font-bold text-xl max-lg:text-base">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.ticket.id, item.qty + 1)}
                      style={{ background: `${eventData?.theme.primary}` }}
                      className="px-3 py-1 rounded hover:scale-105 transition-all">
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.ticket.id)}
                      className="text-red-500 ml-4 text-sm cursor-pointer hover:scale-105 transition-all max-lg:ml-2">
                      Remover
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center border-t pt-4 mt-4 max-lg:flex-col max-lg:gap-2 max-lg:text-center">
                <p className="font-semibold">Valor estimado</p>
                <p className="text-lg font-bold text-white">
                  {formatPrice(total)} AOA
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: eventData?.theme.primary }}
                onClick={handleSubmit}
                className="w-full mt-4 py-3 rounded-xl text-white font-bold">
                Prosseguir para pagamento
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <button
          onClick={handleScrollToResumo}
          className="lg:hidden fixed flex gap-2 bottom-5 right-5 rounded-full bg-white text-primary p-4 border border-white hover:text-white hover:bg-transparent transition-colors duration-300 cursor-pointer font-medium shadow-lg">
          <TicketCheck /> Resumo
        </button>
      )}
    </div>
  );
}
