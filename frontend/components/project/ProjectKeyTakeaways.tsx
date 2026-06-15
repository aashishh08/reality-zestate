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
  data: KeyTakeawaysData | string[];
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
  if (Array.isArray(data)) {
    const lines = data.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    if (!lines.length) return null;
    return (
      <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3021] rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#C9A961]/30">
          <h3 className="text-2xl font-serif text-[#C9A961]">{heading}</h3>
        </div>
        <ul className="p-5 space-y-3 text-white/95 text-sm list-disc pl-10 pr-4">
          {lines.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-[#C9A961]/30">
        <h3 className="text-xl sm:text-2xl font-serif text-[#C9A961]">{heading}</h3>
        <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">
          Essential project facts
        </p>
      </div>

      {/* 3-column card grid */}
      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
                className="bg-white/[0.06] hover:bg-white/[0.11] transition-all rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 flex flex-col gap-1.5 group cursor-default min-w-0 overflow-hidden"
              >
                {/* Icon + Label row */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm sm:text-base leading-none shrink-0">{icon}</span>
                  <span className="text-[#C9A961]/70 text-[10px] sm:text-xs uppercase tracking-wider font-semibold min-w-0 truncate">
                    {field.label}
                  </span>
                </div>
                {/* Value */}
                <p className="text-white text-xs sm:text-sm font-semibold leading-snug min-w-0 overflow-hidden break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
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
            className="mt-2 sm:mt-3 bg-white/[0.06] hover:bg-white/[0.11] transition-all rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 flex items-start gap-2.5 min-w-0 overflow-hidden"
          >
            <span className="text-sm sm:text-base leading-none mt-0.5 shrink-0">📍</span>
            <div className="min-w-0">
              <span className="text-[#C9A961]/70 text-xs uppercase tracking-wider font-semibold block mb-1">
                Address
              </span>
              <p className="text-white text-xs sm:text-sm font-semibold leading-snug min-w-0 overflow-hidden break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                {data.address}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
