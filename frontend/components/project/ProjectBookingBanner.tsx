"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarCheck, AlertCircle } from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";
import { validateLeadForm } from "@/lib/validation/lead-form";
import { SUCCESS_MESSAGES, UI_CONFIG } from "@/lib/constants";

interface ProjectBookingBannerProps {
  projectTitle: string;
  projectImage?: string;
  propertyId?: string;
  propertySlug?: string;
}

export function ProjectBookingBanner({ projectTitle, projectImage, propertyId, propertySlug }: ProjectBookingBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { execute: submitLead, loading: isSubmitting, error: submitError } = useApiCall({
    onSuccess: () => {
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "" });
        setSubmitStatus("idle");
        setShowModal(false);
      }, 2800);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});

    try {
      await submitLead(() =>
        createLead({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source: propertySlug ? `site-visit | ${propertySlug}` : "book-site-visit",
          propertyId: propertyId || undefined,
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to submit site visit lead:", error);
      }
    }
  };

  const imageSrc = projectImage?.trim();

  return (
    <>
      {/* ── Banner: property photo (left) + booking CTA (right) ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px] md:min-h-[380px]">
          {/* Left — property photo */}
          <div className="relative h-56 sm:h-64 md:h-auto min-h-[220px]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={projectTitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C2416] via-[#3d3429] to-[#1a1612]" />
            )}
            <div className="absolute inset-0 bg-black/10 md:bg-transparent" />
          </div>

          {/* Right — book a private tour */}
          <div className="relative flex items-center py-12 md:py-14 px-6 sm:px-10 lg:px-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961] to-[#A88B4A]">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="relative z-10 w-full max-w-lg">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-serif text-white mb-3"
              >
                Book a Private Tour
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/90 mb-7 text-base leading-relaxed"
              >
                Experience {projectTitle} firsthand with our exclusive guided tour
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
              >
                <button
                  id="book-site-visit-btn"
                  onClick={() => setShowModal(true)}
                  className="bg-white text-[#2C2416] px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#2C2416] hover:text-white transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Schedule a Visit
                </button>
                <a
                  href="#overview"
                  className="text-center text-white border-2 border-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-[#2C2416] transition-all"
                >
                  Explore the Project
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Modal (portal + static z-index: avoids Tailwind JIT stripping dynamic z-[]) ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showModal && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                role="presentation"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                  onClick={() => setShowModal(false)}
                />

                {/* Modal card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={UI_CONFIG.SPRING_CONFIG}
                  className="relative z-10 w-full max-w-md bg-white overflow-hidden shadow-2xl rounded-2xl pointer-events-auto m-4"
                >
              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors z-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Gold top strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#C9A961] to-[#A88B4A]" />

              <div className="p-8">
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-black mb-2">Request Confirmed!</h4>
                    <p className="text-zinc-600 text-sm">
                      {SUCCESS_MESSAGES.LEAD_SUBMITTED}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#C9A961]/10 rounded-full">
                        <CalendarCheck className="w-5 h-5 text-[#C9A961]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black">Schedule a Site Visit</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{projectTitle}</p>
                      </div>
                    </div>

                    {/* Error */}
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">{submitError}</p>
                      </motion.div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full border-b py-2 focus:outline-none transition-colors text-sm ${fieldErrors.name ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-[#C9A961]'
                            }`}
                          placeholder="John Doe"
                        />
                        {fieldErrors.name && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full border-b py-2 focus:outline-none transition-colors text-sm ${fieldErrors.phone ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-[#C9A961]'
                            }`}
                          placeholder="98765 43210"
                        />
                        {fieldErrors.phone && (
                          <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-[#C9A961] transition-colors text-sm"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2C2416] text-white py-3 font-semibold mt-4 hover:bg-[#C9A961] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Booking…</span>
                          </>
                        ) : (
                          "Confirm Visit Request"
                        )}
                      </button>
                    </form>

                    <p className="text-[10px] text-center text-zinc-400 mt-4">
                      Our concierge will contact you within 2 hours to confirm your visit.
                    </p>
                  </>
                )}
              </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
