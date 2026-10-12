import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/initialData';
import { PortfolioData } from './types/portfolio';
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { AboutSection } from './components/public/AboutSection';
import { AcademicsAndSkillsSection } from './components/public/AcademicsAndSkillsSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { FounderAuthModal } from './components/founder/FounderAuthModal';
import { FounderDashboard } from './components/founder/FounderDashboard';

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [activeSectionId, setActiveSectionId] = useState('home');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Founder Access State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check saved session & load public data on mount
  useEffect(() => {
    // Check system prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }

    // Load latest published portfolio data from server
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((resp) => {
        if (resp.data) {
          setData(resp.data);
        }
      })
      .catch((err) => {
        console.warn('Operating in offline mode or initial boot, using local verified data:', err);
      });

    // Check existing founder token in localStorage
    const savedToken = localStorage.getItem('founder_token');
    if (savedToken) {
      setAuthToken(savedToken);
      fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem('founder_token');
            setAuthToken(null);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Track active section on scroll for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'academics', 'projects', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Navigation handler
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Contact Form Submission Handler
  const handleSendMessage = async (
    senderName: string,
    senderEmail: string,
    subject: string,
    message: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, senderEmail, subject, message }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Founder Access Click
  const handleOpenFounder = () => {
    const token = localStorage.getItem('founder_token');
    if (token) {
      setIsDashboardOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (token: string) => {
    setAuthToken(token);
    setIsAuthModalOpen(false);
    setIsDashboardOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('founder_token');
    setAuthToken(null);
    setIsDashboardOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#080B18] text-[#F4F5FA] selection:bg-[#7767D8]/30 selection:text-[#B8D8FF]">
      {/* ====================================================
          PUBLIC INTERFACE LAYER
          (Clean Architectural Systems & Telemetry Console)
         ==================================================== */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar
          profile={data.profile}
          activeSection={activeSectionId}
          onNavigate={scrollToSection}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
          onOpenFounderAuth={handleOpenFounder}
        />

        {/* Section 01: Home Hero (Clean Architectural Telemetry Console) */}
        <HeroSection
          profile={data.profile}
          settings={data.settings}
          onExploreProjects={() => scrollToSection('projects')}
          onContactMe={() => scrollToSection('contact')}
          onDiscoverJourney={() => scrollToSection('about')}
        />

        {/* Section 02: About (Character-free; Medium-sized professionally framed portrait) */}
        {data.settings.sectionsVisibility.about && (
          <AboutSection profile={data.profile} />
        )}

        {/* Section 03: Academics & Technical Skills (Character-free) */}
        {(data.settings.sectionsVisibility.education || data.settings.sectionsVisibility.skills) && (
          <AcademicsAndSkillsSection
            education={data.education}
            skills={data.skills}
          />
        )}

        {/* Section 04: Project Showcase (Character-free) */}
        {data.settings.sectionsVisibility.projects && (
          <ProjectsSection projects={data.projects} />
        )}

        {/* Section 05: Contact & Inquiries (Character-free) */}
        {data.settings.sectionsVisibility.contact && (
          <ContactSection
            profile={data.profile}
            socialLinks={data.socialLinks}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* Footer with Discreet Founder Access Link (Character-free) */}
        <Footer
          settings={data.settings}
          onOpenFounderAccess={handleOpenFounder}
          onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </div>

      {/* ====================================================
          FOUNDER DASHBOARD MODALS & MANAGEMENT STATION
         ==================================================== */}
      <FounderAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {isDashboardOpen && (
        <FounderDashboard
          initialData={data}
          onClose={() => setIsDashboardOpen(false)}
          onLogout={handleLogout}
          onDataPublished={(publishedData) => {
            setData(publishedData);
          }}
        />
      )}
    </div>
  );
}
