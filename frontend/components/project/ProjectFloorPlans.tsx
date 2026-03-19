"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectFloorPlansProps {
  floorPlans: {
    type: string;
    superArea: string;
    price: string;
    image: string;
  }[];
  descriptionSections?: { heading: string; body: string }[];
}

const DEFAULT_FLOOR_PLAN_DESCRIPTIONS = [
  {
    heading: "Premium Design",
    body: "Each floor plan is meticulously designed by award-winning architects to maximize natural light, ventilation, and living space. Every detail has been considered to ensure optimal comfort and functionality for modern luxury living.",
  },
  {
    heading: "Smart Layouts",
    body: "Open-plan living areas seamlessly blend with private spaces, creating flexible layouts that adapt to your lifestyle. High ceilings and expansive windows provide panoramic views while maintaining optimal privacy and security.",
  },
  {
    heading: "Sustainable Features",
    body: "Smart home integration, energy-efficient systems, and sustainable materials throughout. Every residence incorporates cutting-edge technology while maintaining the timeless elegance and sophistication expected in luxury living.",
  },
  {
    heading: "Perfect Proportions",
    body: "Spacious bedrooms with walk-in closets, luxurious bathrooms with premium fixtures, and entertainment spaces designed for hosting. Every corner reflects the commitment to excellence and attention to detail that defines this exclusive community.",
  },
];

export function ProjectFloorPlans({ floorPlans, descriptionSections }: ProjectFloorPlansProps) {
  const safePlans = Array.isArray(floorPlans) && floorPlans.length > 0 ? floorPlans : null;
  const [activeTab, setActiveTab] = useState(0);

  if (!safePlans) return null;

  // Clamp activeTab so it's always a valid index
  const safeTab = Math.min(activeTab, safePlans.length - 1);

  return (
    <section id="floor-plans" className="py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionHeading
            label="Configuration Options"
            description="Choose from our range of meticulously designed residences, each offering unparalleled luxury and comfort"
          >
            Sizes, Prices <span className="text-[#C9A961]">&amp; Layouts</span>
          </SectionHeading>

          {/* Type Switcher Tabs */}
          <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-black/5">
            {safePlans.map((plan, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === index
                  ? "bg-black text-white shadow-md"
                  : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                  }`}
              >
                {plan.type}
              </button>
            ))}
          </div>
        </div>

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
              <h3 className="text-3xl font-serif font-bold text-black mb-2">{safePlans[safeTab].type}</h3>
              <p className="text-zinc-500 font-medium mb-8 uppercase tracking-widest text-xs">Unit Type</p>

              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span className="text-zinc-600">Super Area</span>
                  <span className="font-bold text-black text-lg">{safePlans[safeTab].superArea}</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span className="text-zinc-600">Starting Price</span>
                  <span className="font-bold text-gold-dark text-lg">{safePlans[safeTab].price}</span>
                </div>
              </div>

              <button className="w-full bg-black text-white py-4 rounded-sm font-bold tracking-wide hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group">
                <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Download Layout
              </button>
            </div>

            <div className="mt-6 p-6 bg-gold/5 rounded-sm border border-gold/10">
              <p className="text-zinc-700 text-sm italic">
                &quot;This {safePlans[safeTab].type} layout offers exceptional cross-ventilation and privacy, perfectly suited for modern family living.&quot;
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
                src={safePlans[safeTab].image}
                alt={safePlans[safeTab].type}
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
              />


            </div>
          </motion.div>

        </div>

        {/* Scrollable Description Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10"
        >
          <div className="h-[300px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-8">
              {(descriptionSections && descriptionSections.length > 0
                ? descriptionSections
                : DEFAULT_FLOOR_PLAN_DESCRIPTIONS
              ).map((section, i) => (
                <div key={i}>
                  <h4 className="text-lg font-semibold text-[#2C2416] mb-3">{section.heading}</h4>
                  <div 
                    className="text-gray-700 leading-relaxed text-sm floor-plan-prose"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .floor-plan-prose p { margin-bottom: 0.75rem; }
        .floor-plan-prose ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .floor-plan-prose ol { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .floor-plan-prose strong, .floor-plan-prose b { color: #2C2416; font-weight: 600; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C9A961;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A88B4A;
        }
      `}</style>
    </section>
  );
}
