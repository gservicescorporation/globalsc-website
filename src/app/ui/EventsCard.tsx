import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDateCalendar } from "../utils/formatDate";

interface EventsCardProps {
  variant?: "primary" | "secondary";
  imgUrl: string;
  title: string;
  description?: string;
  link: string;
  date?: Date;
  lastTickets?: boolean;
}

export default function EventsCard({
  date,
  description,
  imgUrl,
  link,
  title,
  variant,
  lastTickets,
}: EventsCardProps) {
  const { mes, dia } = getDateCalendar(date || new Date());

  return (
    <div
      className={`w-full max-w-sm flex flex-col rounded-2xl hover:scale-105 transition-transform duration-300 text-main relative max-lg:max-w-full`}>
      <Image
        src={imgUrl}
        alt={title}
        width={1920}
        height={1040}
        className={`w-full rounded-t-2xl shadow-lg h-76 object-cover object-center max-lg:h-64`}
      />

      {!lastTickets && (
        <p className="text-xs text-white font-medium bg-blue-500 w-fit px-2 py-1 rounded-md absolute top-5 right-5 max-lg:text-[10px] max-lg:top-3 max-lg:right-3">
          Últimos ingressos
        </p>
      )}

      <div
        className={`bg-white rounded-b-2xl shadow-lg flex flex-col gap-4 transition-all duration-300 ${
          variant === "primary"
            ? "h-62 justify-between p-6 max-lg:h-56 max-lg:p-4"
            : variant === "secondary" && "h-62 p-5 max-lg:h-56 max-lg:p-4"
        }`}>
        {variant === "primary" && (
          <>
            <span className="flex flex-col gap-2">
              <h2 className={`text-lg font-semibold max-lg:text-base`}>
                {title}
              </h2>
              <p className={`text-gray-600 text-sm max-lg:text-xs`}>
                {description && description.slice(0, 80) + "..."}
              </p>
            </span>

            <Link
              href={link}
              className={`flex items-center gap-2 font-semibold p-2 rounded-md hover:bg-gray-50 w-fit transition-colors duration-300 max-lg:text-sm max-lg:gap-1`}>
              Saber mais <ArrowRight className="w-4 max-lg:w-3" />
            </Link>
          </>
        )}

        {variant === "secondary" && (
          <Link
            href={link}
            className={`flex gap-3 items-start`}>
            {date && (
              <span className="text-sm font-medium flex flex-col items-center bg-input/24 rounded-lg px-3 py-2 justify-center max-lg:px-2 max-lg:py-1">
                <p className="text-xs">{mes}</p>
                <p className="text-2xl font-bold">{dia}</p>
              </span>
            )}

            <span className="flex flex-col gap-1">
              <h2 className={`text-lg font-semibold max-lg:text-base`}>
                {title}
              </h2>
              <p className="text-sm text-tertiary max-lg:text-xs">
                {description?.slice(0, 125) + "..."}
              </p>
            </span>
          </Link>
        )}

        {variant === "secondary" && (
          <Link
            href={link}
            className={`btn-primary flex max-lg:text-sm max-lg:gap-1`}>
            Saber mais <ArrowRight className="w-4 max-lg:w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}