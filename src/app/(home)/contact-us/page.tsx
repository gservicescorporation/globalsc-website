"use client";

import Image from "next/image";
import ContactUsForm from "./components/ContactUsForm";
import { Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function ContactUs() {
  const imgPositions = ["top-[-14%] right-0"];
  const {} = useForm();

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center gap-16 py-24 lg:px-8 overflow-hidden">
      {imgPositions.map((position, index) => (
        <Image
          key={index}
          src="/logo-opacity.png"
          alt="Footer Background"
          width={2400}
          height={1480}
          className={`w-1/2 absolute ${position} pointer-events-none select-none z-0 opacity-70 max-lg:w-[90%] max-lg:top-[5%] max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2`}
        />
      ))}

      <div
        className="mt-12 gap-12 flex flex-row-reverse justify-between max-w-7xl w-full items-center h-full relative z-10 
      max-lg:flex-col-reverse max-lg:items-center max-lg:gap-16 max-lg:px-6">
        <div className="w-1/2 max-lg:w-full">
          <ContactUsForm />
        </div>

        <div
          className="flex flex-col gap-6 w-1/2 text-main px-12 
        max-lg:w-full max-lg:px-0 max-lg:text-center">
          <div className="flex flex-col gap-2 max-lg:items-center">
            <h1 className="text-4xl font-semibold max-lg:text-2xl">
              Entre em contacto de forma simples.
            </h1>
            <p className="max-lg:text-base">
              Descubra a gama completa de soluções que preparamos para si e para
              a sua empresa.
            </p>
          </div>

          <ul className="flex flex-col gap-6 max-lg:items-center max-lg:gap-8">
            <li className="flex items-center gap-4 max-lg:flex-col max-lg:text-center">
              <Mail className="w-10 h-10 text-[#1881EE]" />
              <span>
                <h1 className="font-semibold">Endereço de e-mail</h1>
                <Link
                  href={"mailto:comercial@globalsc.ao"}
                  className="text-[#1881EE] hover:underline">
                  comercial@globalsc.ao
                </Link>
              </span>
            </li>

            <li className="flex items-center gap-4 max-lg:flex-col max-lg:text-center">
              <Phone className="w-10 h-10 text-[#1881EE]" />
              <span>
                <h1 className="font-semibold">Ligue para nós</h1>
                <Link
                  href={"tel:+244941064919"}
                  className="text-[#1881EE] hover:underline">
                  +244 941 064 919
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
