"use client";

import Image from "next/image";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { Calendar, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";
import { enterProps, useLiteMotion } from "@/lib/motion-prefs";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { details } = project;
  const liteMotion = useLiteMotion();
  const heroMotion = enterProps(liteMotion);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { execute: submitLead, loading: isSubmitting, error: apiError } = useApiCall({
    onSuccess: () => {
      setSubmitStatus("success");
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", date: "" });
        setSubmitStatus("idle");
        setShowModal(false);
      }, 2800);
    },
  });

  const setShowModal = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setFieldErrors({});
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple client-side validation
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length !== 10) errors.phone = "Phone must be 10 digits";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    await submitLead(() =>
      createLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""), // send clean 10 digits
        source: `site-visit | ${project.slug}`,
        propertyId: project.id || undefined,
      })
    );
  };

  if (!details) return null;

  const heroSrc = details.heroImage?.trim();

  return (
    <>
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        {/* Background — CMS hero only; no stock property image */}
        <div className="absolute inset-0">
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover"
              priority
              quality={75}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2C2416] via-[#3d3429] to-[#1a1612]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
            <motion.div
              {...heroMotion}
              className="max-w-4xl min-w-0"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight break-words [overflow-wrap:anywhere]">
                {project.h1Heading || project.title}
              </h1>
              {details.subtitle?.trim() ? (
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light mb-6 break-words [overflow-wrap:anywhere]">
                  {details.subtitle}
                </p>
              ) : null}
              <p className="text-lg text-white/70 mb-4">
                📍 {project.location}
                {project.sublocality?.trim() ? (
                  <span className="text-white/90"> · {project.sublocality.trim()}</span>
                ) : null}
              </p>

              {details.highlights && (() => {
                const h = details.highlights;
                const chips: { label: string; value: string }[] = [];
                if (h.landArea?.trim()) chips.push({ label: "Land", value: h.landArea.trim() });
                if (h.possession?.trim()) chips.push({ label: "Possession", value: h.possession.trim() });
                if (h.rera?.trim()) chips.push({ label: "RERA", value: h.rera.trim() });
                if (h.configuration?.trim()) chips.push({ label: "Config", value: h.configuration.trim() });
                if (h.priceRange?.trim()) chips.push({ label: "Price", value: h.priceRange.trim() });
                if (h.totalUnits?.trim()) chips.push({ label: "Units", value: h.totalUnits.trim() });
                if (!chips.length) return null;
                return (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {chips.map((c) => (
                      <span
                        key={c.label}
                        className="text-xs sm:text-sm text-white/95 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white/20"
                      >
                        <span className="text-white/65 mr-1">{c.label}:</span>
                        {c.value}
                      </span>
                    ))}
                  </div>
                );
              })()}

              <button
                type="button"
                id="hero-schedule-visit-btn"
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-gold to-gold-dark text-white px-8 py-4 rounded-sm font-bold tracking-wide hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group transform hover:-translate-y-1"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Schedule Site Visit
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Site Visit Form Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            {...(liteMotion
              ? { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } }
              : { initial: false })}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-visit-dialog-title"
            className="bg-white rounded-2xl p-6 max-w-sm w-full sm:max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

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
                <h4 className="text-xl font-bold text-[#2C2416] mb-2">Visit Booked!</h4>
                <p className="text-gray-500 text-sm">Our team will contact you within 2 hours to confirm your slot.</p>
              </motion.div>
            ) : (
              <>
                <h3 id="site-visit-dialog-title" className="text-2xl font-serif text-[#2C2416] mb-1">Schedule Your Visit</h3>
                <p className="text-xs text-gray-500 mb-6">{project.title}</p>

                {/* API error */}
                {apiError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{apiError}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.name ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="98765 43210"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.phone ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                  </div>

                  {/* Email (required) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.email ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                  </div>

                  {/* Preferred date (UI only, stored in message) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gold to-gold-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking…
                      </>
                    ) : (
                      "Book Site Visit"
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By submitting, you agree to our privacy policy.
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
