import React from 'react';
import { GraduationCap, Award, Calendar, MapPin, Database, Cpu, Terminal, BookOpen } from 'lucide-react';
import { EducationItem, SkillItem } from '../../types/portfolio';

interface AcademicsAndSkillsSectionProps {
  education: EducationItem[];
  skills: SkillItem[];
}

export const AcademicsAndSkillsSection: React.FC<AcademicsAndSkillsSectionProps> = ({
  education,
  skills,
}) => {
  // Group skills by category
  const programmingSkills = skills.filter((s) => s.category === 'Programming Languages' && s.isPublished);
  const databaseSkills = skills.filter((s) => s.category === 'Database' && s.isPublished);
  const coreConceptSkills = skills.filter((s) => s.category === 'Core Concepts' && s.isPublished);

  return (
    <section id="academics" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-20">
        {/* =========================================
            PART 1: EDUCATION (ARCHITECTURAL TIMELINE)
           ========================================= */}
        <div>
          {/* Section Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#7767D8] tracking-widest uppercase">
                ACADEMICS // FORMAL EDUCATION
              </span>
              <span className="h-px w-12 bg-[#7767D8]/40" />
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F4F5FA] tracking-tight">
              Academic Milestones
            </h2>
            <p className="text-sm text-[#A9B1C7] mt-2 max-w-xl">
              Chronological academic progression verifying coursework in computer science engineering and applied technologies.
            </p>
          </div>

          {/* Refined Timeline Layout - Avoids repetitive generic cards */}
          <div className="relative border-l border-[#B8D8FF]/20 ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
            {education
              .filter((e) => e.isPublished)
              .map((item, index) => (
                <div key={item.id} className="relative group">
                  {/* Glowing Node on Timeline Axis */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#101C3C] border-2 border-[#B8D8FF] group-hover:border-[#7767D8] group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(184,216,255,0.4)]" />

                  {/* Editorial Layout */}
                  <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-[#7767D8]/40 transition-all">
                    {/* Header line with clean unboxed metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                      <div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F4F5FA]">
                          {item.degree}
                        </h3>
                        <p className="text-sm text-[#B8D8FF] font-medium mt-0.5">
                          {item.institution}
                        </p>
                      </div>

                      {/* Score & Duration as unboxed typographic metadata */}
                      <div className="flex items-center gap-3 text-xs font-mono text-[#A9B1C7]">
                        <span className="text-[#F4F5FA] font-semibold text-sm">
                          {item.scoreType}: {item.scoreValue}
                        </span>
                        <span aria-hidden="true" className="text-white/20">·</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Location & Details */}
                    {item.location && (
                      <div className="flex items-center gap-2 text-xs font-mono text-[#A9B1C7] mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#7767D8]" />
                        <span>{item.location}</span>
                      </div>
                    )}

                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="space-y-1.5 mt-3 text-sm text-[#A9B1C7] font-light">
                        {item.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <span className="text-[#7767D8] mt-1 font-mono text-xs">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* =========================================
            PART 2: SKILLS (EDITORIAL DISCIPLINE)
           ========================================= */}
        <div>
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-[#B8D8FF] tracking-widest uppercase">
                CORE COMPETENCIES // SOURCE OF TRUTH
              </span>
              <span className="h-px w-12 bg-[#B8D8FF]/40" />
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F4F5FA] tracking-tight">
              Technical Skillset
            </h2>
            <p className="text-sm text-[#A9B1C7] mt-1 max-w-xl">
              Strictly grounded in verified résumé proficiencies. No fabricated proficiency meters or arbitrary percentage bars.
            </p>
          </div>

          {/* Three Categorized Skill Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Programming Languages */}
            <div className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-[#B8D8FF] font-mono text-xs uppercase tracking-wider pb-3 border-b border-white/10">
                <Terminal className="w-4 h-4 text-[#7767D8]" />
                <span>Programming Languages</span>
              </div>

              <div className="space-y-4">
                {programmingSkills.map((skill) => (
                  <div key={skill.id} className="group">
                    <div className="flex items-baseline justify-between text-base font-semibold text-[#F4F5FA] group-hover:text-[#B8D8FF] transition-colors">
                      <span>{skill.name}</span>
                      <span className="text-xs font-mono text-[#A9B1C7] font-normal">Core</span>
                    </div>
                    {skill.note && (
                      <p className="text-xs text-[#A9B1C7] mt-1 font-light leading-relaxed">
                        {skill.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Database */}
            <div className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-[#B8D8FF] font-mono text-xs uppercase tracking-wider pb-3 border-b border-white/10">
                <Database className="w-4 h-4 text-[#7767D8]" />
                <span>Database</span>
              </div>

              <div className="space-y-4">
                {databaseSkills.map((skill) => (
                  <div key={skill.id} className="group">
                    <div className="flex items-baseline justify-between text-base font-semibold text-[#F4F5FA] group-hover:text-[#B8D8FF] transition-colors">
                      <span>{skill.name}</span>
                      <span className="text-xs font-mono text-[#A9B1C7] font-normal">Relational</span>
                    </div>
                    {skill.note && (
                      <p className="text-xs text-[#A9B1C7] mt-1 font-light leading-relaxed">
                        {skill.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Core Concepts */}
            <div className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-[#B8D8FF] font-mono text-xs uppercase tracking-wider pb-3 border-b border-white/10">
                <Cpu className="w-4 h-4 text-[#7767D8]" />
                <span>Core Concepts</span>
              </div>

              <div className="space-y-4">
                {coreConceptSkills.map((skill) => (
                  <div key={skill.id} className="group">
                    <div className="flex items-baseline justify-between text-sm sm:text-base font-semibold text-[#F4F5FA] group-hover:text-[#B8D8FF] transition-colors">
                      <span>{skill.name}</span>
                      <span className="text-xs font-mono text-[#A9B1C7] font-normal">Theory & Practice</span>
                    </div>
                    {skill.note && (
                      <p className="text-xs text-[#A9B1C7] mt-1 font-light leading-relaxed">
                        {skill.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
