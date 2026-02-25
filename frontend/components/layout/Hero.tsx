"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const quickLinks = [
  "Trending Projects",
  "Upcoming Projects",
  "Boutique Projects",
  "Superluxere Exclusive",
];

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Luxury Real Estate"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Lighter Premium Overlay */}
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-white/90 text-lg md:text-xl font-medium tracking-[0.3em] mb-4 uppercase drop-shadow-sm">
            Luxury Redefined
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold text-white mb-6 drop-shadow-md">
            SUPERLUXERE
          </h1>
          <p className="max-w-2xl mx-auto text-white/95 text-lg font-light leading-relaxed drop-shadow-sm">
            Discover a curated collection of the most exquisite properties.
            Where elegance meets exclusivity.
          </p>
        </motion.div>
      </div>

      {/* Quick Navigation Bar - Premium Dark Glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  onClick={() => scrollToSection(link.toLowerCase().replace(" ", "-"))}
                  className="group relative h-24 flex flex-col justify-center px-6 hover:bg-white/5 transition-colors duration-300 text-left"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-zinc-500 group-hover:text-gold transition-colors duration-300">
                      0{index + 1}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </div>

                  <span className="text-sm md:text-lg font-serif text-white group-hover:text-gold transition-colors">
                    {link}
                  </span>

                  {/* Bottom Active Line indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
