import Image from "next/image";

interface ServicesCardProps {
  variant: "primary" | "secondary";
  iconUrl: string;
  title: string;
  description: string;
}

export default function ServicesCard({
  variant,
  iconUrl,
  title,
  description,
}: ServicesCardProps) {
  return (
    <div
      className={`${
        variant === "primary" ? "text-white" : "text-main"
      } flex flex-col items-center justify-center gap-3 active:scale-10 rounded-md hover:scale-105 transition-all duration-400 cursor-pointer  max-w-xs w-full px-4 py-6 text-center`}>
      <Image
        src={iconUrl}
        alt="Our Services"
        width={600}
        height={400}
        className="w-16"
      />

      <h2
        className={`font-semibold ${
          variant === "primary"
            ? "text-2xl max-lg:text-xl"
            : "text-xl max-lg:text-base"
        } `}>
        {title}
      </h2>

      <p className="font-medium text-sm">{description}</p>
    </div>
  );
}
