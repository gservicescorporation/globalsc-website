import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      <div className="flex flex-col items-center justify-center text-main">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl max-lg:text-xl">Página não encontrada.</p>

        <Link
          href={"/"}
          className="text-blue-500 hover:scale-105 transition-all duration-300 font-semibold">
          Voltar para a página inicial.
        </Link>
      </div>

      <Image
        src="/logo-opacity.png"
        alt="Footer Background"
        width={2400}
        height={1480}
        className={`w-1/2 absolute right-0 pointer-events-none select-none z-0`}
      />

      <p className="text-center text-xs absolute bottom-5 font-medium">
        © {new Date().getFullYear()} Global Services Corporation. Todos os
        direitos reservados.
      </p>
    </section>
  );
}
