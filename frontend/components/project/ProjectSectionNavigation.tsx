"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

interface ProjectSectionNavigationProps {
  sections?: NavItem[];
}

const defaultSections: NavItem[] = [
  { id: "overview", label: "Overview", icon: "📋" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "masterplan", label: "Masterplan", icon: "🗺️" },
  { id: "location", label: "Location", icon: "📍" },
  { id: "amenities", label: "Amenities", icon: "🏊" },
  { id: "floorplans", label: "Residences", icon: "🏠" },
  { id: "paymentplans", label: "Payment Plans", icon: "💰" },
  { id: "team", label: "Team", icon: "🏗️" },
  { id: "faqs", label: "FAQs", icon: "❓" },
  { id: "similar", label: "Similar Properties", icon: "🏘️" },
];

export function ProjectSectionNavigation({ sections = defaultSections }: ProjectSectionNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);

      // Update active section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="sticky top-[80px] z-40 bg-[#1A1A2E] border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Container */}
        <div className="flex items-center gap-3 overflow-x-auto py-5 scrollbar-hide">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => handleNavigate(section.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? "bg-[#C9A961] text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {section.icon && <span className="text-lg">{section.icon}</span>}
              <span>{section.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
