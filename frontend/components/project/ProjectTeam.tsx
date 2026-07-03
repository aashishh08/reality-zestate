"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Building2, Palette } from "lucide-react";

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
  heading?: string;
  description?: string;
}

const DEFAULT_TEAM_DESCRIPTION =
  'World-class professionals coming together to create an architectural masterpiece';

const roleIcons: Record<string, React.ElementType> = {
  architect: Building2,
  landscape: Palette,
  construction: Building2,
  default: Building2,
};

// Named colors that come from the admin form or Excel → resolve to valid hex
const colorMap: Record<string, string> = {
  blue: "#3B82F6",
  green: "#10B981",
  orange: "#F97316",
  purple: "#8B5CF6",
  red: "#EF4444",
  gold: "#C9A961",
};

/** Accepts a hex value or a named color, always returns a valid CSS color string */
function resolveColor(raw: string | undefined): string {
  if (!raw) return "#3B82F6";
  if (raw.startsWith("#")) return raw;
  return colorMap[raw.toLowerCase()] ?? "#3B82F6";
}

export function ProjectTeam({
  team,
  heading = 'Design & Construction Team',
  description = DEFAULT_TEAM_DESCRIPTION,
}: ProjectTeamProps) {
  if (!team || !team.members || team.members.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <SectionHeading
            label="The Visionaries"
            description={description}
          >
            {heading}
          </SectionHeading>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          {team.members.map((member, index) => {
            const resolvedColor = resolveColor(member.color);

            return (
              <motion.div
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className="px-6 py-5 text-white"
                  style={{ backgroundColor: resolvedColor }}
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

                <div className="px-6 py-5 bg-white text-left border-t border-gray-100">
                  {member.description?.trim() ? (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{member.description}</p>
                  ) : null}
                  {member.achievements?.length ? (
                    <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
                      {member.achievements.map((a, i) =>
                        a?.trim() ? (
                          <li key={i} className="leading-snug">
                            {a}
                          </li>
                        ) : null,
                      )}
                    </ul>
                  ) : null}
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Highlights — first 3 in a compact row; any others as horizontal strips below */}
        {team.highlights && team.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-[#1F2937] to-[#111827] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 md:p-8 min-w-0 overflow-hidden space-y-2 sm:space-y-3"
          >
            {team.highlights.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 min-w-0">
                {team.highlights.slice(0, 3).map((highlight, index) => {
                  const IconComponent =
                    (highlight.icon ? roleIcons[highlight.icon] : null) ?? roleIcons.default;

                  return (
                    <motion.div
                      key={`${highlight.title}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex flex-row sm:flex-col items-center sm:items-center gap-1.5 sm:gap-0 min-w-0 rounded-lg bg-white/5 border border-white/10 px-1.5 py-2 sm:px-3 sm:py-4 md:px-4 md:py-5 sm:text-center"
                    >
                      <div className="shrink-0 sm:flex sm:justify-center sm:mb-2 md:mb-3">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-[#C9A961]/20 flex items-center justify-center">
                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#C9A961]" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 sm:flex-none">
                        <h3 className="text-white text-[9px] sm:text-xs md:text-base font-serif font-bold leading-tight break-words [overflow-wrap:anywhere] line-clamp-2 sm:line-clamp-none">
                          {highlight.title}
                        </h3>
                        <p className="hidden sm:block text-gray-400 text-[10px] md:text-xs leading-snug break-words [overflow-wrap:anywhere] mt-1">
                          {highlight.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {team.highlights.slice(3).map((highlight, index) => {
              const IconComponent =
                (highlight.icon ? roleIcons[highlight.icon] : null) ?? roleIcons.default;

              return (
                <motion.div
                  key={`${highlight.title}-strip-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="flex flex-row items-center gap-2.5 sm:gap-3 min-w-0 rounded-lg bg-white/5 border border-white/10 px-2.5 py-2 sm:px-4 sm:py-2.5 max-h-14 sm:max-h-none overflow-hidden"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C9A961]/20 flex items-center justify-center shrink-0">
                    <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A961]" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex flex-row items-center gap-1 sm:block min-w-0">
                      <h3 className="text-white text-[10px] sm:text-sm font-serif font-bold leading-tight shrink-0 break-words [overflow-wrap:anywhere]">
                        {highlight.title}
                      </h3>
                      {highlight.subtitle?.trim() ? (
                        <p className="text-gray-400 text-[9px] sm:text-xs leading-tight truncate sm:whitespace-normal sm:mt-0.5 min-w-0 flex-1">
                          <span className="sm:hidden text-gray-500 mx-1">·</span>
                          {highlight.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
