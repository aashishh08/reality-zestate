"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function BoutiqueCollection() {
  const boutiqueProjects = projects.filter((p) => p.category === "Boutique");

  return (
    <section id="boutique-projects" className="py-24 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h4 className="text-gold font-medium tracking-[0.2em] mb-3 uppercase text-sm">
            Rare & Remarkable
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">
            Boutique <span className="text-gold-dark">Collection</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {boutiqueProjects.map((project, index) => (
            <Link
              key={project.id}
              href={project.subProjects ? `/collection/${project.slug}` : `/project/${project.slug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-sm mb-6">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-serif font-medium text-black mb-2 group-hover:text-gold-dark transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-500 text-sm tracking-wide uppercase mb-3">
                      {project.location}
                    </p>
                    <p className="text-zinc-600 max-w-sm font-light leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
