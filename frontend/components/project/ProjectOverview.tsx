"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";

interface ProjectOverviewProps {
  overview: {
    heading: string;
    content: string[];
    features?: string[];
  };
}

export function ProjectOverview({ overview }: ProjectOverviewProps) {
  if (!overview) return null;
  const safeContent = Array.isArray(overview.content) ? overview.content : [];
  const safeFeatures = Array.isArray(overview.features) ? overview.features : [];

  return (
    <>
      <section className="py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Scrollable Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <SectionHeading centered={false}>{overview.heading}</SectionHeading>

            {/* Scrollable Content Container - Why Invest Style */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#C9A961]/10">
              <div className="h-[400px] overflow-y-auto pr-4 scrollbar-custom">
                {safeContent.map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <HtmlRenderer html={paragraph} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Project Image with Overlapping Key Features Card */}
          {safeFeatures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[600px]"
            >
              {/* Main Project Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/project-1.jpg"
                  alt="Project Overview"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for better card visibility */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
              </div>

              {/* Overlapping Key Features Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[380px]"
              >
                {/* Decorative Background Glow */}
                <div className="absolute -inset-4 bg-gold/20 rounded-2xl blur-2xl" />

                {/* Premium Gradient Card */}
                <div className="relative overflow-hidden rounded-xl shadow-2xl group">
                  {/* Rich Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3D2817] via-[#5C3D2E] to-[#8B6F47]" />

                  {/* Geometric Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(30deg, #C9A961 12%, transparent 12.5%, transparent 87%, #C9A961 87.5%, #C9A961),
                        linear-gradient(150deg, #C9A961 12%, transparent 12.5%, transparent 87%, #C9A961 87.5%, #C9A961),
                        linear-gradient(30deg, #C9A961 12%, transparent 12.5%, transparent 87%, #C9A961 87.5%, #C9A961),
                        linear-gradient(150deg, #C9A961 12%, transparent 12.5%, transparent 87%, #C9A961 87.5%, #C9A961)
                      `,
                      backgroundSize: '60px 105px',
                      backgroundPosition: '0 0, 0 0, 30px 52.5px, 30px 52.5px'
                    }}
                  />

                  {/* Subtle Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Content Container with Glassmorphism */}
                  <div className="relative backdrop-blur-sm bg-white/5 p-8 border border-white/10">
                    {/* Header with Premium Styling */}
                    <div className="mb-6">
                      <motion.h3
                        className="text-2xl font-serif font-bold text-white flex items-center gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {/* Decorative Icon */}
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
                          <div className="w-5 h-5 border-2 border-white rounded-sm" />
                        </div>
                        Key Features
                      </motion.h3>

                      {/* Decorative Line */}
                      <motion.div
                        className="mt-3 h-0.5 bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        style={{ transformOrigin: 'left' }}
                      />
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4">
                      {safeFeatures.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 group/item"
                        >
                          {/* Premium Check Icon */}
                          <div className="relative shrink-0 mt-0.5">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gold/30 rounded-full blur-md group-hover/item:bg-gold/50 transition-all duration-300" />

                            {/* Icon Container */}
                            <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                          </div>

                          {/* Feature Text */}
                          <span className="text-white/90 font-medium leading-relaxed group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Bottom Decorative Element */}
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse delay-100" />
                        <div className="w-1.5 h-1.5 rounded-full bg-gold-dark animate-pulse delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </div>
      </div>
    </section>

    </>
  );
}
