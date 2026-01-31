"use client";

import { motion } from "framer-motion";

interface CategoryFeaturesProps {
  features: {
    title: string;
    icon: string;
    description?: string;
  }[];
}

export function CategoryFeatures({ features }: CategoryFeaturesProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">
            Why Choose <span className="text-gold">Our Communities</span>
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Experience unparalleled comfort and care with our premium services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-zinc-50 p-8 rounded-sm border border-zinc-200 hover:border-gold hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              {feature.description && (
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
