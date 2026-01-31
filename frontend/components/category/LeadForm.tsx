"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, Mail, User } from "lucide-react";

interface LeadFormProps {
  offerTitle?: string;
  offerValidTill?: string;
}

export function LeadForm({ offerTitle = "Special Offer Till January 31, 2026", offerValidTill }: LeadFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitStatus("success");
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "" });
      setSubmitStatus("idle");
      setIsOpen(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 bg-gold text-black px-4 py-6 rounded-r-lg shadow-2xl z-40 hover:bg-gold-dark transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-sm whitespace-nowrap writing-mode-vertical-rl rotate-180">
            GET SPECIAL OFFER
          </span>
        </div>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border border-zinc-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gold to-gold-dark text-black px-6 py-4 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-black/60 hover:text-black transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-lg mb-1">{offerTitle}</h3>
          {offerValidTill && (
            <p className="text-xs text-black/80">Valid till {offerValidTill}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <h4 className="text-xl font-bold text-black mb-2">Thank You!</h4>
              <p className="text-zinc-600 text-sm">
                We'll contact you shortly with exclusive details.
              </p>
            </motion.div>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                  Your Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
                  Your Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-11 pr-4 py-3 border border-zinc-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3 px-6 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>SUBMIT</span>
                  </>
                )}
              </button>

              <p className="text-xs text-zinc-500 text-center mt-3">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
