"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, AlertCircle } from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { useApiCall } from "@/lib/hooks/useApiCall";
import { validateLeadForm } from "@/lib/validation/lead-form";
import { FORM_CONFIG, SUCCESS_MESSAGES, UI_CONFIG } from "@/lib/constants";

export function LeadPopup({ source = "lead-popup" }: { source?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");

  const { execute: submitLead, loading: isSubmitting, error: submitError } = useApiCall({
    onSuccess: () => {
      setSubmitStatus("success");
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "" });
        setSubmitStatus("idle");
        setIsOpen(false);
      }, FORM_CONFIG.SUCCESS_DISPLAY_TIME);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, FORM_CONFIG.LEAD_POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [hasOpened]);

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
      await submitLead(() =>
        createLead({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          source,
        })
      );
    } catch (error) {
      console.error("Failed to submit lead:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={UI_CONFIG.SPRING_CONFIG}
          className="relative w-full max-w-lg bg-white overflow-hidden shadow-2xl rounded-lg pointer-events-auto m-4"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors z-20"
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left Image Side - Hidden on mobile */}
            <div className="hidden md:block w-2/5 bg-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-60">
                {/* Abstract Pattern or Image */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop')] bg-cover bg-center" />
              </div>
              <div className="absolute inset-0 bg-gold/10" />
              <div className="absolute top-8 left-6 right-6 text-white">
                <h3 className="text-2xl font-serif font-bold mb-2">Exclusive Offer</h3>
                <p className="text-xs text-zinc-300">Register now for early bird privileges on our upcoming launches.</p>
              </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-3/5 p-8">
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
                  <h4 className="text-lg font-bold text-black mb-2">Thank You!</h4>
                  <p className="text-zinc-600 text-xs">
                    {SUCCESS_MESSAGES.LEAD_SUBMITTED}
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gold/10 rounded-full">
                      <Gift className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-black">Get VIP Access</h3>
                  </div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-sm mb-4"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-red-900">Error</p>
                        <p className="text-xs text-red-700">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="+91 99999 99999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white py-3 font-medium mt-4 hover:bg-gold hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Request Access"
                      )}
                    </button>
                  </form>

                  <p className="text-[10px] text-center text-zinc-400 mt-4">
                    We respect your privacy. No spam, ever.
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
