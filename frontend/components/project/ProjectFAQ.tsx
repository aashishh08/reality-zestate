"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_INFO } from "@/lib/constants";

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface ProjectFAQProps {
  faqs: FAQ[];
}

function FAQItem({ faq, index, columnOffset }: { faq: FAQ; index: number; columnOffset: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const globalIndex = columnOffset + index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: globalIndex * 0.05 }}
      className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#C9A961] transition-colors duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="w-6 h-6 rounded-full bg-[#C9A961]/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[#C9A961] text-sm font-bold">?</span>
        </div>
        <div className="flex-1 flex items-start justify-between gap-4">
          <h3 className="text-sm font-semibold text-[#2C2416] leading-snug">
            {faq.question}
          </h3>
          <ChevronDown
            className={`w-4 h-4 text-[#C9A961] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 ml-10">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProjectFAQ({ faqs }: ProjectFAQProps) {
  const displayFaqs = (faqs || []).slice(0, 10);

  const leftColumn = displayFaqs.slice(0, 5);
  const rightColumn = displayFaqs.slice(5, 10);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionHeading
            label="Got Questions?"
            description="Find answers to commonly asked questions about this project"
          >
            Frequently Asked Questions
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column — FAQs 1–5 */}
          <div className="space-y-3">
            {leftColumn.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} columnOffset={0} />
            ))}
          </div>

          {/* Right column — FAQs 6–10 */}
          <div className="space-y-3">
            {rightColumn.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} columnOffset={5} />
            ))}
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-[#1A1A2E] rounded-2xl px-8 py-12 text-center"
        >
          <h3 className="text-2xl font-serif text-white mb-3">Still Have Questions?</h3>
          <p className="text-gray-400 text-sm mb-8">
            Our team is here to help. Reach out for personalized assistance.
          </p>
          <a
            href={`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#C9A961] hover:bg-[#A88B4A] text-white text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-lg transition-colors duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
