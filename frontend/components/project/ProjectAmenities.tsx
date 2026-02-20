"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectAmenitiesProps {
  amenities: {
    name: string;
    icon: string;
    image?: string;
  }[];
}

// Group amenities by category
const amenityCategories = [
  {
    name: "Clubhouse",
    icon: "🍽️",
    image: "https://images.unsplash.com/photo-1590846406792-0aae7fa55a47?w=800&h=600&fit=crop",
    amenities: [
      { name: "Swimming Pool", icon: "🏊" },
      { name: "Fitness Center", icon: "💪" },
      { name: "Luxury Spa", icon: "💆" },
      { name: "Fine Dining", icon: "🍽️" },
    ]
  },
  {
    name: "Sports",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    amenities: [
      { name: "Golf Course", icon: "⛳" },
      { name: "Sports Courts", icon: "🏀" },
      { name: "Squash Court", icon: "🎾" },
      { name: "Yoga Studio", icon: "🧘" },
    ]
  },
  {
    name: "Convenience",
    icon: "🏬",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=600&fit=crop",
    amenities: [
      { name: "Business Center", icon: "💼" },
      { name: "Café", icon: "☕" },
      { name: "Kids Play Area", icon: "🎪" },
      { name: "Parking", icon: "🅿️" },
    ]
  },
  {
    name: "Security",
    icon: "🔒",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    amenities: [
      { name: "24/7 Security", icon: "👮" },
      { name: "Concierge", icon: "🎩" },
      { name: "Access Control", icon: "🔑" },
      { name: "Fire Safety", icon: "🚒" },
    ]
  },
];

export function ProjectAmenities({ amenities }: ProjectAmenitiesProps) {
  return (
    <section id="amenities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A961] text-sm font-semibold uppercase tracking-widest mb-2">
            World-Class Facilities
          </p>
          <h2 className="text-5xl font-serif font-bold text-[#2C2416] mb-4">
            Amenities
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience a lifestyle of unparalleled luxury with our comprehensive range of world-class amenities designed for your comfort and well-being
          </p>
        </div>

        {/* Featured Images and Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {amenityCategories.slice(0, 2).map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-3xl font-serif font-bold">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {amenityCategories.map((category, catIdx) =>
            category.amenities.map((amenity, amenIdx) => (
              <motion.div
                key={`${category.name}-${amenity.name}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (catIdx * 0.1) + (amenIdx * 0.05) }}
                className="flex items-start gap-3"
              >
                <div className="text-2xl flex-shrink-0 mt-1">{amenity.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{amenity.name}</h4>
                  <p className="text-xs text-gray-500">{category.name}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#1A1A2E] to-[#2C2C3E] rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">100K</p>
              <p className="text-gray-300 text-sm">Sq Ft Clubhouse</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">25+</p>
              <p className="text-gray-300 text-sm">Amenities</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">5</p>
              <p className="text-gray-300 text-sm">Swimming Pools</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#C9A961] mb-2">5</p>
              <p className="text-gray-300 text-sm">Dining Options</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
