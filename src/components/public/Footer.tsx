import React from 'react';
import { Shield, Sparkles, Terminal, ArrowUp } from 'lucide-react';
import { WebsiteSettings } from '../../types/portfolio';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenFounderAccess: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenFounderAccess,
  onScrollToTop,
}) => {
  return (
    <footer className="relative border-t border-white/10 bg-[#080B18]/90 backdrop-blur-md pt-12 pb-16 px-4 sm:px-6 lg:px-8 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Editorial & Attribution */}
        <div className="space-y-1 text-center md:text-left">
          <div className="font-heading font-bold text-sm tracking-wide text-[#F4F5FA]">
            SANAPATHI VAMSI MOHAN
          </div>
          <p className="text-xs font-mono text-[#A9B1C7]">
            {settings.footerNote || 'Computer Science Engineering · Lendi Institute of Engineering and Technology'}
          </p>
          <div className="text-[11px] text-[#A9B1C7]/60 font-mono">
            Chukkavalasa, Andhra Pradesh, India · 2026 Portfolio
          </div>
        </div>

        {/* Right Side: Back to Top & Discreet Founder Access */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#A9B1C7] hover:text-[#F4F5FA] hover:bg-white/5 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top of Orbit</span>
          </button>

          {/* Discreet Founder Access link as required by prompt */}
          <button
            onClick={onOpenFounderAccess}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#A9B1C7]/60 hover:text-[#B8D8FF] hover:bg-[#101C3C]/50 border border-transparent hover:border-[#7767D8]/30 transition-all cursor-pointer"
            title="Secure Founder Access Portal"
          >
            <Shield className="w-3.5 h-3.5 text-[#A9B1C7]/50 group-hover:text-[#7767D8] transition-colors" />
            <span className="text-[11px] tracking-wider uppercase">Founder Access</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
