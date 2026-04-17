"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, X, AlertCircle } from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";

interface ProjectFloorPlanLayoutDownloadProps {
  propertyId?: string;
  propertySlug: string;
  projectTitle: string;
}

/**
 * Residences section — same lead form as hero Schedule Site Visit; stores layoutDownload flag.
 */
export function ProjectFloorPlanLayoutDownload({
  propertyId,
  propertySlug,
  projectTitle,
}: ProjectFloorPlanLayoutDownloadProps) {
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
        setShowForm(false);
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
        phone: form.phone.replace(/\D/g, ""),
        source: `layout-download | ${propertySlug}`,
        propertyId: propertyId || undefined,
        layoutDownload: true,
      })
    );
  };

  return (
    <>
      <button
        type="button"
        id="floorplans-download-layout-btn"
        onClick={() => setShowModal(true)}
        className="w-full bg-black text-white py-4 rounded-sm font-bold tracking-wide hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group"
      >
        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
        Download Layout
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
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
                <h4 className="text-xl font-bold text-[#2C2416] mb-2">Request received!</h4>
                <p className="text-gray-500 text-sm">Our team will share the layout with you shortly.</p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl font-serif text-[#2C2416] mb-1">Layout Download</h3>
                <p className="text-xs text-gray-500 mb-6">{projectTitle}</p>

                {apiError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{apiError}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}
                    />
                    {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="98765 43210"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.phone ? "border-red-400" : "border-gray-300"}`}
                    />
                    {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent text-sm ${fieldErrors.email ? "border-red-400" : "border-gray-300"}`}
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date <span className="text-gray-400">(optional)</span>
                    </label>
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
                        Sending…
                      </>
                    ) : (
                      "Download Layout"
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">By submitting, you agree to our privacy policy.</p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
