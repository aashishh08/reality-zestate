"use client";

import Image from "next/image";
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
    <div className="relative h-[78vh] sm:h-[85vh] md:h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/home-hero-superluxere.png"
          alt="Luxury Real Estate"
          fill
          sizes="100vw"
          className="object-cover object-center md:object-cover md:object-center"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Lighter Premium Overlay */}
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center overflow-visible px-6 sm:px-10 md:px-12 min-w-0">
        <div className="w-full min-w-0 max-w-6xl overflow-visible animate-fade-in-up animation-delay-200">
          <p className="max-w-3xl mx-auto text-white/95 text-base sm:text-lg md:text-2xl font-serif font-medium leading-relaxed tracking-[0.02em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            At <span className="text-gold font-semibold">Superluxere</span>, discover a curated collection of the most exquisite properties.
            <span className="block mt-1.5 text-white/90 italic">Where elegance meets exclusivity.</span>
          </p>
        </div>
      </div>

      {/* Quick Navigation Bar - Premium Dark Glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.8)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {quickLinks.map((link, index) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase().replace(" ", "-"))}
                  type="button"
                  className="group relative min-h-[5.5rem] sm:h-24 flex flex-col justify-center px-3 py-3 sm:px-6 hover:bg-white/5 transition-colors duration-300 text-left touch-manipulation animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
