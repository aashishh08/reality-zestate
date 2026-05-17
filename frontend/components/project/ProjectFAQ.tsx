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
  heading?: string;
}

function FAQItem({
  faq,
  idSuffix,
}: {
  faq: FAQ;
  idSuffix: string;
}) {
  return (
    <details
      id={`faq-${idSuffix}`}
      className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#C9A961] transition-colors duration-300 open:border-[#C9A961]"
    >
      <summary className="w-full flex items-start gap-4 p-5 text-left hover:bg-gray-50 transition-colors duration-200 list-none cursor-pointer [&::-webkit-details-marker]:hidden">
        <div className="w-6 h-6 rounded-full bg-[#C9A961]/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-[#C9A961] text-sm font-bold">?</span>
        </div>
        <div className="flex-1 flex items-start justify-between gap-4">
          <h3 className="text-sm font-semibold text-[#2C2416] leading-snug">
            {faq.question}
          </h3>
          <ChevronDown className="faq-chevron w-4 h-4 text-[#C9A961] shrink-0 transition-transform duration-300" />
        </div>
      </summary>
      <div
        className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 ml-10 faq-prose"
        dangerouslySetInnerHTML={{ __html: faq.answer }}
      />
    </details>
  );
}

export function ProjectFAQ({
  faqs,
  heading = "Frequently Asked Questions",
}: ProjectFAQProps) {
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
            {heading}
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {leftColumn.map((faq, index) => (
              <FAQItem key={`faq-left-${index}-${faq.question}`} faq={faq} idSuffix={`l-${index}`} />
            ))}
          </div>
          <div className="space-y-3">
            {rightColumn.map((faq, index) => (
              <FAQItem key={`faq-right-${index}-${faq.question}`} faq={faq} idSuffix={`r-${index}`} />
            ))}
          </div>
        </div>

        <div className="mt-12 bg-[#1A1A2E] rounded-2xl px-8 py-12 text-center">
          <h3 className="text-2xl font-serif text-white mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-400 text-sm mb-8">
            Our team is here to help. Reach out for personalized assistance.
          </p>
          <a
            href={`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#C9A961] hover:bg-[#A88B4A] text-white text-sm font-bold tracking-widest uppercase px-10 py-4 rounded-lg transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
