"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";

interface ProjectBookingCTAProps {
  projectTitle: string;
  propertyId?: string;
  propertySlug?: string;
}

const contactCards = [
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT_INFO.PHONE_NUMBER,
    href: `tel:${CONTACT_INFO.PHONE_NUMBER}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@superluxere.com",
    href: "mailto:info@superluxere.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Golf Course Road, Sector 54, Gurgaon",
    href: "#location",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Sun: 10:00 AM – 7:00 PM",
    href: null,
  },
];

export function ProjectBookingCTA({ projectTitle, propertyId, propertySlug }: ProjectBookingCTAProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const { execute: submitLead, loading } = useApiCall({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    await submitLead(() =>
      createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        source: propertySlug ? `site-visit | ${propertySlug}` : 'site-visit-cta',
        propertyId: propertyId || undefined,
      })
    );
  };

  return (
    <section className="py-12 bg-[#1A1A2E]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
            Schedule a Site Visit
          </h2>
          <div className="w-8 h-[2px] bg-[#C9A961] mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            Experience {projectTitle} in person. Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Left — Request a Callback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-7"
          >
            <h3 className="text-lg font-serif font-semibold text-[#1A1A2E] mb-1">Request a Callback</h3>
            <p className="text-gray-500 text-xs mb-5">Fill in your details and our team will get in touch shortly.</p>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#1A1A2E] font-semibold text-sm">Thank you! We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A961] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A961] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A961] transition-colors"
                />
                <textarea
                  placeholder="Message (Optional)"
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C9A961] transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C9A961] hover:bg-[#A88B4A] text-white text-sm font-bold uppercase tracking-widest py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Request Callback"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right — Contact Info Grid + Experience Center */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* 2×2 Contact Cards */}
            <div className="grid grid-cols-2 gap-3">
              {contactCards.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <div className="bg-[#232340] rounded-xl p-4 hover:bg-[#2a2a50] transition-colors h-full">
                    <Icon className="w-5 h-5 text-[#C9A961] mb-2" />
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-white text-sm font-medium leading-snug">{value}</p>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>

            {/* Visit Our Experience Center */}
            <a
              href={`https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER.replace(/\D/g, '')}?text=Hi, I'd like to visit the experience center for ${encodeURIComponent(projectTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#232340] hover:bg-[#2a2a50] transition-colors rounded-xl p-5 text-center border border-[#C9A961]/20 hover:border-[#C9A961]/50 group"
            >
              <p className="text-white font-serif text-base font-semibold mb-1 group-hover:text-[#C9A961] transition-colors">
                Visit Our Experience Center
              </p>
              <p className="text-gray-400 text-xs">Book a slot via WhatsApp — we're available 7 days a week</p>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
