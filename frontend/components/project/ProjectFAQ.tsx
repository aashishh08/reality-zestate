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

const FALLBACK_FAQS: FAQ[] = [
  {
    question: "What is the total area of the project?",
    answer: "The project spans across a large land area with ample open green spaces, landscaped gardens, and world-class amenities designed for a premium lifestyle.",
  },
  {
    question: "What configurations are available?",
    answer: "The project offers multiple configurations ranging from 2 BHK to 4+ BHK residences, each designed with premium finishes and modern layouts to suit diverse family needs.",
  },
  {
    question: "What is the possession timeline?",
    answer: "Possession is planned as per the RERA-approved timeline. Please contact our sales team for the latest updates on construction progress and exact possession dates.",
  },
  {
    question: "Is the project RERA registered?",
    answer: "Yes, the project is fully RERA registered and compliant with all applicable real estate regulations, ensuring full transparency and buyer protection.",
  },
  {
    question: "What are the parking provisions?",
    answer: "Each unit comes with dedicated covered parking. Additional visitor parking is available within the premises. EV charging points are also planned for future readiness.",
  },
  {
    question: "What payment plans are available?",
    answer: "We offer flexible payment options including construction-linked plans, down payment schemes, and bank-approved home loan assistance through leading financial institutions.",
  },
  {
    question: "Are home loans available for this project?",
    answer: "Yes, home loans are available from all major banks and NBFCs. Our relationship managers can assist you in selecting the best financing option suited to your profile.",
  },
  {
    question: "What security features are included?",
    answer: "The project includes 24/7 multi-tier security with CCTV surveillance, access-controlled entry, video door phones, trained security personnel, and a dedicated concierge service.",
  },
  {
    question: "Is the project eco-friendly and sustainable?",
    answer: "Yes, the project incorporates sustainable features such as rainwater harvesting, solar panels for common areas, energy-efficient lighting, and an organic waste composting system.",
  },
  {
    question: "How can I book a site visit?",
    answer: "You can schedule a site visit by contacting our sales team via phone or the enquiry form on this page. Our advisors will coordinate a convenient time for a guided tour.",
  },
];

export function ProjectFAQ({ faqs }: ProjectFAQProps) {
  // Merge provided FAQs with fallback to always have exactly 10
  const merged = [
    ...(faqs || []),
    ...FALLBACK_FAQS,
  ].slice(0, 10);

  const leftColumn = merged.slice(0, 5);
  const rightColumn = merged.slice(5, 10);

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
