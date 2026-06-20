"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectAmenitiesProps {
  amenities: {
    name: string;
    icon: string;
    image?: string;
  }[];
  amenitiesStats?: {
    clubhouseSqFt?: string;
    amenitiesCount?: string;
    swimmingPools?: string;
    diningOptions?: string;
  };
  heading?: string;
  description?: string;
}

const DEFAULT_AMENITIES_DESCRIPTION =
  'Experience a lifestyle of unparalleled luxury with our comprehensive range of world-class amenities designed for your comfort and well-being';

export function ProjectAmenities({
  amenities,
  amenitiesStats,
  heading = 'Amenities',
  description = DEFAULT_AMENITIES_DESCRIPTION,
}: ProjectAmenitiesProps) {
  const safeAmenities = Array.isArray(amenities) ? amenities : [];
  const featuredImages = safeAmenities.filter(a => a.image && a.image.trim() !== '').slice(0, 2);

  return (
    <section id="amenities" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionHeading
            label="World-Class Facilities"
            description={description}
          >
            {heading}
          </SectionHeading>
        </div>

        {/* Featured Images */}
        {featuredImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredImages.map((amenity, idx) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="text-4xl mb-3">{amenity.icon}</div>
                  <h3 className="text-3xl font-serif font-bold">{amenity.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Amenities Grid */}
        {safeAmenities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {safeAmenities.map((amenity, idx) => (
              <motion.div
                key={`${amenity.name}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                className="flex items-start gap-3"
              >
                <div className="text-2xl flex-shrink-0 mt-1">{amenity.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{amenity.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#1A1A2E] to-[#2C2C3E] rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">
                {amenitiesStats?.clubhouseSqFt ?? '100K'}
              </p>
              <p className="text-gray-300 text-sm">Sq Ft Clubhouse</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">
                {amenitiesStats?.amenitiesCount ?? '25+'}
              </p>
              <p className="text-gray-300 text-sm">Amenities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">
                {amenitiesStats?.swimmingPools ?? '5'}
              </p>
              <p className="text-gray-300 text-sm">Swimming Pools</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">
                {amenitiesStats?.diningOptions ?? '5'}
              </p>
              <p className="text-gray-300 text-sm">Dining Options</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
