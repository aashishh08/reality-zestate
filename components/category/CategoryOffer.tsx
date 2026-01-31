"use client";

import { motion } from "framer-motion";
import { Gift, Calendar } from "lucide-react";

interface CategoryOfferProps {
  offer: {
    title: string;
    description: string;
    validTill: string;
  };
}

export function CategoryOffer({ offer }: CategoryOfferProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-gold via-yellow-500 to-gold-dark">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
            <Gift className="w-10 h-10 text-gold" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
            {offer.title}
          </h2>
          
          <p className="text-lg md:text-xl text-black/80 mb-8 leading-relaxed">
            {offer.description}
          </p>
          
          <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Valid till {offer.validTill}</span>
          </div>
          
          <div className="mt-10">
            <button className="bg-black text-white px-10 py-4 rounded-sm font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 shadow-xl">
              Claim This Offer
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
