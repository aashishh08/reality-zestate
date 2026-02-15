"use client";

import Image from "next/image";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { Download, Calendar } from "lucide-react";
import { useState } from "react";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const { details } = project;
  const [showForm, setShowForm] = useState(false);
  
  if (!details) return null;

  return (
    <>
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={details.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light mb-6">
                {details.subtitle}
              </p>
              <p className="text-lg text-white/70 mb-8">
                📍 {project.location}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-gold to-gold-dark text-white px-8 py-4 rounded-sm font-bold tracking-wide hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group transform hover:-translate-y-1"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Schedule Site Visit
                </button>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-sm font-bold tracking-wide hover:bg-white hover:text-[#2C2416] transition-all duration-300 flex items-center justify-center gap-3 group">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download Brochure
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Site Visit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-serif text-[#2C2416] mb-6">Schedule Your Visit</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold to-gold-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
              >
                Book Site Visit
              </button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              By submitting, you agree to our privacy policy and terms of service.
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
}
