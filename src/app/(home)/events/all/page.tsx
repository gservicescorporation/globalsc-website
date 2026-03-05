import Image from "next/image";
import AllEvents from "./components/AllEvents";

export default function EventsPage() {
  const imgPositions = ["top-[22%] right-0", "top-[80%] left-0"];

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col items-center gap-16 max-lg:gap-8 mb-16">
      <div className="bg-[url('/images/people-sit.png')] w-full h-124 z-10 max-lg:h-80 bg-cover bg-center">
        <div className="bg-gradient-to-r from-event/80 to-primary/80 w-full h-full flex justify-center items-center px-4 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold text-white max-lg:text-2xl">
              Nossos eventos
            </h1>
            <p className="text-gray-200 font-medium max-lg:text-sm max-lg:mt-2">
              Veja todos os eventos realizados pela Global Services Corporation
            </p>
          </div>
        </div>
      </div>

      {imgPositions.map((position, index) => (
        <Image
          key={index}
          src="/logo-opacity.png"
          alt="Logo decorativo"
          width={2400}
          height={1480}
          className={`w-1/2 absolute ${position} pointer-events-none select-none max-lg:w-3/4 max-lg:opacity-40`}
        />
      ))}

      <AllEvents />
    </div>
  );
}
