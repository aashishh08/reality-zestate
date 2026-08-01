"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { enterProps, useLiteMotion } from "@/lib/motion-prefs";

interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

interface ProjectSectionNavigationProps {
  sections?: NavItem[];
}

const defaultSections: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "gallery", label: "Gallery" },
  { id: "masterplan", label: "Masterplan" },
  { id: "location", label: "Location" },
  { id: "amenities", label: "Amenities" },
  { id: "floorplans", label: "Residences" },
  { id: "paymentplans", label: "Payment Plans" },
  { id: "team", label: "Team" },
  { id: "faqs", label: "FAQs" },
  { id: "similar", label: "Similar Properties" },
];

export function ProjectSectionNavigation({ sections = defaultSections }: ProjectSectionNavigationProps) {
  const liteMotion = useLiteMotion();
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
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

    handleScroll();
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
    <nav
      aria-label="Project page sections"
      className="sticky top-16 lg:top-20 z-40 bg-[#1A1A2E] border-b border-gray-800 shadow-lg min-h-[3.25rem] sm:min-h-[3.75rem]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto overscroll-x-contain py-3 sm:py-4 md:py-5 scrollbar-hide [-webkit-overflow-scrolling:touch] snap-x snap-mandatory">
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const motionProps = enterProps(liteMotion, liteMotion ? index * 0.05 : 0);

            return (
              <motion.button
                key={section.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleNavigate(section.id)}
                {...motionProps}
                className={`flex shrink-0 snap-start items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors touch-manipulation ${
                  isActive
                    ? "bg-[#C9A961] text-black shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span>{section.label}</span>
              </motion.button>
            );
          })}
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
    </nav>
  );
}
