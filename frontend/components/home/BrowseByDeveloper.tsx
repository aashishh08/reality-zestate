"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { Developer } from "@/lib";
import { featuredDeveloperDisplayName } from "@/data/featured-developers";

interface BrowseByDeveloperProps {
    developers: Developer[];
}

export function BrowseByDeveloper({ developers }: BrowseByDeveloperProps) {
    if (!developers || developers.length === 0) return null;

    return (
        <section className="py-6 md:py-24 bg-[#F5F5F0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center mb-6 md:mb-16 px-2 md:px-4">
                    <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-gold font-medium tracking-[0.3em] mb-2 md:mb-4 uppercase text-[10px] sm:text-sm"
                    >
                        Trusted Names
                    </motion.h4>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-black mb-3 md:mb-6 leading-tight"
                    >
                        Browse by <span className="text-gold">Developer</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-500 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed line-clamp-2 md:line-clamp-none"
                    >
                        Explore premium properties from India&apos;s most celebrated and trusted real-estate developers.
                    </motion.p>
                </div>

                {/* Developer grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={dev.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/developer/${dev.slug}`} className="block h-full">
                                <div className="group relative h-[140px] md:h-[220px] overflow-hidden rounded-lg md:rounded-xl shadow-md cursor-pointer transform transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-xl active:scale-[0.98] md:active:scale-100">
                                    {dev.logo?.trim() ? (
                                        <Image
                                            src={dev.logo.trim()}
                                            alt={featuredDeveloperDisplayName(dev.slug, dev.name)}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#2C2416] via-[#3d3429] to-[#1a1612]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                    <div className="absolute top-2 left-2 md:top-4 md:left-4 w-7 h-7 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <Building2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-5">
                                        <p className="text-gold text-[8px] md:text-xs font-bold uppercase tracking-widest mb-0.5 md:mb-1">Developer</p>
                                        <h3 className="text-white font-serif font-bold text-xs md:text-lg leading-tight line-clamp-2">{featuredDeveloperDisplayName(dev.slug, dev.name)}</h3>
                                        <span className="hidden md:inline-flex items-center gap-1 text-white/60 text-xs mt-2 border-b border-white/20 pb-0.5 group-hover:border-gold group-hover:text-gold transition-colors">
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
