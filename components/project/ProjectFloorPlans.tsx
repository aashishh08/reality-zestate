"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

interface ProjectFloorPlansProps {
  floorPlans: {
    type: string;
    superArea: string;
    price: string;
    image: string;
  }[];
}

export function ProjectFloorPlans({ floorPlans }: ProjectFloorPlansProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="floor-plans" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Master <span className="text-gold-dark">Floor Plans</span>
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto mb-10">
            Choose from our meticulously designed layouts, each crafted to maximize space, light, and ventilation.
          </p>

          {/* Type Switcher Tabs */}
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-black/5">
            {floorPlans.map((plan, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  activeTab === index
                    ? "bg-black text-white shadow-md"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                }`}
              >
                {plan.type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Details Panel (4 cols) */}
          <motion.div 
             className="lg:col-span-4 order-2 lg:order-1"
             key={`details-${activeTab}`}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-8 rounded-sm border border-black/5 shadow-sm">
              <h3 className="text-3xl font-serif font-bold text-black mb-2">{floorPlans[activeTab].type}</h3>
              <p className="text-zinc-500 font-medium mb-8 uppercase tracking-widest text-xs">Unit Type</p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span className="text-zinc-600">Super Area</span>
                  <span className="font-bold text-black text-lg">{floorPlans[activeTab].superArea}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span className="text-zinc-600">Starting Price</span>
                  <span className="font-bold text-gold-dark text-lg">{floorPlans[activeTab].price}</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-sm font-bold tracking-wide hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group">
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Download Layout
              </button>
            </div>

            <div className="mt-6 p-6 bg-gold/5 rounded-sm border border-gold/10">
              <p className="text-zinc-700 text-sm italic">
                "This {floorPlans[activeTab].type} layout offers exceptional cross-ventilation and privacy, perfectly suited for modern family living."
              </p>
            </div>
          </motion.div>

          {/* Right: Interactive Image Area (8 cols) */}
          <motion.div 
            className="lg:col-span-8 order-1 lg:order-2"
            key={`image-${activeTab}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[16/10] bg-white rounded-sm overflow-hidden shadow-xl border border-black/5 group">
              <Image
                src={floorPlans[activeTab].image}
                alt={floorPlans[activeTab].type}
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />
              

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
