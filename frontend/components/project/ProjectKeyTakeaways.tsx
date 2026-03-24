"use client";

import { motion } from "framer-motion";

export interface KeyTakeawaysData {
  status?: string;
  type?: string;
  area?: string;
  configuration?: string;
  sizes?: string;
  towers?: string;
  floors?: string;
  totalUnits?: string;
  clubhouse?: string;
  priceRange?: string;
  reraNo?: string;
  launchDate?: string;
  possessionDate?: string;
  phases?: string;
  developer?: string;
  address?: string;
}

interface ProjectKeyTakeawaysProps {
  data: KeyTakeawaysData;
  heading?: string;
}

// Icon map — each field gets a relevant emoji icon
const FIELD_ICONS: Record<keyof KeyTakeawaysData, string> = {
  status: "🏗️",
  type: "🏠",
  area: "📐",
  configuration: "🛏️",
  sizes: "📏",
  towers: "🏢",
  floors: "🪜",
  totalUnits: "🔢",
  clubhouse: "🏛️",
  priceRange: "💰",
  reraNo: "✅",
  launchDate: "🚀",
  possessionDate: "🗓️",
  phases: "📋",
  developer: "👷",
  address: "📍",
};

const FIELDS: { key: keyof KeyTakeawaysData; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "type", label: "Type" },
  { key: "area", label: "Area" },
  { key: "configuration", label: "Configuration" },
  { key: "sizes", label: "Sizes" },
  { key: "towers", label: "Towers" },
  { key: "floors", label: "Floors" },
  { key: "totalUnits", label: "Total Units" },
  { key: "clubhouse", label: "Clubhouse" },
  { key: "priceRange", label: "Price Range" },
  { key: "reraNo", label: "Rera No." },
  { key: "launchDate", label: "Launch Date" },
  { key: "possessionDate", label: "Possession Date" },
  { key: "phases", label: "Phases" },
  { key: "developer", label: "Developer" },
  { key: "address", label: "Address" },
];

export function ProjectKeyTakeaways({ data, heading = 'Key Takeaways' }: ProjectKeyTakeawaysProps) {
  // Only show fields that have a real value in the DB
  const cards = FIELDS.filter(
    (f) => data[f.key] && data[f.key] !== "" && data[f.key] !== "N/A"
  );

  if (cards.length === 0) return null;

  // Separate "address" — always full-width at the bottom
  const mainCards = cards.filter((f) => f.key !== "address");
  const addressCard = cards.find((f) => f.key === "address");

  return (
    <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3021] rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#C9A961]/30">
        <h3 className="text-2xl font-serif text-[#C9A961]">{heading}</h3>
        <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">
          Essential project facts
        </p>
      </div>

      {/* 3-column card grid */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {mainCards.map((field, index) => {
            const value = data[field.key] as string;
            const icon = FIELD_ICONS[field.key];

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="bg-white/[0.06] hover:bg-white/[0.11] transition-all rounded-xl p-3.5 flex flex-col gap-1.5 group cursor-default"
              >
                {/* Icon + Label row */}
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-[#C9A961]/70 text-[10px] uppercase tracking-wider font-semibold">
                    {field.label}
                  </span>
                </div>
                {/* Value */}
                <p className="text-white text-sm font-semibold leading-snug">
                  {value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Address — full-width card at bottom */}
        {addressCard && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: mainCards.length * 0.04 }}
            className="mt-3 bg-white/[0.06] hover:bg-white/[0.11] transition-all rounded-xl p-3.5 flex items-start gap-2.5"
          >
            <span className="text-base leading-none mt-0.5">📍</span>
            <div>
              <span className="text-[#C9A961]/70 text-[10px] uppercase tracking-wider font-semibold block mb-1">
                Address
              </span>
              <p className="text-white text-sm font-semibold leading-snug">
                {data.address}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
