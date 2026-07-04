"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Developer } from "@/lib";
import { useLeadModal } from "@/lib/contexts/LeadModalContext";

interface SuperluxereExclusiveProps {
  developers: Developer[];
}

export function SuperluxereExclusive({ developers }: SuperluxereExclusiveProps) {
  const { openModal } = useLeadModal();
  const partnerLine =
    developers.length > 0
      ? `Partner roster on-platform includes ${developers
          .slice(0, 5)
          .map((d) => d.name)
          .join(" · ")}${developers.length > 5 ? " · …" : ""}.`
      : null;

  return (
    <section id="superluxere-exclusive" className="relative py-6 md:py-32 px-4 sm:px-6 bg-[#F5F5F0] text-foreground overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Exclusive Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F0] via-[#F5F5F0]/95 to-[#F5F5F0]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-1.5 md:gap-2 text-gold-dark mb-3 md:mb-6">
              <Star className="w-3.5 h-3.5 md:w-5 md:h-5 fill-gold-dark shrink-0" />
              <span className="tracking-[0.2em] uppercase text-[10px] md:text-sm font-bold">Members Only</span>
            </div>

            <h2 className="text-2xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 md:mb-8 leading-tight text-black">
              Superluxere <br />
              <span className="text-gold-dark">Exclusive</span>
            </h2>

            <p
              className={`text-sm md:text-xl text-zinc-600 font-light leading-relaxed max-w-lg line-clamp-3 md:line-clamp-none ${
                partnerLine ? "mb-3 md:mb-6" : "mb-5 md:mb-10"
              }`}
            >
              Unlock access to off-market listings, pre-launch opportunities, and high-yield real estate investments reserved strictly for our inner circle.
            </p>
            {partnerLine ? (
              <p className="text-xs md:text-sm text-zinc-500 font-medium leading-relaxed mb-5 md:mb-10 max-w-lg line-clamp-2 md:line-clamp-none">
                {partnerLine}
              </p>
            ) : null}

            <ul className="space-y-2 md:space-y-4 mb-5 md:mb-10">
              {["Off-Market Listings", "Priority Allocations", "Dedicated Wealth Manager"].map((item) => (
                <li key={item} className="flex items-center gap-2 md:gap-3 text-zinc-700 font-medium text-xs md:text-base">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-gold-dark shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openModal("superluxere-exclusive-section")}
              className="w-full sm:w-auto bg-gradient-to-r from-gold to-gold-dark text-white px-6 py-3 md:px-10 md:py-4 rounded-sm text-xs md:text-base font-bold tracking-wide hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 md:transform md:hover:-translate-y-1"
            >
              JOIN THE INNER CIRCLE
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[600px] w-full hidden lg:block rounded-t-full overflow-hidden border border-black/5 shadow-2xl"
          >
            <Image
              src="/images/hero-bg.png"
              alt="Exclusive Interior"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-10 left-0 right-0 text-center px-6">
              <p className="text-lg font-serif italic text-white/90">"Luxury is not a place, it's an experience."</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
