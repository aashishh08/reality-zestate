"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Heart, ShoppingBag, MapPin, Plane, Map, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface NearbyItem { name: string; distance?: string }
interface NearbyCategory { category: string; icon?: string; items: NearbyItem[] }
interface ConnectivityItem { place: string; icon?: string; time: string }

interface ProjectLocationProps {
  location: {
    address?: string;
    mapImage?: string;
    nearby: NearbyCategory[];
    connectivity?: ConnectivityItem[];
  };
  heading?: string;
  description?: string;
  /** Optional micro-area from property record; display-only (not used for filters). */
  sublocality?: string | null;
}

const DEFAULT_LOCATION_DESCRIPTION =
  'Strategically located, offering unmatched connectivity to business districts, airports, and lifestyle destinations';

const categoryIcons: Record<string, React.ElementType> = {
  education: BookOpen,
  healthcare: Heart,
  shopping: ShoppingBag,
  default: MapPin,
};

const categoryColors: Record<string, string> = {
  education: "#3B82F6",
  healthcare: "#EF4444",
  shopping: "#A855F7",
  default: "#C9A961",
};

const connectivityIcons: Record<string, React.ElementType> = {
  airport: Plane,
  location: MapPin,
  map: Map,
  building: Building2,
  default: MapPin,
};

export function ProjectLocation({
  location,
  heading = 'Location Advantage',
  description = DEFAULT_LOCATION_DESCRIPTION,
  sublocality,
}: ProjectLocationProps) {
  if (!location) return null;

  const safeNearby: NearbyCategory[] = Array.isArray(location.nearby) ? location.nearby : [];
  const safeConnectivity: ConnectivityItem[] = Array.isArray(location.connectivity) ? location.connectivity : [];
  const sub = typeof sublocality === 'string' ? sublocality.trim() : '';
  const addr = typeof location.address === 'string' ? location.address.trim() : '';
  const hasMap = !!location.mapImage?.trim();
  const hasBody = !!(sub || addr || hasMap || safeNearby.length > 0 || safeConnectivity.length > 0);
  if (!hasBody) return null;

  return (
    <section className="py-12 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className="text-center mb-16">
          <SectionHeading
            label="Prime Address"
            description={description}
          >
            {heading}
          </SectionHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start min-w-0">
          {/* Map Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[320px] sm:h-[400px] md:h-[500px] min-w-0"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              {location.mapImage?.trim() ? (
                <Image
                  src={location.mapImage.trim()}
                  alt="Location Map"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-zinc-400" aria-hidden />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white rounded-lg p-3 sm:p-4 shadow-lg max-w-[calc(100%-2rem)] sm:max-w-xs min-w-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A961]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C9A961]" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[#2C2416] text-base break-words [overflow-wrap:anywhere]">
                      {addr || sub || "Prime Location"}
                    </p>
                    {addr && sub ? (
                      <p className="text-sm text-zinc-600 mt-1 font-sans font-normal">{sub}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nearby Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8 min-w-0 max-w-full"
          >
            {safeNearby.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No nearby places listed.</p>
            ) : (
              safeNearby.map((category, categoryIndex) => {
                // Safe lookup: unknown icon key → falls back to default icon/color
                const IconComponent: React.ElementType =
                  (category.icon ? categoryIcons[category.icon] : null) ?? categoryIcons.default;
                const iconColor: string =
                  (category.icon ? categoryColors[category.icon] : null) ?? categoryColors.default;
                const safeItems: NearbyItem[] = Array.isArray(category.items) ? category.items : [];

                return (
                  <motion.div
                    key={`${category.category}-${categoryIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${iconColor}15` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: iconColor }} />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#2C2416] break-words [overflow-wrap:anywhere]">
                        {category.category}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-3 pl-0 sm:pl-11 min-w-0">
                      {safeItems.map((item, index) => (
                        <motion.div
                          key={`${item.name || "item"}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: iconColor }} />
                          <span className="text-sm text-gray-700 font-medium break-words [overflow-wrap:anywhere] min-w-0">{item.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>

        {/* Connectivity */}
        {safeConnectivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 pt-20 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-w-0">
              {safeConnectivity.map((item, index) => {
                const IconComponent: React.ElementType =
                  (item.icon ? connectivityIcons[item.icon] : null) ?? connectivityIcons.default;

                return (
                  <motion.div
                    key={`${item.place || "place"}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#C9A961] hover:shadow-md transition-all min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A961]/10 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-[#C9A961]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#C9A961] font-bold text-sm break-words [overflow-wrap:anywhere]">{item.time}</p>
                        <p className="text-gray-700 text-xs font-medium break-words [overflow-wrap:anywhere]">{item.place}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
