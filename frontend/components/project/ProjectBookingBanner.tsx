"use client";

import { motion } from "framer-motion";

interface ProjectBookingBannerProps {
  projectTitle: string;
}

export function ProjectBookingBanner({ projectTitle }: ProjectBookingBannerProps) {
  const handleScroll = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-14 overflow-hidden">
      {/* Gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C9A961] to-[#A88B4A]">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-serif text-white mb-3"
        >
          Book a Private Tour
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/90 mb-7 max-w-xl mx-auto text-base"
        >
          Experience {projectTitle} firsthand with our exclusive guided tour
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleScroll}
            className="bg-white text-[#2C2416] px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#2C2416] hover:text-white transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Schedule a Visit
          </button>
          <a
            href="#overview"
            className="text-white border-2 border-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white hover:text-[#2C2416] transition-all"
          >
            Explore the Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}
