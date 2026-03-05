import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const menus = [
    { name: "Início", href: "/" },
    { name: "Eventos", href: "/events" },
    { name: "Academia", href: "https://academy.globalsc.ao" },
    { name: "Contactos", href: "/contact-us" },
  ];

  const contacts = [
    { label: "+244 222 731 031", href: "tel:+244222731031" },
    { label: "+244 941 064 919", href: "tel:+244941064919" },
    { label: "geral@globalsc.ao", href: "mailto:geral@globalsc.ao" },
  ];

  return (
    <footer
      className="w-full bg-primary text-white flex flex-col items-center justify-center gap-4 py-16 px-44
      max-lg:px-8 max-lg:py-12 max-lg:gap-10">
      <div
        className="w-full flex items-start justify-between gap-8 text-sm h-56
        max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:h-auto max-lg:text-center max-lg:gap-10">
        <div className="flex flex-col gap-4 max-w-sm max-lg:items-center">
          <Image
            src="/logo/white.png"
            alt="Global Service Corporation"
            width={1920}
            height={1040}
            className="w-36 h-auto max-lg:w-28"
          />
          <p className="max-lg:text-sm max-lg:max-w-xs">
            Soluções em seguros, eventos corporativos, consultoria e formação de
            capital humano.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-lg:items-center">
          <h1 className="text-base font-semibold">Menus</h1>
          <ul className="flex flex-col gap-2">
            {menus.map((item) => (
              <li
                key={item.href}
                className="hover:scale-105 transition-all duration-300">
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 max-lg:items-center">
          <h1 className="text-base font-semibold">Contactos</h1>
          <ul className="flex flex-col gap-2">
            {contacts.map((item) => (
              <li
                key={item.href}
                className="hover:scale-105 transition-all duration-300">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col max-w-xs gap-4 w-full max-lg:items-center">
          <h1 className="text-base font-semibold">Newsletter</h1>
          <p className="max-lg:text-sm max-lg:max-w-xs">
            Fique por dentro do conhecimento que transforma.
          </p>
          <form className="flex flex-col gap-2 max-lg:w-full max-lg:items-center">
            <input
              type="email"
              placeholder="Digite o seu email"
              className="py-3 px-4 outline-none bg-white rounded-md text-black max-lg:w-full"
            />
            <button
              type="submit"
              className="btn-secondary w-fit text-xs cursor-pointer max-lg:w-full max-lg:text-sm">
              Subscrever
            </button>
          </form>
        </div>
      </div>

      <hr className="w-full border border-white/50 max-lg:mt-4" />

      <p className="text-center text-xs max-lg:text-[11px] max-lg:px-4">
        © {new Date().getFullYear()} Global Services Corporation. Todos os
        direitos reservados.
      </p>
    </footer>
  );
}
