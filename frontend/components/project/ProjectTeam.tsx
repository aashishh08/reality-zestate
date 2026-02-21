"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Building2, Palette, CheckCircle2 } from "lucide-react";

interface TeamMember {
  role: string;
  name: string;
  color: string;
  description: string;
  achievements: string[];
}

interface ProjectTeamProps {
  team?: {
    members: TeamMember[];
    highlights?: {
      title: string;
      subtitle: string;
      icon?: string;
    }[];
  };
}

const roleIcons = {
  architect: Building2,
  landscape: Palette,
  construction: Building2,
  default: Building2,
};

const colorMap = {
  blue: "#3B82F6",
  green: "#10B981",
  orange: "#F97316",
};

export function ProjectTeam({ team }: ProjectTeamProps) {
  if (!team || !team.members || team.members.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionHeading
            label="The Visionaries"
            description="World-class professionals coming together to create an architectural masterpiece"
          >
            Design &amp; Construction Team
          </SectionHeading>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {team.members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Header Card with Color */}
              <div
                className="px-6 py-5 text-white"
                style={{ backgroundColor: member.color }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                      {member.role}
                    </p>
                    <h3 className="text-xl font-serif font-bold">{member.name}</h3>
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="bg-white p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Key Achievements */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Key Achievements
                  </p>
                  <ul className="space-y-2.5">
                    {member.achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: member.color }}
                        />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlights Section */}
        {team.highlights && team.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {team.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#C9A961]/20 flex items-center justify-center">
                      <Palette className="w-6 h-6 text-[#C9A961]" />
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-serif font-bold mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{highlight.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
