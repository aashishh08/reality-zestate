"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 5000); // Open after 5 seconds

    return () => clearTimeout(timer);
  }, [hasOpened]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
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
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-lg bg-white overflow-hidden shadow-2xl rounded-lg pointer-events-auto m-4"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row">
             {/* Left Image Side - Hidden on mobile */}
             <div className="hidden md:block w-2/5 bg-black relative">
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
               <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-gold/10 rounded-full">
                    <Gift className="w-5 h-5 text-gold" />
                 </div>
                 <h3 className="text-xl font-bold text-black">Get VIP Access</h3>
               </div>

               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Name</label>
                   <input type="text" className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Phone</label>
                   <input type="tel" className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm" placeholder="+91 99999 99999" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Email</label>
                   <input type="email" className="w-full border-b border-zinc-200 py-2 focus:outline-none focus:border-gold transition-colors text-sm" placeholder="john@example.com" />
                 </div>
                 
                 <button className="w-full bg-black text-white py-3 font-medium mt-4 hover:bg-gold hover:text-black transition-colors">
                   Request Access
                 </button>
               </form>

               <p className="text-[10px] text-center text-zinc-400 mt-4">
                 We respect your privacy. No spam, ever.
               </p>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
