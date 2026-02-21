"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, Map } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProjectMasterPlanProps {
    masterPlanImage: string;
    description?: string[];
}

export function ProjectMasterPlan({ masterPlanImage, description }: ProjectMasterPlanProps) {
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                // Hide indicator when scrolled to bottom
                setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 10);
            }
        };

        const currentRef = contentRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            // Check initial state
            handleScroll();
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Default description if none provided
    const defaultDescription = [
        "The master plan showcases a meticulously designed layout that maximizes open spaces while ensuring optimal utilization of the available land. Every element has been thoughtfully positioned to create a harmonious living environment.",
        "The development features strategically planned zones including residential towers, recreational areas, landscaped gardens, and essential amenities. Wide internal roads ensure smooth connectivity throughout the project.",
        "Special attention has been given to creating green corridors and open spaces that promote a healthy lifestyle. The layout ensures privacy for residents while fostering a sense of community through well-designed common areas.",
        "State-of-the-art infrastructure including underground utilities, rainwater harvesting systems, and sustainable design elements are integrated seamlessly into the master plan, making this a truly modern and eco-friendly development."
    ];

    const displayDescription = description && description.length > 0 ? description : defaultDescription;

    return (
        <section className="py-14 bg-white" id="master-plan">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <SectionHeading
                        label="Project Layout"
                        description="Explore the comprehensive layout and thoughtful design of our premium development"
                    >
                        Master Plan
                    </SectionHeading>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Master Plan Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative h-[600px]"
                    >
                        {/* Main Master Plan Image */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={masterPlanImage}
                                alt="Master Plan"
                                fill
                                className="object-contain bg-gray-50"
                            />

                            {/* Subtle Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Decorative Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="absolute top-6 left-6 bg-white rounded-lg p-4 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#C9A961]/10 flex items-center justify-center">
                                    <Map className="w-5 h-5 text-[#C9A961]" />
                                </div>
                                <div>
                                    <p className="font-serif font-bold text-[#2C2416] text-base">
                                        Site Layout
                                    </p>
                                    <p className="text-xs text-gray-600">Master Plan View</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Scrollable Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <h3 className="text-3xl font-serif font-bold text-[#2C2416] mb-6">
                            Thoughtfully Designed Layout
                        </h3>

                        {/* Scrollable Content Container */}
                        <div className="relative">
                            <div
                                ref={contentRef}
                                className={`
                  space-y-4 text-zinc-700 leading-relaxed
                  overflow-y-auto pr-4
                  max-h-[500px]
                  
                  /* Custom Scrollbar Styling */
                  scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold/30
                  hover:scrollbar-thumb-gold/50
                  
                  /* For browsers that don't support scrollbar-thin */
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-track]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-gold/30
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:border-2
                  [&::-webkit-scrollbar-thumb]:border-transparent
                  hover:[&::-webkit-scrollbar-thumb]:bg-gold/50
                  
                  /* Firefox */
                  [scrollbar-width:thin]
                  [scrollbar-color:rgba(201,169,97,0.3)_transparent]
                `}
                            >
                                {displayDescription.map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="text-lg"
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Gradient Fade at Bottom */}
                            {showScrollIndicator && (
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                            )}

                            {/* Scroll Indicator */}
                            {showScrollIndicator && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gold-dark pointer-events-none"
                                >
                                    <span className="text-xs font-medium uppercase tracking-wider">Scroll for more</span>
                                    <motion.div
                                        animate={{ y: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        {/* Decorative Bottom Element */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-[#C9A961]" />
                                <span className="font-medium">Designed for modern living with sustainable practices</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
