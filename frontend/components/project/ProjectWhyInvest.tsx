"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Award, TrendingUp, Calendar, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";
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
  /** Paragraph under the section title (editable in admin). Falls back to a template if empty. */
  introDescription?: string;
  projectTitle?: string;
  propertyId?: string;
  propertySlug?: string;
  heading?: string;
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

export function ProjectWhyInvest({
  reasons,
  videoUrl,
  detailedAnalysis,
  introDescription,
  projectTitle = "Project",
  propertyId,
  propertySlug,
  heading,
  whyInvestStats,
}: ProjectWhyInvestProps) {
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
          source: propertySlug
            ? `why-invest-more-insights | ${propertySlug}`
            : "why-invest-more-insights",
          propertyId: propertyId || undefined,
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to submit lead:", error);
      }
    }
  };

  const safeReasons = Array.isArray(reasons) ? reasons : [];

  const structuredBoxes: WhyInvestItem[] =
    safeReasons.length > 0 && typeof safeReasons[0] !== "string"
      ? (safeReasons as WhyInvestItem[])
      : [];

  const legacyStringReasons =
    safeReasons.length > 0 && typeof safeReasons[0] === "string"
      ? (safeReasons as string[])
      : [];

  const analysisText =
    (detailedAnalysis && detailedAnalysis.trim()) ||
    (legacyStringReasons.length > 0 ? legacyStringReasons.join("\n\n") : "");

  const hasStats =
    !!whyInvestStats &&
    [whyInvestStats.annualAppreciation, whyInvestStats.rentalYield, whyInvestStats.preLaunchGain].some(
      (v) => typeof v === "string" && v.trim().length > 0,
    );

  const introTrimmed = introDescription?.trim() ?? "";
  const hasIntro = introTrimmed.length > 0;

  const hasBoxes = structuredBoxes.length > 0;
  if (!hasBoxes && !analysisText.trim() && !hasStats && !hasIntro) {
    return null;
  }

  const subtitleParagraph =
    introTrimmed ||
    `Discover the compelling reasons why ${projectTitle} represents one of the finest investment opportunities in Gurgaon`;

  const investmentBoxes = structuredBoxes;
  const visibleReasonCards = investmentBoxes.slice(0, 4);
  const lastReasonCardIndex = visibleReasonCards.length > 0 ? visibleReasonCards.length - 1 : -1;

  return (
    <section className="py-12 bg-[#F5F0E8]" id="why-invest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionHeading
            label="Investment Opportunity"
            description={subtitleParagraph}
          >
            {heading || <>Why Invest in <span className="text-[#C9A961]">{projectTitle}</span></>}
          </SectionHeading>
        </div>

        <div
          className={`grid gap-8 ${hasBoxes ? "md:grid-cols-2" : "md:grid-cols-1"}`}
        >
          {hasBoxes ? (
            <div className="grid grid-cols-2 gap-3 items-stretch">
              {visibleReasonCards.map((item, index) => {
                const IconComponent =
                  (item.icon ? iconMap[item.icon as keyof typeof iconMap] : null) ?? TrendingUp;
                const isMarketTiming = item.title === "Market Timing";
                const isLastReasonCard = index === lastReasonCardIndex;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-[#C9A961]/10 group flex flex-col h-full ${
                      isMarketTiming
                        ? "bg-gradient-to-br from-[#C9A961]/10 to-[#C9A961]/5"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="w-10 h-10 bg-[#C9A961]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#C9A961]/20 transition-colors">
                        <IconComponent className="w-5 h-5 text-[#C9A961]" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#2C2416] mb-1.5 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    {isLastReasonCard ? (
                      <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-auto pt-3 w-full bg-[#C9A961] hover:bg-[#A88B4A] text-black text-xs font-semibold py-2 px-2 rounded transition-all"
                      >
                        More insights
                      </button>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, x: hasBoxes ? 50 : 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {analysisText.trim() ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10">
                <div className="h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  <HtmlRenderer html={analysisText} />
                </div>
              </div>
            ) : null}

            {hasStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {whyInvestStats?.annualAppreciation?.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1A1A2E] rounded-xl p-6 text-center"
                  >
                    <p className="text-[#C9A961] text-2xl font-bold mb-2">
                      {whyInvestStats.annualAppreciation}
                    </p>
                    <p className="text-gray-300 text-sm font-medium">Annual Appreciation</p>
                  </motion.div>
                ) : null}
                {whyInvestStats?.rentalYield?.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1A1A2E] rounded-xl p-6 text-center"
                  >
                    <p className="text-[#C9A961] text-2xl font-bold mb-2">
                      {whyInvestStats.rentalYield}
                    </p>
                    <p className="text-gray-300 text-sm font-medium">Rental Yield</p>
                  </motion.div>
                ) : null}
                {whyInvestStats?.preLaunchGain?.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1A1A2E] rounded-xl p-6 text-center"
                  >
                    <p className="text-[#C9A961] text-2xl font-bold mb-2">
                      {whyInvestStats.preLaunchGain}
                    </p>
                    <p className="text-gray-300 text-sm font-medium">Pre-Launch Gain</p>
                  </motion.div>
                ) : null}
              </div>
            ) : null}
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
                    <h3 className="text-2xl font-bold text-black">More insights</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Share your details and we&apos;ll send tailored investment insights for this project.
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
                        "Submit"
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

    </section>
  );
}
