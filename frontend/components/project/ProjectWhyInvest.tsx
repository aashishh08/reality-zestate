"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Award, TrendingUp, Calendar, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";
import { validateLeadForm } from "@/lib/validation/lead-form";
import { SUCCESS_MESSAGES, UI_CONFIG } from "@/lib/constants";

interface WhyInvestItem {
  title: string;
  subtitle: string;
  icon?: string;
}

interface ProjectWhyInvestProps {
  reasons: string[] | WhyInvestItem[];
  videoUrl?: string;
  detailedAnalysis?: string;
  projectTitle?: string;
  propertyId?: string;
  propertySlug?: string;
  whyInvestStats?: {
    annualAppreciation?: string;
    rentalYield?: string;
    preLaunchGain?: string;
  };
}

const iconMap = {
  location: MapPin,
  award: Award,
  trending: TrendingUp,
  calendar: Calendar,
};

export function ProjectWhyInvest({ reasons, videoUrl, detailedAnalysis, projectTitle = "Project", propertyId, propertySlug, whyInvestStats }: ProjectWhyInvestProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");

  const { execute: submitLead, loading: isSubmitting, error: submitError } = useApiCall({
    onSuccess: () => {
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "" });
        setSubmitStatus("idle");
        setShowForm(false);
      }, SUCCESS_MESSAGES.LEAD_SUBMITTED.length > 0 ? 3000 : 2000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      return;
    }

    try {
      await submitLead(() =>
        createLead({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source: propertySlug ? `investment-inquiry | ${propertySlug}` : 'why-invest-cta',
          propertyId: propertyId || undefined,
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to submit lead:", error);
      }
    }
  };

  // Convert simple string array to structured format if needed.
  // Guard against null/undefined reasons with a safe array fallback.
  const safeReasons = Array.isArray(reasons) ? reasons : [];

  const investmentBoxes: WhyInvestItem[] =
    safeReasons.length === 0 || typeof safeReasons[0] === 'string'
      ? [
        { title: "Prime Location", subtitle: "Strategic location with high appreciation", icon: "location" },
        { title: "Brand Legacy", subtitle: "Trusted developer with proven track record", icon: "award" },
        { title: "Investment Returns", subtitle: "Strong rental yield and capital appreciation", icon: "trending" },
        { title: "Market Timing", subtitle: "Pre-launch pricing advantage", icon: "calendar" },
      ]
      : (safeReasons as WhyInvestItem[]);

  const analysisText = detailedAnalysis ||
    (safeReasons.length > 0 && typeof safeReasons[0] === 'string' ? safeReasons.join('\n\n') : '') ||
    `This premium development offers a compelling investment opportunity in one of the most sought-after locations. The strategic location ensures excellent connectivity to major business hubs, entertainment zones, and essential amenities.

The property benefits from being developed by a renowned builder with a proven track record in delivering quality projects on time. This reputation provides investors with the assurance of transparent dealings and reliable possession timelines.

From an appreciation perspective, the micro-market has demonstrated consistent growth over the years. The area's infrastructure development, coupled with limited supply of premium properties, creates a favorable environment for long-term capital appreciation.

Rental yield potential is another attractive aspect of this investment. The location commands premium rents due to its proximity to corporate offices and lifestyle amenities. Luxury apartments in this area typically generate rental yields in the range of 3-4%, providing steady cash flow for investors.

The current pre-launch phase presents an optimal entry point from a pricing perspective. Early investors typically benefit from significant appreciation by the time of possession, as seen in previous projects in similar locations.`;

  return (
    <section className="py-12 bg-[#F5F0E8]" id="why-invest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionHeading
            label="Investment Opportunity"
            description={`Discover the compelling reasons why ${projectTitle} represents one of the finest investment opportunities in Gurgaon`}
          >
            Why Invest in <span className="text-[#C9A961]">{projectTitle}</span>
          </SectionHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Small Icon Boxes in Grid */}
          <div className="grid grid-cols-2 gap-3">
            {investmentBoxes.slice(0, 4).map((item, index) => {
              // Safe icon lookup: unknown keys (e.g. "building", "star") return undefined → fall back to TrendingUp
              const IconComponent = (item.icon ? iconMap[item.icon as keyof typeof iconMap] : null) ?? TrendingUp;
              const isMarketTiming = item.title === "Market Timing";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-[#C9A961]/10 group cursor-pointer flex flex-col ${isMarketTiming ? "bg-gradient-to-br from-[#C9A961]/10 to-[#C9A961]/5" : "bg-white"
                    }`}
                >
                  <div className="flex-1">
                    <div className="w-10 h-10 bg-[#C9A961]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#C9A961]/20 transition-colors">
                      <IconComponent className="w-5 h-5 text-[#C9A961]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#2C2416] mb-1.5 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {isMarketTiming && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-3 w-full bg-[#C9A961] hover:bg-[#A88B4A] text-black text-xs font-semibold py-1.5 px-2 rounded transition-all"
                    >
                      Get More Insights
                    </button>
                  )}
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
                    safeReasons.map((reason, index) => (
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
                <p className="text-[#C9A961] text-2xl font-bold mb-2">
                  {whyInvestStats?.annualAppreciation ?? '12-15%'}
                </p>
                <p className="text-gray-300 text-sm font-medium">Annual Appreciation</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1A1A2E] rounded-xl p-6 text-center"
              >
                <p className="text-[#C9A961] text-2xl font-bold mb-2">
                  {whyInvestStats?.rentalYield ?? '3.5-4.5%'}
                </p>
                <p className="text-gray-300 text-sm font-medium">Rental Yield</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#1A1A2E] rounded-xl p-6 text-center"
              >
                <p className="text-[#C9A961] text-2xl font-bold mb-2">
                  {whyInvestStats?.preLaunchGain ?? '25-30%'}
                </p>
                <p className="text-gray-300 text-sm font-medium">Pre-Launch Gain</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowForm(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={UI_CONFIG.SPRING_CONFIG}
            className="relative w-full max-w-lg bg-white overflow-hidden shadow-2xl rounded-lg pointer-events-auto m-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors z-20"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2">Thank You!</h4>
                  <p className="text-zinc-600 text-sm">{SUCCESS_MESSAGES.LEAD_SUBMITTED}</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-black">Get More Insights</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Learn more about market timing and investment opportunities
                    </p>
                  </div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm mb-4"
                    >
                      <div>
                        <p className="text-xs font-medium text-red-900">Error</p>
                        <p className="text-xs text-red-700">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-3 font-medium mt-6 hover:bg-gold hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Get Insights"
                      )}
                    </button>
                  </form>

                  <p className="text-[10px] text-center text-zinc-400 mt-4">
                    We respect your privacy. No spam, ever.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
