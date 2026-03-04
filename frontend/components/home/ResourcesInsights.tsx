"use client";

import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Briefcase } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const resources = [
    {
        title: "Micro Market Price Reports",
        description: "Comprehensive price analysis for Gurgaon, Mumbai, Dubai, and Bangalore micro-markets. Updated monthly with transaction data, price trends, and future predictions.",
        badge: "UPDATED MONTHLY",
        label: "MARKET INTELLIGENCE",
        icon: TrendingUp,
        bgColor: "bg-[#B87C5B]",
        iconColor: "text-white/20",
        whatsappText: "Hi, I'd like to request the Micro Market Price Reports.",
    },
    {
        title: "SuperluxeRE Magazine",
        description: "Quarterly luxury real estate magazine featuring property showcases, developer interviews, investment strategies, and lifestyle content for discerning HNI investors.",
        badge: "QUARTERLY ISSUE",
        label: "LIFESTYLE MAGAZINE",
        icon: BookOpen,
        bgColor: "bg-[#8B7E66]",
        iconColor: "text-white/20",
        whatsappText: "Hi, I'd like to receive the latest SuperluxeRE Magazine.",
    },
    {
        title: "Luxury Real Estate Investment Guide",
        description: "Complete guide for NRI and HNI investors covering legal frameworks, RERA compliance, financing options, tax implications, and portfolio optimization.",
        badge: "ESSENTIAL GUIDE",
        label: "INVESTMENT GUIDE",
        icon: Briefcase,
        bgColor: "bg-[#C4926F]",
        iconColor: "text-white/20",
        whatsappText: "Hi, I'd like to get the Luxury Real Estate Investment Guide.",
    },
];

const waBase = `https://wa.me/${CONTACT_INFO.WHATSAPP_NUMBER.replace(/\D/g, '')}`;

export function ResourcesInsights() {
    return (
        <section className="py-24 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 px-4">
                    <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
                    >
                        Knowledge Center
                    </motion.h4>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
                    >
                        Resources & <span className="text-gold">Insights</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Download exclusive market reports, magazines, and investment guides curated by our research team.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {resources.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl"
                        >
                            {/* Card Header Illustration Area */}
                            <div className={`${item.bgColor} relative h-64 p-8 flex flex-col justify-center items-center overflow-hidden`}>
                                {/* Decorative Pattern / Diagonal Lines */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)' }}>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white text-[10px] font-bold tracking-wider text-black">
                                    {item.badge}
                                </div>

                                <item.icon className="w-20 h-20 text-white relative z-10" strokeWidth={1.5} />

                                <span className="mt-6 text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase">
                                    {item.label}
                                </span>

                                {/* Larger background icon */}
                                <item.icon className={`absolute -bottom-8 -right-8 w-40 h-40 ${item.iconColor} transform rotate-12 pointer-events-none`} />
                            </div>

                            {/* Card Body */}
                            <div className="p-10 flex flex-col flex-grow">
                                <h3 className="text-2xl font-serif font-bold text-[#2D241E] mb-6 leading-tight group-hover:text-gold transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-grow">
                                    {item.description}
                                </p>

                                <a
                                    href={`${waBase}?text=${encodeURIComponent(item.whatsappText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2D241E] font-bold text-xs tracking-widest uppercase border-b border-[#2D241E]/10 pb-2 w-fit group-hover:border-gold transition-all duration-300 group-hover:text-gold"
                                >
                                    Explore Now
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
