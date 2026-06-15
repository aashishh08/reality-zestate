"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFloorPlanLayoutDownload } from "@/components/project/ProjectFloorPlanLayoutDownload";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";

function escapeForInlineHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function defaultPanelQuoteHtml(unitType: string) {
  const t = (unitType || "").trim();
  const label = t ? escapeForInlineHtml(t) : "this unit type";
  return `<p class="text-zinc-700 text-sm italic m-0">&ldquo;This ${label} layout offers exceptional cross-ventilation and privacy, perfectly suited for modern family living.&rdquo;</p>`;
}

interface ProjectFloorPlansProps {
  floorPlans: {
    type: string;
    superArea: string;
    price: string;
    image?: string;
  }[];
  descriptionSections?: { heading: string; body: string }[];
  /** From CMS. Sanitized + `prose` on render. Omitted/empty → default quote with active unit type. */
  floorPlanPanelQuote?: string;
  heading?: string;
  propertyId?: string;
  propertySlug: string;
  projectTitle: string;
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

export function ProjectFloorPlans({
  floorPlans,
  descriptionSections,
  floorPlanPanelQuote,
  heading = "Sizes, Prices & Layouts",
  propertyId,
  propertySlug,
  projectTitle,
}: ProjectFloorPlansProps) {
  const safePlans = Array.isArray(floorPlans) && floorPlans.length > 0 ? floorPlans : null;
  const [activeTab, setActiveTab] = useState(0);

  if (!safePlans) return null;

  const safeTab = Math.min(activeTab, safePlans.length - 1);
  const panelHtml =
    floorPlanPanelQuote && floorPlanPanelQuote.trim()
      ? floorPlanPanelQuote
      : defaultPanelQuoteHtml(safePlans[safeTab].type);

  return (
    <section id="floor-plans" className="py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionHeading
            label="Configuration Options"
            description="Choose from our range of meticulously designed residences, each offering unparalleled luxury and comfort"
          >
            {heading}
          </SectionHeading>

          <div className="w-full max-w-full overflow-x-auto no-scrollbar [-webkit-overflow-scrolling:touch] flex justify-center">
            <div className="inline-flex bg-white rounded-full p-1.5 shadow-sm border border-black/5 shrink-0">
              {safePlans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap touch-manipulation ${
                    activeTab === index
                      ? "bg-black text-white shadow-md"
                      : "text-zinc-500 hover:text-black hover:bg-zinc-50"
                  }`}
                >
                  {plan.type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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

              <ProjectFloorPlanLayoutDownload
                propertyId={propertyId}
                propertySlug={propertySlug}
                projectTitle={projectTitle}
              />
            </div>

            <div className="mt-6 p-6 bg-gold/5 rounded-sm border border-gold/10">
              <HtmlRenderer
                key={`panel-${safeTab}-${floorPlanPanelQuote ? "custom" : "def"}`}
                html={panelHtml}
                fontSize="text-sm"
                className="prose-p:mb-0 prose-p:mt-0 max-w-none"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-8 order-1 lg:order-2"
            key={`image-${activeTab}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[16/10] bg-white rounded-sm overflow-hidden shadow-xl border border-black/5 group flex items-center justify-center">
              {safePlans[safeTab].image?.trim() ? (
                <Image
                  src={safePlans[safeTab].image!.trim()}
                  alt={safePlans[safeTab].type}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <p className="text-zinc-500 text-sm font-medium px-6 text-center">
                  Floor plan layout image not available for this configuration.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {(() => {
          const resolved =
            descriptionSections === undefined ? DEFAULT_FLOOR_PLAN_DESCRIPTIONS : descriptionSections;
          if (!resolved.length) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10"
            >
              <div className="h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-8">
                  {resolved.map((section, i) => {
                    const h = (section.heading || "").trim();
                    const b = (section.body || "").trim();
                    if (!h && !b) return null;
                    return (
                      <div key={i}>
                        {h ? <h4 className="text-lg font-semibold text-[#2C2416] mb-3">{section.heading}</h4> : null}
                        {b ? (
                          <HtmlRenderer html={b} fontSize="text-sm" className="max-w-none" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c9a961;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a88b4a;
        }
      `}</style>
    </section>
  );
}
