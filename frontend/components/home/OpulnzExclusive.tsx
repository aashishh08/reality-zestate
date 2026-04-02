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
    <section id="superluxere-exclusive" className="relative py-32 px-6 bg-[#F5F5F0] text-foreground overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/project-5.jpg"
          alt="Exclusive Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5F0] via-[#F5F5F0]/95 to-[#F5F5F0]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-gold-dark mb-6">
              <Star className="w-5 h-5 fill-gold-dark" />
              <span className="tracking-[0.2em] uppercase text-sm font-bold">Members Only</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight text-black">
              Superluxere <br />
              <span className="text-gold-dark">Exclusive</span>
            </h2>

            <p
              className={`text-xl text-zinc-600 font-light leading-relaxed max-w-lg ${
                partnerLine ? "mb-6" : "mb-10"
              }`}
            >
              Unlock access to off-market listings, pre-launch opportunities, and high-yield real estate investments reserved strictly for our inner circle.
            </p>
            {partnerLine ? (
              <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-10 max-w-lg">
                {partnerLine}
              </p>
            ) : null}

            <ul className="space-y-4 mb-10">
              {["Off-Market Listings", "Priority Allocations", "Dedicated Wealth Manager"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-zinc-700 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => openModal("superluxere-exclusive-section")}
              className="bg-gradient-to-r from-gold to-gold-dark text-white px-10 py-4 rounded-sm font-bold tracking-wide hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:-translate-y-1"
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
              src="/images/project-2.jpg"
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
