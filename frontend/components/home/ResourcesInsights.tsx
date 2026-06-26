"use client";

import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Briefcase, type LucideIcon } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";

interface ResourceItem {
    title: string;
    description: string;
    badge: string;
    label: string;
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    whatsappText: string;
    /** Short label for compact mobile cards */
    mobileTitle: string;
}

const resources: ResourceItem[] = [
    {
        title: "Micro Market Price Reports",
        mobileTitle: "Price Reports",
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
        mobileTitle: "Magazine",
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
        mobileTitle: "Invest Guide",
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

function ResourceMobileCard({ item, index }: { item: ResourceItem; index: number }) {
    const Icon = item.icon;

    return (
        <motion.a
            href={`${waBase}?text=${encodeURIComponent(item.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ placement: 'resources_insights_mobile', context: item.mobileTitle })}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col rounded-xl overflow-hidden shadow-lg bg-white touch-manipulation active:scale-[0.98] transition-transform"
        >
            <div className={`${item.bgColor} relative h-[4.5rem] flex items-center justify-center overflow-hidden`}>
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 8px, white 8px, white 9px)",
                    }}
                />
                <Icon className="w-7 h-7 text-white relative z-10" strokeWidth={1.5} />
                <Icon
                    className={`absolute -bottom-3 -right-3 w-14 h-14 ${item.iconColor} rotate-12 pointer-events-none`}
                />
            </div>
            <div className="flex flex-col flex-1 p-2.5 text-center">
                <p className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase mb-1 line-clamp-1">
                    {item.label.split(" ")[0]}
                </p>
                <h3 className="text-[11px] font-serif font-bold text-[#2D241E] leading-snug line-clamp-2 group-active:text-gold transition-colors">
                    {item.mobileTitle}
                </h3>
            </div>
        </motion.a>
    );
}

function ResourceDesktopCard({ item, index }: { item: ResourceItem; index: number }) {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group bg-white rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl"
        >
            <div className={`${item.bgColor} relative h-64 p-8 flex flex-col justify-center items-center overflow-hidden`}>
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px)",
                    }}
                />
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-white text-[10px] font-bold tracking-wider text-black">
                    {item.badge}
                </div>
                <Icon className="w-20 h-20 text-white relative z-10" strokeWidth={1.5} />
                <span className="mt-6 text-[11px] font-bold tracking-[0.2em] text-white/80 uppercase">
                    {item.label}
                </span>
                <Icon
                    className={`absolute -bottom-8 -right-8 w-40 h-40 ${item.iconColor} transform rotate-12 pointer-events-none`}
                />
            </div>

            <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-[#2D241E] mb-6 leading-tight group-hover:text-gold transition-colors duration-300">
                    {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-grow">{item.description}</p>
                <a
                    href={`${waBase}?text=${encodeURIComponent(item.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick({ placement: 'resources_insights_desktop', context: item.mobileTitle })}
                    className="text-[#2D241E] font-bold text-xs tracking-widest uppercase border-b border-[#2D241E]/10 pb-2 w-fit group-hover:border-gold transition-all duration-300 group-hover:text-gold"
                >
                    Explore Now
                </a>
            </div>
        </motion.div>
    );
}

export function ResourcesInsights() {
    return (
        <section className="py-24 px-4 sm:px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16 px-4">
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

                {/* Mobile — 3 compact cards in one row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:hidden">
                    {resources.map((item, index) => (
                        <ResourceMobileCard key={item.title} item={item} index={index} />
                    ))}
                </div>

                {/* md+ — full cards */}
                <div className="hidden md:grid md:grid-cols-3 gap-8">
                    {resources.map((item, index) => (
                        <ResourceDesktopCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
