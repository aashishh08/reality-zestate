"use client";

import { useState, useEffect } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Right Sidebar - Sticky */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-l-md shadow-lg hover:pr-4 transition-all duration-300 group flex items-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="w-0 overflow-hidden group-hover:w-auto text-sm font-medium whitespace-nowrap">
            WhatsApp
          </span>
        </a>
        <a
          href="tel:+919999999999"
          className="bg-gold text-black p-3 rounded-l-md shadow-lg hover:pr-4 transition-all duration-300 group flex items-center gap-2"
        >
          <Phone className="w-5 h-5" />
           <span className="w-0 overflow-hidden group-hover:w-auto text-sm font-medium whitespace-nowrap">
            Call Now
          </span>
        </a>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 bg-black text-gold border border-gold/30 p-3 rounded-full shadow-2xl hover:bg-gold hover:text-black transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
