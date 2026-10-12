import React from 'react';
import { MapPin, Mail, Compass, Terminal, Cpu, Award } from 'lucide-react';
import { ProfileData } from '../../types/portfolio';

interface AboutSectionProps {
  profile: ProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#080B18]">
      {/* Subtle background ambient gradient (No 3D Character) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(16,28,60,0.3)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-12">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#7767D8] tracking-widest uppercase">
              ABOUT // PERSONAL JOURNEY
            </span>
            <span className="h-px w-12 bg-[#7767D8]/40" />
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F4F5FA] tracking-tight">
            Architecting Logic & Systems
          </h2>
          <p className="text-sm text-[#A9B1C7] mt-2 max-w-xl">
            Academic discipline, core software foundations, and engineering philosophy.
          </p>
        </div>

        {/* Two-Column Balanced Layout: Editorial Narrative + Medium Professional Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ====================================================
              LEFT COLUMN: EDITORIAL BIOGRAPHY & PILLARS (Col 7/12)
             ==================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-[#B8D8FF]/15 space-y-5">
              <h3 className="font-heading text-xl font-semibold text-[#B8D8FF]">
                Engineering Philosophy & Academic Discipline
              </h3>

              <p className="text-[#F4F5FA]/90 text-sm sm:text-base leading-relaxed">
                I am a <strong>Computer Science Engineering</strong> student at Lendi Institute of Engineering and
                Technology and an aspiring software developer. My approach to technology is anchored in fundamental
                computer science principles: writing clean, predictable code, understanding underlying database structures,
                and methodically solving algorithmic problems.
              </p>

              <p className="text-[#A9B1C7] text-sm sm:text-base leading-relaxed font-light">
                With a passion for continuous learning and practical implementation, I have developed technical depth across
                both high-level languages like <strong>Java</strong> and <strong>Python</strong>, relational database design with{' '}
                <strong>SQL</strong>, and core systems architecture. I am eager to apply these skills to collaborative
                engineering teams and contribute to software development work that demands rigor and analytical clarity.
              </p>

              {/* Verified Geographic & Contact Anchors */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#A9B1C7] font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7767D8]" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#B8D8FF]" />
                  <a href={`mailto:${profile.email}`} className="hover:text-[#F4F5FA] underline underline-offset-2">
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl cosmic-surface border border-white/5 space-y-2">
                <div className="text-xs font-mono text-[#B8D8FF] uppercase">01 / Logic</div>
                <div className="font-heading text-sm font-semibold text-[#F4F5FA]">Algorithm Design</div>
                <p className="text-xs text-[#A9B1C7] leading-relaxed font-light">
                  Focus on computational efficiency, data structure traversal, and deterministic problem-solving.
                </p>
              </div>

              <div className="p-5 rounded-xl cosmic-surface border border-white/5 space-y-2">
                <div className="text-xs font-mono text-[#7767D8] uppercase">02 / Systems</div>
                <div className="font-heading text-sm font-semibold text-[#F4F5FA]">Relational Integrity</div>
                <p className="text-xs text-[#A9B1C7] leading-relaxed font-light">
                  Database management, structured schemas, ACID transactions, and normalization.
                </p>
              </div>

              <div className="p-5 rounded-xl cosmic-surface border border-white/5 space-y-2">
                <div className="text-xs font-mono text-[#B8D8FF] uppercase">03 / Growth</div>
                <div className="font-heading text-sm font-semibold text-[#F4F5FA]">Adaptive Learning</div>
                <p className="text-xs text-[#A9B1C7] leading-relaxed font-light">
                  Rapid absorption of modern frameworks, emerging developer tooling, and engineering methodologies.
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN: MEDIUM PROFESSIONAL PORTRAIT
              (Strictly 300-360px desktop, 220-260px mobile,
               preserving natural skin tones and identity)
             ==================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-[340px] sm:max-w-[360px] space-y-3">
              {/* Professionally Framed Portrait Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#B8D8FF]/20 bg-[#101C3C]/60 p-2 shadow-xl hover:border-[#7767D8]/40 transition-all">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#0c1224]">
                  {/* Original Photograph preserved with natural skin tones & authentic features */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  {/* Subtle, soft bottom vignette for high-legibility caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B18]/90 via-transparent to-transparent opacity-70" />

                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-[#080B18]/85 backdrop-blur-md border border-white/10 text-center">
                    <div className="font-heading font-semibold text-xs text-[#F4F5FA]">
                      {profile.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#B8D8FF] mt-0.5">
                      Computer Science Engineering
                    </div>
                  </div>
                </div>

                {/* Subtle starlight corner accents */}
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#B8D8FF]" />
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#7767D8]" />
              </div>

              {/* Understated caption */}
              <div className="text-center">
                <span className="text-[11px] font-mono text-[#A9B1C7]/70">
                  Verified Candidate · Lendi IET (2025–2028)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
