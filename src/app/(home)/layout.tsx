"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header
        variant={`${pathname === "/contact-us" ? "secondary" : "primary"}`}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1">
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
