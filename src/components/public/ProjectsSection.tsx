import React, { useState } from 'react';
import { ExternalLink, Github, Layers, ArrowUpRight, CheckCircle2, X, Terminal, Monitor, Mic } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const publishedProjects = projects
    .filter((p) => p.status === 'Published')
    .sort((a, b) => a.order - b.order);

  const vortexProj = publishedProjects.find((p) => p.title.toLowerCase().includes('vortex'));
  const voiceProj = publishedProjects.find((p) => p.title.toLowerCase().includes('voice') || p.title.toLowerCase().includes('attendance'));
  const otherProjects = publishedProjects.filter((p) => p !== vortexProj && p !== voiceProj);

  return (
    <section id="projects" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#7767D8] tracking-widest uppercase">
              PROJECTS // FEATURED WORK
            </span>
            <span className="h-px w-12 bg-[#7767D8]/40" />
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F4F5FA] tracking-tight">
            Featured Engineering Projects
          </h2>
          <p className="text-sm text-[#A9B1C7] mt-2 max-w-xl">
            Real software systems and architectural interfaces engineered with frontend telemetry and voice-driven IoT computing.
          </p>
        </div>

        {/* DISTINCT COMPOSITION 01: VORTEX-MONITORING-SYSTEM
            Asymmetric widescreen telemetry interface composition */}
        {vortexProj && (
          <div className="relative group rounded-3xl cosmic-surface border border-[#B8D8FF]/20 overflow-hidden p-6 sm:p-10 transition-all duration-300 hover:border-[#7767D8]/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#B8D8FF] mb-2">
                    <Monitor className="w-4 h-4 text-[#7767D8]" />
                    <span>01 // FRONTEND ARCHITECTURE</span>
                    <span aria-hidden="true" className="text-white/20">·</span>
                    <span className="text-[#A9B1C7]">Status: Completed</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#F4F5FA] tracking-tight mb-2">
                    {vortexProj.title}
                  </h3>
                  <p className="text-sm text-[#B8D8FF] font-medium font-mono">
                    {vortexProj.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#A9B1C7] leading-relaxed font-light">
                  {vortexProj.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {vortexProj.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#F4F5FA]/80 font-light">
                      <span className="text-[#7767D8] font-bold">›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies: Unboxed text with typographic separators */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-[#A9B1C7] uppercase mb-1.5 tracking-wider">
                    Core Technologies
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#B8D8FF]">
                    {vortexProj.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {idx < vortexProj.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {vortexProj.githubUrl && (
                    <a
                      href={vortexProj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#101C3C] border border-[#B8D8FF]/30 text-[#B8D8FF] hover:border-[#7767D8] hover:text-[#F4F5FA] transition-all text-xs font-mono flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Repository</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(vortexProj)}
                    className="px-4 py-2.5 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all text-xs font-mono flex items-center gap-2"
                  >
                    <span>System Specifications</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Media Preview Column */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#090e1f] aspect-video group-hover:border-[#B8D8FF]/40 transition-all shadow-2xl">
                  <img
                    src={vortexProj.imageUrl}
                    alt={vortexProj.title}
                    className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B18] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#080B18]/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#B8D8FF]">Telemetry Visualizer // Active</span>
                    <span className="text-[10px] font-mono text-[#A9B1C7]">React · Telemetry Stream</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DISTINCT COMPOSITION 02: VOICE-BASED ATTENDANCE SYSTEM USING AN IOT DEVICE
            Technical schematic & architectural ledger composition */}
        {voiceProj && (
          <div className="relative group rounded-3xl cosmic-surface border border-white/10 overflow-hidden p-6 sm:p-10 transition-all duration-300 hover:border-[#B8D8FF]/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Media on Left for deliberate visual cadence variation */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#090e1f] aspect-video group-hover:border-[#7767D8]/40 transition-all shadow-2xl">
                  <img
                    src={voiceProj.imageUrl}
                    alt={voiceProj.title}
                    className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080B18] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#080B18]/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#B8D8FF]">IoT Edge Audio Node // Verified</span>
                    <span className="text-[10px] font-mono text-[#A9B1C7]">Python · Hardware · SQL</span>
                  </div>
                </div>
              </div>

              {/* Content on Right */}
              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#7767D8] mb-2">
                    <Mic className="w-4 h-4 text-[#B8D8FF]" />
                    <span>02 // EMBEDDED COMPUTING & VOICE BIOMETRICS</span>
                    <span aria-hidden="true" className="text-white/20">·</span>
                    <span className="text-[#A9B1C7]">Status: Verified</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[#F4F5FA] tracking-tight mb-2">
                    {voiceProj.title}
                  </h3>
                  <p className="text-sm text-[#B8D8FF] font-medium font-mono">
                    {voiceProj.tagline}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#A9B1C7] leading-relaxed font-light">
                  {voiceProj.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {voiceProj.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#F4F5FA]/80 font-light">
                      <span className="text-[#B8D8FF] font-bold">›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-[#A9B1C7] uppercase mb-1.5 tracking-wider">
                    Integrated Stack
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#B8D8FF]">
                    {voiceProj.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {idx < voiceProj.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-white/20">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {voiceProj.githubUrl && (
                    <a
                      href={voiceProj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#101C3C] border border-[#B8D8FF]/30 text-[#B8D8FF] hover:border-[#7767D8] hover:text-[#F4F5FA] transition-all text-xs font-mono flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>Repository Hub</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(voiceProj)}
                    className="px-4 py-2.5 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all text-xs font-mono flex items-center gap-2"
                  >
                    <span>Architecture Overview</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Any Other Projects Configured via Founder Dashboard */}
        {otherProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {otherProjects.map((proj) => (
              <div
                key={proj.id}
                className="cosmic-surface p-6 rounded-2xl border border-white/10 hover:border-[#7767D8]/40 transition-all space-y-4"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-[#090e1f] relative">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-heading text-xl font-bold text-[#F4F5FA]">{proj.title}</h4>
                <p className="text-xs text-[#A9B1C7] leading-relaxed">{proj.description}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#B8D8FF]">
                  {proj.technologies.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Specification Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B18]/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl cosmic-surface border border-[#B8D8FF]/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-[#A9B1C7] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono text-[#7767D8] uppercase mb-1">
                {selectedProject.category} // Technical Specification
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#F4F5FA]">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-[#B8D8FF] font-mono mt-1">{selectedProject.tagline}</p>
            </div>

            <p className="text-sm text-[#A9B1C7] leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <div className="text-xs font-mono text-[#F4F5FA] uppercase tracking-wider">
                Engineering Highlights:
              </div>
              <ul className="space-y-1.5 text-xs text-[#A9B1C7]">
                {selectedProject.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#B8D8FF]">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#A9B1C7]">
                Technologies: <span className="text-[#B8D8FF]">{selectedProject.technologies.join(' · ')}</span>
              </div>

              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all text-xs font-mono flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Open GitHub Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
