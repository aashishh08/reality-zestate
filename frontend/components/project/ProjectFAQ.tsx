"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface ProjectFAQProps {
  faqs: FAQ[];
}

export function ProjectFAQ({ faqs }: ProjectFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Guard against empty FAQs
  if (!faqs || faqs.length === 0) return null;

  // Extract unique categories or use default
  const categories = Array.from(
    new Set(faqs.map((faq) => faq.category || "General"))
  );

  // Group FAQs by category
  const faqsByCategory = categories.map((category) =>
    faqs.filter((faq) => (faq.category || "General") === category)
  );

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const currentFAQs = faqsByCategory[selectedCategoryIndex] || [];
  const firstQuestion = currentFAQs[0]?.question || "our project";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#C9A961] text-sm font-bold uppercase tracking-widest mb-4"
          >
            Got Questions?
          </motion.p>

          <SectionHeading>Frequently Asked Questions</SectionHeading>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-center max-w-2xl mx-auto"
          >
            Find answers to commonly asked questions about {firstQuestion}
          </motion.p>
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategoryIndex(index);
                  setOpenIndex(0);
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategoryIndex === index
                    ? "bg-[#C9A961] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {currentFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#C9A961] transition-colors duration-300"
            >
              {/* Question Header */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Question Icon */}
                <div className="w-6 h-6 rounded-full bg-[#C9A961]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#C9A961] text-sm font-bold">?</span>
                </div>

                {/* Question & Chevron */}
                <div className="flex-1 flex items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-[#2C2416] leading-snug">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C9A961] shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 ml-10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
