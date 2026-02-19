"use client";

import { motion } from "framer-motion";
import { MapPin, Award, TrendingUp, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface WhyInvestItem {
  title: string;
  subtitle: string;
  icon?: string;
}

interface ProjectWhyInvestProps {
  reasons: string[] | WhyInvestItem[];
  videoUrl?: string;
  detailedAnalysis?: string;
}

const iconMap = {
  location: MapPin,
  award: Award,
  trending: TrendingUp,
  calendar: Calendar,
};

export function ProjectWhyInvest({ reasons, videoUrl, detailedAnalysis }: ProjectWhyInvestProps) {
  // Convert simple string array to structured format if needed
  const investmentBoxes: WhyInvestItem[] = !reasons || reasons.length === 0 || (Array.isArray(reasons) && typeof reasons[0] === 'string')
    ? [
        { title: "Prime Location", subtitle: "Strategic location with high appreciation", icon: "location" },
        { title: "Brand Legacy", subtitle: "Trusted developer with proven track record", icon: "award" },
        { title: "Investment Returns", subtitle: "Strong rental yield and capital appreciation", icon: "trending" },
        { title: "Market Timing", subtitle: "Pre-launch pricing advantage", icon: "calendar" },
      ]
    : reasons as WhyInvestItem[];

  const analysisText = detailedAnalysis || (reasons && reasons.length > 0 ? (typeof reasons[0] === 'string' ? reasons.join('\n\n') : '') : '') || `This premium development offers a compelling investment opportunity in one of the most sought-after locations. The strategic location ensures excellent connectivity to major business hubs, entertainment zones, and essential amenities.

The property benefits from being developed by a renowned builder with a proven track record in delivering quality projects on time. This reputation provides investors with the assurance of transparent dealings and reliable possession timelines.

From an appreciation perspective, the micro-market has demonstrated consistent growth over the years. The area's infrastructure development, coupled with limited supply of premium properties, creates a favorable environment for long-term capital appreciation.

Rental yield potential is another attractive aspect of this investment. The location commands premium rents due to its proximity to corporate offices and lifestyle amenities. Luxury apartments in this area typically generate rental yields in the range of 3-4%, providing steady cash flow for investors.

The current pre-launch phase presents an optimal entry point from a pricing perspective. Early investors typically benefit from significant appreciation by the time of possession, as seen in previous projects in similar locations.`;

  return (
    <section className="py-20 bg-[#F5F0E8]" id="why-invest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>Why Invest ?</SectionHeading>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Small Icon Boxes in Grid */}
          <div className="grid grid-cols-2 gap-3">
            {investmentBoxes.slice(0, 4).map((item, index) => {
              const IconComponent = item.icon ? iconMap[item.icon as keyof typeof iconMap] : TrendingUp;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-[#C9A961]/10 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[#C9A961]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#C9A961]/20 transition-colors">
                    <IconComponent className="w-5 h-5 text-[#C9A961]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2C2416] mb-1.5 leading-tight">
                    {typeof item === 'string' ? item.split(':')[0] : item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                    {typeof item === 'string' 
                      ? item.includes(':') ? item.split(':').slice(1).join(':').trim() : item
                      : item.subtitle
                    }
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side - Scrollable Text + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Scrollable Analysis Text */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10">
              <div className="h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {typeof analysisText === 'string' ? (
                    analysisText.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-[15px]">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    reasons.map((reason, index) => (
                      <p key={index} className="text-[15px]">
                        {typeof reason === 'string' ? reason : `${reason.title}: ${reason.subtitle}`}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Investment Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1A1A2E] rounded-xl p-6 text-center"
              >
                <p className="text-[#C9A961] text-2xl font-bold mb-2">12-15%</p>
                <p className="text-gray-300 text-sm font-medium">Annual Appreciation</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1A1A2E] rounded-xl p-6 text-center"
              >
                <p className="text-[#C9A961] text-2xl font-bold mb-2">3.5-4.5%</p>
                <p className="text-gray-300 text-sm font-medium">Rental Yield</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1A1A2E] rounded-xl p-6 text-center"
              >
                <p className="text-[#C9A961] text-2xl font-bold mb-2">25-30%</p>
                <p className="text-gray-300 text-sm font-medium">Pre-Launch Gain</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
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
