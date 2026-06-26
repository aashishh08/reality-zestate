"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SCROLL_THRESHOLDS, CONTACT_INFO } from "@/lib/constants";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";

const whatsappHref = `https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER.replace(/\D/g, "")}`;
const telHref = `tel:${CONTACT_INFO.PHONE_NUMBER}`;

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > SCROLL_THRESHOLDS.SCROLL_TO_TOP_BUTTON);
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Desktop — right sidebar */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          onClick={() => trackWhatsAppClick({ placement: 'floating_actions_desktop' })}
          className="bg-[#25D366] text-white p-3 rounded-l-md shadow-lg hover:pr-4 transition-all duration-300 group flex items-center gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="w-0 overflow-hidden group-hover:w-auto text-sm font-medium whitespace-nowrap">
            WhatsApp
          </span>
        </a>
        <a
          href={telHref}
          aria-label="Call us now"
          onClick={() => trackPhoneClick({ placement: 'floating_actions_desktop' })}
          className="bg-gold text-black p-3 rounded-l-md shadow-lg hover:pr-4 transition-all duration-300 group flex items-center gap-2"
        >
          <Phone className="w-5 h-5" />
          <span className="w-0 overflow-hidden group-hover:w-auto text-sm font-medium whitespace-nowrap">
            Call Now
          </span>
        </a>
      </div>

      {/* Mobile — bottom contact bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-black/10 bg-[#FDFBF7]/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          onClick={() => trackWhatsAppClick({ placement: 'floating_actions_mobile' })}
          className="flex-1 flex items-center justify-center gap-2 min-h-[3.25rem] bg-[#25D366] text-white text-sm font-semibold tracking-wide touch-manipulation active:bg-[#1fb855] transition-colors"
        >
          <MessageCircle className="w-5 h-5 shrink-0" />
          WhatsApp
        </a>
        <a
          href={telHref}
          aria-label="Call us now"
          onClick={() => trackPhoneClick({ placement: 'floating_actions_mobile' })}
          className="flex-1 flex items-center justify-center gap-2 min-h-[3.25rem] bg-gold text-black text-sm font-semibold tracking-wide touch-manipulation active:bg-gold-dark transition-colors"
        >
          <Phone className="w-5 h-5 shrink-0" />
          Call Now
        </a>
      </div>

      {/* Scroll to top — sits above mobile contact bar */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed z-40 bg-black text-gold border border-gold/30 p-3 rounded-full shadow-2xl hover:bg-gold hover:text-black transition-colors touch-manipulation bottom-[max(4.75rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] md:bottom-8 md:right-8"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
