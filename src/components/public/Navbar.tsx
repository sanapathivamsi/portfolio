import React from 'react';
import { Sparkles, Terminal, FileDown, ShieldCheck, SunMoon } from 'lucide-react';
import { ProfileData } from '../../types/portfolio';

interface NavbarProps {
  profile: ProfileData;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onOpenFounderAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeSection,
  onNavigate,
  reducedMotion,
  onToggleReducedMotion,
  onOpenFounderAuth,
}) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'academics', label: 'Academics & Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between rounded-2xl cosmic-surface px-4 py-2.5 shadow-2xl">
          {/* Brand Monogram */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#101C3C] border border-[#B8D8FF]/30 flex items-center justify-center font-heading font-bold text-sm text-[#B8D8FF] group-hover:border-[#7767D8] transition-colors">
              VM
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-xs text-[#F4F5FA] tracking-wider uppercase group-hover:text-[#B8D8FF] transition-colors">
                {profile.name}
              </span>
              <span className="text-[10px] text-[#A9B1C7] font-mono tracking-tight">
                CSE · Portfolio
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1 transition-colors duration-150 ${
                    isActive ? 'text-[#B8D8FF] font-semibold' : 'text-[#A9B1C7] hover:text-[#F4F5FA]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7767D8] rounded-full shadow-[0_0_8px_#7767D8]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center gap-2">
            {/* Reduced Motion Toggle */}
            <button
              onClick={onToggleReducedMotion}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors ${
                reducedMotion
                  ? 'border-[#7767D8] bg-[#7767D8]/20 text-[#B8D8FF]'
                  : 'border-white/10 text-[#A9B1C7] hover:text-[#F4F5FA]'
              }`}
              title={reducedMotion ? 'Enable 3D camera animations' : 'Reduce 3D motion for accessibility'}
            >
              <SunMoon className="w-3.5 h-3.5" />
            </button>

            {/* Direct Résumé Download button in header */}
            <a
              href={profile.resumeUrl}
              download={profile.resumeFileName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B8D8FF]/30 bg-[#101C3C]/80 text-[#B8D8FF] hover:bg-[#7767D8]/20 hover:border-[#7767D8] transition-all text-xs font-medium"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Résumé</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
