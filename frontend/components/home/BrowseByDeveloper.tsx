"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { Developer } from "@/lib";

interface BrowseByDeveloperProps {
    developers: Developer[];
}

// Placeholder developer images — keyed by slug for easy extension
const DEV_IMAGES: Record<string, string> = {
    dlf: "/images/project-1.jpg",
    "godrej-properties": "/images/project-2.jpg",
    "prestige-group": "/images/project-3.jpg",
    sobha: "/images/project-4.jpg",
    "max-estates": "/images/project-5.jpg",
    "oberoi-realty": "/images/project-1.jpg",
};

export function BrowseByDeveloper({ developers }: BrowseByDeveloperProps) {
    if (!developers || developers.length === 0) return null;

    const display = developers.slice(0, 6);

    return (
        <section className="py-24 bg-[#F5F5F0]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16 px-4">
                    <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-gold font-medium tracking-[0.3em] mb-4 uppercase text-xs sm:text-sm"
                    >
                        Trusted Names
                    </motion.h4>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-tight"
                    >
                        Browse by <span className="text-gold">Developer</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Explore premium properties from India&apos;s most celebrated and trusted real-estate developers.
                    </motion.p>
                </div>

                {/* Developer grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {display.map((dev, index) => (
                        <motion.div
                            key={dev.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/developer/${dev.slug}`} className="block h-full">
                                <div className="group relative h-[220px] overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                    <Image
                                        src={dev.logo?.trim() || DEV_IMAGES[dev.slug] || "/images/hero-bg.png"}
                                        alt={dev.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                    {/* Developer icon badge */}
                                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Developer</p>
                                        <h3 className="text-white font-serif font-bold text-lg leading-tight">{dev.name}</h3>
                                        <span className="inline-flex items-center gap-1 text-white/60 text-xs mt-2 border-b border-white/20 pb-0.5 group-hover:border-gold group-hover:text-gold transition-colors">
                                            View Projects <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
