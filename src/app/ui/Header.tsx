"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type HeaderProps = {
  variant: "primary" | "secondary";
};

export default function Header({ variant }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAbout = () => {
    const section = document.getElementById("sobre-nos");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      scrollToAbout();
    } else {
      localStorage.setItem("scrollToAbout", "true");
      router.push("/");
    }
  };

  const navigationLinks = [
    { name: "Início", href: "/" },
    { name: "Sobre nós", href: "/#sobre-nos", onClick: handleAboutClick },
    { name: "Eventos", href: "/events" },
    { name: "Academia", href: "https://academy.globalsc.ao", target: "_blank" },
    { name: "Contactos", href: "/contact-us" },
  ];

  useEffect(() => {
    if (pathname === "/" && localStorage.getItem("scrollToAbout") === "true") {
      setTimeout(() => {
        scrollToAbout();
        localStorage.removeItem("scrollToAbout");
      }, 600);
    }
  }, [pathname]);

  return (
    <>
      <header
        className={`w-full flex justify-center items-center px-24 py-4 fixed top-0 left-0 z-50 transition-all duration-300
        ${variant === "primary" ? "text-background" : ""}
        ${variant === "secondary" ? "text-primary" : ""}
        ${
          scrolled && variant === "primary"
            ? "bg-primary/40 backdrop-blur-sm"
            : ""
        }
        ${
          scrolled && variant === "secondary"
            ? "bg-primary/40 backdrop-blur-sm text-white"
            : ""
        }
        max-lg:px-6 
      `}>
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="flex items-center gap-20 max-lg:gap-6">
            <Link href={"/"}>
              <Image
                src={`${
                  variant === "primary"
                    ? "/logo/white.png"
                    : variant === "secondary"
                    ? "/logo/black.png"
                    : "/logo/white.png"
                }`}
                width={1000}
                height={912}
                alt="Logotipo Global Services Corporation"
                className="w-24 h-auto max-lg:w-20"
              />
            </Link>

            <ul className="flex gap-10 max-lg:hidden">
              {navigationLinks.map((link) => (
                <li
                  key={link.name}
                  className="font-medium hover:scale-105 transition-transform duration-300">
                  <Link
                    href={link.href}
                    onClick={link.onClick}
                    target={link.target}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/contact-us"
            className={`max-lg:hidden ${
              variant === "primary"
                ? "btn-secondary"
                : variant === "secondary" && "btn-primary"
            }`}>
            Entrar em contacto <ArrowRight className="w-5" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hidden max-lg:flex items-center justify-center">
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-14 left-0 w-full py-6 bg-primary/40 backdrop-blur-sm text-white flex flex-col items-center justify-center gap-6 z-40">
            {navigationLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}>
                <Link
                  href={link.href}
                  target={link.target}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setMenuOpen(false);
                  }}
                  className="text-lg font-medium transition-transform">
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}>
              <Link
                href="/contact-us"
                onClick={() => setMenuOpen(false)}
                className={`${
                  variant === "primary"
                    ? "btn-secondary"
                    : variant === "secondary" && "btn-primary"
                } flex items-center gap-2`}>
                Entrar em contacto <ArrowRight className="w-5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
