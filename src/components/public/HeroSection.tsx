import React, { useState } from 'react';
import {
  ChevronRight, ArrowDown, Terminal, Cpu, Database, Monitor,
  Radio, ShieldCheck, Code2, Sparkles, Layers, Activity, Server
} from 'lucide-react';
import { ProfileData, WebsiteSettings } from '../../types/portfolio';

interface HeroSectionProps {
  profile: ProfileData;
  settings: WebsiteSettings;
  onExploreProjects: () => void;
  onContactMe: () => void;
  onDiscoverJourney: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  settings,
  onExploreProjects,
  onContactMe,
  onDiscoverJourney,
}) => {
  // Interactive architectural console layer
  const [activeLayer, setActiveLayer] = useState<'core' | 'db' | 'telemetry' | 'iot'>('core');

  const architectureLayers = [
    {
      id: 'core' as const,
      name: '01 // Core Logic',
      title: 'Algorithmic Runtime',
      language: 'Java & Python',
      snippet: `// Algorithmic Traversal & Deterministic State
public class SystemPipeline {
  private final PriorityQueue<Node> taskQueue;
  public void dispatch(Signal input) {
    taskQueue.offer(new Node(input.timestamp, input.payload));
    synchronizeMemoryBuffer();
  }
}`,
      metrics: [
        { label: 'Time Complexity', value: 'O(log N)' },
        { label: 'Execution Model', value: 'Compiled / Bytecode' },
        { label: 'Paradigm', value: 'OOP & Modular Logic' },
      ],
    },
    {
      id: 'db' as const,
      name: '02 // Database',
      title: 'Relational Schemas & SQL',
      language: 'SQL Engine',
      snippet: `-- Normalized Attendance & Telemetry Ledger
CREATE TABLE attendance_records (
  entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_identifier VARCHAR(32) NOT NULL,
  voice_match_confidence NUMERIC(5,2) CHECK (voice_match_confidence >= 85.0),
  logged_at TIMESTAMPTZ DEFAULT clock_timestamp()
);`,
      metrics: [
        { label: 'Transaction Safety', value: 'ACID Guaranteed' },
        { label: 'Indexing Scheme', value: 'B-Tree & Hash' },
        { label: 'Normalization', value: '3NF Structured' },
      ],
    },
    {
      id: 'telemetry' as const,
      name: '03 // Frontend Interface',
      title: 'Vortex Monitoring System',
      language: 'Frontend Engineering',
      snippet: `// Real-Time Telemetry Stream & Reactive Matrix
interface TelemetrySignal {
  sensorId: string;
  voltage: number;
  status: 'OPTIMAL' | 'DEGRADED';
}
export const useTelemetryStream = (channel: string) => {
  return useSyncExternalStore(subscribe, getSnapshot);
};`,
      metrics: [
        { label: 'Telemetry Stream', value: '60 FPS Reactive' },
        { label: 'Layout Integrity', value: 'Responsive CSS Grid' },
        { label: 'Cognitive Load', value: 'Low / Instant Read' },
      ],
    },
    {
      id: 'iot' as const,
      name: '04 // Hardware Edge',
      title: 'Voice IoT Biometrics',
      language: 'Embedded Python',
      snippet: `# Edge Voice Feature Extraction & Verification
import numpy as np
def verify_acoustic_signature(audio_stream):
    mfcc_coeffs = extract_spectral_features(audio_stream)
    student_id = match_voice_profile(mfcc_coeffs, threshold=0.88)
    return log_verified_attendance(student_id)`,
      metrics: [
        { label: 'Audio Sample Rate', value: '16 kHz Mono' },
        { label: 'Hardware Edge', value: 'Microcontroller Node' },
        { label: 'Proxy Mitigation', value: 'Biometric Verified' },
      ],
    },
  ];

  const currentLayer = architectureLayers.find((l) => l.id === activeLayer) || architectureLayers[0];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#080B18] overflow-hidden"
    >
      {/* Background restrained cosmic depth & subtle grid lines (strictly non-character) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(16,28,60,0.6)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(119,103,216,0.08)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#B8D8FF 1px, transparent 1px), linear-gradient(90deg, #B8D8FF 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ====================================================
              LEFT COLUMN: EDITORIAL HEADLINE & ACTIONS (6 COLS)
             ==================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full cosmic-surface border border-[#B8D8FF]/20 text-xs font-mono text-[#B8D8FF]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wider uppercase text-[11px]">
                {settings.heroKicker || 'SYSTEM ACTIVE // ASPIRING SOFTWARE DEVELOPER'}
              </span>
            </div>

            {/* Prominent Legal Name */}
            <div>
              <h1 className="font-heading font-black text-4xl sm:text-5xl xl:text-6xl tracking-tight text-[#F4F5FA] leading-[0.98]">
                <span className="block">SANAPATHI</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F4F5FA] via-[#B8D8FF] to-[#7767D8]">
                  VAMSI MOHAN
                </span>
              </h1>

              {/* Sub-Roles / Credentials */}
              <div className="mt-3 space-y-1">
                <p className="font-heading text-sm sm:text-base font-semibold tracking-wider text-[#B8D8FF] uppercase">
                  {settings.heroRole1 || 'COMPUTER SCIENCE ENGINEERING'}
                </p>
                <p className="text-xs sm:text-sm font-mono tracking-widest text-[#A9B1C7] uppercase">
                  {settings.heroRole2 || 'ASPIRING SOFTWARE DEVELOPER'}
                </p>
              </div>
            </div>

            {/* Concise Introduction based on genuine résumé */}
            <p className="text-sm sm:text-base text-[#A9B1C7] leading-relaxed max-w-xl font-light">
              {profile.bio ||
                'Computer Science Engineering student and aspiring software developer interested in programming, problem-solving, learning new technologies, and contributing to software development work.'}
            </p>

            {/* Two Action Buttons: "View Projects" and "Contact Me" */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={onExploreProjects}
                className="px-6 py-3.5 rounded-xl bg-[#7767D8] text-[#F4F5FA] font-medium text-xs sm:text-sm tracking-wider uppercase hover:bg-[#6857cc] transition-all shadow-[0_0_24px_rgba(119,103,216,0.35)] flex items-center gap-2 group cursor-pointer"
              >
                <span>View Projects</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onContactMe}
                className="px-6 py-3.5 rounded-xl border border-[#B8D8FF]/30 cosmic-surface text-[#B8D8FF] font-medium text-xs sm:text-sm tracking-wider uppercase hover:border-[#7767D8] hover:text-[#F4F5FA] transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Contact Me</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Verified Credentials Strip */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-[#A9B1C7] font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B8D8FF]" />
                <span>Lendi IET · CGPA 8.0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7767D8]" />
                <span>Java · Python · SQL · Data Structures</span>
              </div>
            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN: INTERACTIVE SYSTEMS ARCHITECTURE CONSOLE
              (Layered technical architectural visual element)
             ==================================================== */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="rounded-3xl border border-[#B8D8FF]/20 bg-[#0e1428]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Console Header Bar */}
              <div className="px-5 py-3.5 bg-[#080B18]/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[#A9B1C7] tracking-tight">
                    system_architecture // telemetry_matrix
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SYNCHRONIZED</span>
                </div>
              </div>

              {/* Layer Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-[#0a0e1c] border-b border-white/5 text-[11px] font-mono">
                {architectureLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`px-3 py-2 rounded-xl text-left transition-all ${
                      activeLayer === layer.id
                        ? 'bg-[#1a2548] text-[#B8D8FF] border border-[#7767D8]/50 font-semibold shadow-sm'
                        : 'text-[#A9B1C7] hover:text-[#F4F5FA] hover:bg-white/5'
                    }`}
                  >
                    <div className="truncate">{layer.name}</div>
                  </button>
                ))}
              </div>

              {/* Active Architecture Layer Card */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-lg text-[#F4F5FA]">
                      {currentLayer.title}
                    </h4>
                    <span className="text-xs font-mono text-[#7767D8]">{currentLayer.language}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#101C3C] text-[#B8D8FF] border border-[#B8D8FF]/20">
                    Active Module
                  </span>
                </div>

                {/* Syntax-Highlighted Code Logic Snippet */}
                <div className="rounded-xl bg-[#060812] border border-white/10 p-3.5 overflow-x-auto text-[11px] font-mono text-[#B8D8FF]/90 leading-relaxed">
                  <pre className="text-[#A9B1C7]">
                    <code>{currentLayer.snippet}</code>
                  </pre>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                  {currentLayer.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#080B18]/70 border border-white/5 text-center">
                      <div className="text-[10px] font-mono text-[#A9B1C7]">{m.label}</div>
                      <div className="text-xs font-mono font-semibold text-[#F4F5FA] mt-0.5 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console Footer Status */}
              <div className="px-5 py-2.5 bg-[#080B18]/60 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A9B1C7]">
                <span>Kernel: Java · Python · SQL</span>
                <span className="text-[#B8D8FF]">Lendi Institute of Eng. & Tech.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="pt-12 flex justify-center">
          <button
            onClick={onDiscoverJourney}
            className="group flex flex-col items-center gap-1.5 text-[#A9B1C7]/60 hover:text-[#B8D8FF] transition-colors cursor-pointer"
            title="Scroll to explore narrative"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Explore Architecture</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
