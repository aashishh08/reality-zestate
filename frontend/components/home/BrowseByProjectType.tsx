"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib";

interface BrowseByProjectTypeProps {
    categories: Category[];
}

// Curated colour palette per category slug — falls back to gold
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
    "luxury": { bg: "#D97706", text: "#fff", border: "#D97706", emoji: "👑" },
    "golf-residences": { bg: "#16A34A", text: "#fff", border: "#16A34A", emoji: "⛳" },
    "branded-residences": { bg: "#7C3AED", text: "#fff", border: "#7C3AED", emoji: "✨" },
    "villas": { bg: "#0369A1", text: "#fff", border: "#0369A1", emoji: "🏡" },
    "penthouse": { bg: "#B91C1C", text: "#fff", border: "#B91C1C", emoji: "🌆" },
    "township": { bg: "#0891B2", text: "#fff", border: "#0891B2", emoji: "🏙️" },
    "smart-city": { bg: "#4F46E5", text: "#fff", border: "#4F46E5", emoji: "🤖" },
    "integrated-township": { bg: "#059669", text: "#fff", border: "#059669", emoji: "🌳" },
    "affordable": { bg: "#65A30D", text: "#fff", border: "#65A30D", emoji: "🏠" },
    "senior-living": { bg: "#DB2777", text: "#fff", border: "#DB2777", emoji: "🌸" },
    "office-spaces": { bg: "#374151", text: "#fff", border: "#374151", emoji: "🏢" },
    "retail": { bg: "#B45309", text: "#fff", border: "#B45309", emoji: "🛍️" },
    "mixed-use": { bg: "#6D28D9", text: "#fff", border: "#6D28D9", emoji: "🔀" },
    "commercial": { bg: "#1F2937", text: "#fff", border: "#1F2937", emoji: "💼" },
};

const DEFAULT_STYLE = { bg: "#C9A961", text: "#fff", border: "#C9A961", emoji: "🏗️" };

export function BrowseByProjectType({ categories }: BrowseByProjectTypeProps) {
    if (!categories || categories.length === 0) return null;

    const display = categories.slice(0, 12);

    return (
        <section className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
                        Find Your Perfect Home
                    </h4>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-black leading-tight">
                        Browse by <span className="text-gold-dark">Project Type</span>
                    </h2>
                    <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
                        From ultra-luxury penthouses to smart affordable homes — discover the category that matches your vision.
                    </p>
                </motion.div>

                {/* Category pill grid */}
                <div className="flex flex-wrap justify-center gap-4">
                    {display.map((cat, index) => {
                        const style = CATEGORY_STYLES[cat.slug] || DEFAULT_STYLE;
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    style={{
                                        borderColor: style.border,
                                        backgroundColor: "transparent",
                                        color: style.bg,
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = style.bg;
                                        (e.currentTarget as HTMLElement).style.color = style.text;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                                        (e.currentTarget as HTMLElement).style.color = style.bg;
                                    }}
                                >
                                    <span className="text-xl">{style.emoji}</span>
                                    <span className="font-semibold tracking-wide text-sm uppercase">{cat.name}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-14 text-center"
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold text-sm tracking-widest rounded-sm hover:bg-gold-dark transition-colors uppercase"
                    >
                        Explore All Properties
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
