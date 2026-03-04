"use client";

import { motion } from "framer-motion";

const brands = [
    {
        name: "DLF",
        projects: "The Camellias, Magnolias, Aralias",
    },
    {
        name: "EMAAR",
        projects: "Dubai Marina, Downtown, Creek",
    },
    {
        name: "Central Park",
        projects: "Flower Valley, Aquatic, Bellevue",
    },
    {
        name: "Oberoi Realty",
        projects: "Sky Heights, Esquire, 360 West",
    },
    {
        name: "Lodha Group",
        projects: "Altamount, World Towers, Trump",
    },
    {
        name: "Godrej Properties",
        projects: "The Trees, Summit, Avenues",
    },
    {
        name: "Prestige Group",
        projects: "Prestige Golfshire, Leela Residences",
    },
    {
        name: "M3M",
        projects: "M3M Golfestate, St. Andrews, Latitude",
    },
    {
        name: "Sobha Limited",
        projects: "Sobha Hartland, International City",
    },
    {
        name: "Ambience",
        projects: "Ambience Creacions, Tiverton",
    },
    {
        name: "Nakheel",
        projects: "Palm Jumeirah, The World Islands",
    },
    {
        name: "Damac",
        projects: "Damac Hills, Akoya Oxygen",
    },
];

export function TrustedPartnerships() {
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
                        Trusted Partnerships
                    </motion.h4>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-serif font-bold text-[#2D2926] mb-6 leading-tight"
                    >
                        Brands We <span className="text-gold">Work With</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Collaborating with India&apos;s and Dubai&apos;s most prestigious developers to bring you the finest real estate.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 min-h-[220px] aspect-square lg:aspect-auto"
                        >
                            <h3 className="text-2xl font-serif font-bold text-[#2D2926] mb-4 tracking-tight leading-tight">
                                {brand.name}
                            </h3>
                            <p className="text-[10px] leading-relaxed text-zinc-400 font-medium px-2 uppercase tracking-wider">
                                {brand.projects}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
