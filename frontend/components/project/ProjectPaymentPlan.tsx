"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectPaymentPlanProps {
  paymentPlans: {
    title: string;
    type: string;
    description: string;
  }[];
}

export function ProjectPaymentPlan({ paymentPlans }: ProjectPaymentPlanProps) {
  const safePlans = Array.isArray(paymentPlans) ? paymentPlans : [];

  if (safePlans.length === 0) return null;

  return (
    <section id="payment-plans" className="py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionHeading
            label="Flexible Options"
            description="Flexible payment options designed to suit your financial planning."
          >
            Payment <span className="text-[#C9A961]">Plans</span>
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {safePlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-sm border border-black/5 p-8 hover:border-gold-dark hover:shadow-lg transition-all duration-300 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <h3 className="text-xl font-serif font-bold text-black mb-2">{plan.title}</h3>
              <p className="text-xs font-bold text-gold-dark uppercase tracking-wider mb-6">{plan.type}</p>

              <div 
                className="text-zinc-600 leading-relaxed text-sm payment-plan-prose"
                dangerouslySetInnerHTML={{ __html: plan.description }}
              />

              <div className="mt-8 pt-6 border-t border-zinc-200">
                <button className="text-sm font-bold text-black uppercase tracking-wider hover:text-gold-dark transition-colors flex items-center gap-2">
                  Learn More <span className="text-lg">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .payment-plan-prose p { margin-bottom: 0.5rem; }
        .payment-plan-prose ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .payment-plan-prose ol { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.5rem; }
        .payment-plan-prose a { color: #C9A961; text-decoration: underline; }
      `}</style>
    </section>
  );
}
