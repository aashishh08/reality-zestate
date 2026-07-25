"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";
import { validateLeadForm } from "@/lib/validation/lead-form";
import { FORM_CONFIG, SUCCESS_MESSAGES, UI_CONFIG } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useLeadModal } from "@/lib/contexts/LeadModalContext";
import { resolveLeadPopupSource } from "@/lib/lead-source";

export function LeadPopup() {
  const pathname = usePathname();
  const { isOpen, closeModal, modalSource, pageContext } = useLeadModal();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [showCloseButton, setShowCloseButton] = useState(false);

  const { execute: submitLead, loading: isSubmitting, error: submitError } = useApiCall({
    onSuccess: () => {
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "" });
        setSubmitStatus("idle");
        closeModal();
      }, FORM_CONFIG.SUCCESS_DISPLAY_TIME);
    },
  });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowCloseButton(false);
      return;
    }

    setShowCloseButton(false);
    const timer = setTimeout(() => setShowCloseButton(true), 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      return;
    }

    // Submit to API
    try {
      const source = resolveLeadPopupSource(
        pathname,
        modalSource,
        pageContext.propertySlug,
      );

      await submitLead(() =>
        createLead({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source,
          ...(pageContext.propertyId ? { propertyId: pageContext.propertyId } : {}),
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to submit lead:", error);
      }
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
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
          onClick={closeModal}
        />

        {/* Close — fixed to viewport top-right so it stays visible above the dimmed overlay (not inside the card) */}
        {showCloseButton && (
          <button
            type="button"
            onClick={closeModal}
            className="pointer-events-auto fixed top-3 right-3 z-[110] flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/95 text-zinc-800 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:top-6 sm:right-6 sm:h-11 sm:w-11"
            aria-label="Close popup"
          >
            <X className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          </button>
        )}

        {/* Modal — z-10 so card always stacks above backdrop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={UI_CONFIG.SPRING_CONFIG}
          className="relative z-10 w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-white shadow-2xl rounded-md sm:rounded-lg pointer-events-auto m-2 sm:m-4"
        >
          <div className="flex flex-col md:flex-row md:min-h-[300px]">
            {/* Left — Superluxere Concierge */}
            <div className="w-full md:w-1/2 shrink-0 bg-[#1c1c1c] text-white flex flex-col justify-between p-4 sm:p-6 md:p-8">
              <div>
                <p className="text-[9px] sm:text-xs font-medium tracking-[0.22em] text-[#b27b1f] uppercase mb-2 sm:mb-4">
                  Superluxere Concierge
                </p>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2 leading-tight">
                  The right property. Before it&apos;s listed.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-snug sm:leading-relaxed">
                  We advise on India&apos;s most exclusive launches — before public pricing, before broker calls, before
                  the crowd.
                </p>
              </div>
              <div className="mt-3 pt-3 sm:mt-6 sm:pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-3 text-center sm:text-left">
                  <div>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-[#b27b1f]">500+</p>
                    <p className="text-[9px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">Projects curated</p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-[#b27b1f]">₹10Cr+</p>
                    <p className="text-[9px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">Avg transaction</p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-[#b27b1f]">15+</p>
                    <p className="text-[9px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1">Cities covered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="relative w-full md:w-1/2 flex flex-col bg-white p-4 sm:p-6 md:p-8">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4 sm:py-8 flex flex-col items-center justify-center flex-1"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-black mb-1.5 sm:mb-2">Thank You!</h4>
                  <p className="text-zinc-600 text-xs max-w-xs">
                    {SUCCESS_MESSAGES.LEAD_SUBMITTED}
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-[9px] sm:text-xs font-medium tracking-[0.22em] text-[#b27b1f] uppercase mb-1.5 sm:mb-2">
                    Private Enquiry
                  </p>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-4 leading-tight">
                    Tell us what you&apos;re looking for
                  </h3>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-sm mb-2 sm:mb-4"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-900">Error</p>
                        <p className="text-xs text-red-700">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                  <form className="space-y-2 sm:space-y-3 flex-1 flex flex-col" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-0 border-b border-zinc-300 bg-transparent py-1.5 sm:py-2 focus:outline-none focus:border-[#b27b1f] transition-colors text-xs sm:text-sm text-black placeholder:text-zinc-400"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-0 border-b border-zinc-300 bg-transparent py-1.5 sm:py-2 focus:outline-none focus:border-[#b27b1f] transition-colors text-xs sm:text-sm text-black placeholder:text-zinc-400"
                        placeholder="Your number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-0 border-b border-zinc-300 bg-transparent py-1.5 sm:py-2 focus:outline-none focus:border-[#b27b1f] transition-colors text-xs sm:text-sm text-black placeholder:text-zinc-400"
                        placeholder="Your email"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-sm bg-[#b27b1f] text-white py-2 sm:py-2.5 text-xs sm:text-sm font-bold mt-0.5 sm:mt-1 hover:bg-[#9a6919] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          Get Best Deals <span aria-hidden="true">→</span>
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-[9px] sm:text-[10px] text-center text-zinc-500 mt-2 sm:mt-3 leading-snug sm:leading-relaxed">
                    Your details go directly to your dedicated advisor. Never shared. No spam.
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
