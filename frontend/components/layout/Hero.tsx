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
      <div className="relative h-full flex flex-col items-center justify-center text-center overflow-visible px-6 sm:px-10 md:px-12 min-w-0">
        <motion.div
          className="w-full min-w-0 max-w-6xl overflow-visible"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="mb-6 md:mb-8 flex flex-wrap items-baseline justify-center gap-x-0 overflow-visible px-1 sm:px-2">
            <span
              className="text-superluxere-rose-metallic text-superluxere-rose-metallic--script font-[family-name:var(--font-great-vibes)] text-[3.5rem] leading-[1.12] sm:text-7xl sm:leading-[1.1] md:text-8xl md:leading-[1.08] lg:text-9xl lg:leading-[1.05] xl:text-9xl xl:leading-[1.05] min-[1920px]:text-[9.5rem] min-[1920px]:leading-[1.04]"
            >
              Superluxe
            </span>
            <span className="text-superluxere-rose-metallic -ms-1.5 sm:-ms-2 md:-ms-2.5 font-sans font-bold tracking-[-0.04em] leading-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] min-[1920px]:text-[7.25rem]">
              RE
            </span>
            <span className="sr-only"> — luxury real estate</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/95 text-lg font-light leading-relaxed drop-shadow-sm">
            Discover a curated collection of the most exquisite properties.
            Where elegance meets exclusivity.
          </p>
        </motion.div>
      </div>

      {/* Quick Navigation Bar - Premium Dark Glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  onClick={() => scrollToSection(link.toLowerCase().replace(" ", "-"))}
                  type="button"
                  className="group relative min-h-[5.5rem] sm:h-24 flex flex-col justify-center px-3 py-3 sm:px-6 hover:bg-white/5 transition-colors duration-300 text-left touch-manipulation"
                >
                  <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2 gap-1">
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-zinc-500 group-hover:text-gold transition-colors duration-300">
                      0{index + 1}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block" />
                  </div>

                  <span className="text-xs sm:text-sm md:text-lg font-serif text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
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
