"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitSectionProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  image: string;
  imageAlt?: string;
  reversed?: boolean;
  className?: string;
}

export function SplitSection({
  title,
  subtitle,
  content,
  image,
  imageAlt = "Section Image",
  reversed = false,
  className,
}: SplitSectionProps) {
  return (
    <section className={cn("py-24 overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={cn(
          "flex flex-col lg:flex-row items-center gap-12 lg:gap-20",
          reversed && "lg:flex-row-reverse"
        )}>
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: reversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl group">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            initial={{ opacity: 0, x: reversed ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6 leading-tight">
              {title.split(" ").map((word, i) => (
                <span key={i} className={i === 1 || i === title.split(" ").length - 1 ? "text-gold-dark" : "text-black"}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            {subtitle && (
              <p className="text-lg text-zinc-600 mb-8 font-light">
                {subtitle}
              </p>
            )}
            
            <div className="text-zinc-600">
              {content}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
