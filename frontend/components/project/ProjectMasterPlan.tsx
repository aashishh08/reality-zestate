"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Map } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";

interface ProjectMasterPlanProps {
  masterPlanImage?: string;
  /** Scrollable body copy beside the master plan image. */
  description?: string;
  /** Subtitle under the section title (SectionHeading). */
  sectionDescription?: string;
  heading?: string;
}

const DEFAULT_MASTER_PLAN_SECTION_DESCRIPTION =
  'Explore the comprehensive layout and thoughtful design of our premium development';

export function ProjectMasterPlan({
  masterPlanImage,
  description,
  sectionDescription = DEFAULT_MASTER_PLAN_SECTION_DESCRIPTION,
  heading = "Master Plan",
}: ProjectMasterPlanProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const hasImage = Boolean(masterPlanImage?.trim());
  const descTrim = typeof description === "string" ? description.trim() : "";
  const hasDesc = descTrim.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 10);
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasDesc]);

  if (!hasImage && !hasDesc) {
    return null;
  }

  return (
    <>
      <section className="py-14 bg-white overflow-x-hidden" id="master-plan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="text-center mb-16">
            <SectionHeading
              label="Project Layout"
              description={sectionDescription}
            >
              {heading}
            </SectionHeading>
          </div>

          <div
            className={`grid grid-cols-1 gap-10 lg:gap-16 min-w-0 ${hasImage && hasDesc ? "lg:grid-cols-2" : ""}`}
          >
            {hasImage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-[320px] sm:h-[450px] md:h-[600px] min-w-0"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={masterPlanImage!.trim()}
                    alt="Master Plan"
                    fill
                    className="object-contain bg-gray-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent pointer-events-none" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#C9A961]/10 flex items-center justify-center">
                      <Map className="w-5 h-5 text-[#C9A961]" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-[#2C2416] text-base">Site Layout</p>
                      <p className="text-xs text-gray-600">Master Plan View</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}

            {hasDesc ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative min-w-0 max-w-full"
              >
                <h3 className="text-3xl font-serif font-bold text-[#2C2416] mb-6">
                  Thoughtfully Designed Layout
                </h3>

                <div className="relative">
                  <div
                    ref={contentRef}
                    className={`
                  space-y-4 text-zinc-700 leading-relaxed
                  overflow-y-auto pr-4
                  max-h-[500px]
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold/30
 [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gold/30
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [scrollbar-width:thin]
                  [scrollbar-color:rgba(201,169,97,0.3)_transparent]
                `}
                  >
                    <HtmlRenderer html={descTrim} fontSize="text-lg" />
                  </div>

                  {showScrollIndicator && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}

                  {showScrollIndicator && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gold-dark pointer-events-none"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider">Scroll for more</span>
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
