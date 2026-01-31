"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface SubProject {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  image: string;
  type: string;
  description?: string;
}

interface CollectionProjectsProps {
  projects: SubProject[];
}

export function CollectionProjects({ projects }: CollectionProjectsProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Our <span className="text-gold-dark">Projects</span>
          </h2>
          <p className="text-zinc-600 text-lg">
            Explore our exclusive collection of luxury properties
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/collection/project/${project.slug}`}
                className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Project Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Project Info */}
                <div className="p-6 bg-gray-50">
                  <h3 className="text-2xl font-serif font-semibold text-black mb-2 group-hover:text-gold-dark transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-500 uppercase tracking-wide mb-3">
                    📍 {project.location}
                  </p>
                  <p className="text-zinc-600 mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold font-semibold text-lg">
                      {project.price}
                    </span>
                    <span className="text-sm text-zinc-500 group-hover:text-gold transition-colors">
                      View Details →
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
