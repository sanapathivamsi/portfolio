import React, { useState } from 'react';
import { Mail, MapPin, FileDown, Send, CheckCircle2, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ProfileData, SocialLinks } from '../../types/portfolio';

interface ContactSectionProps {
  profile: ProfileData;
  socialLinks: SocialLinks;
  onSendMessage: (senderName: string, senderEmail: string, subject: string, message: string) => Promise<boolean>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  socialLinks,
  onSendMessage,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const ok = await onSendMessage(senderName, senderEmail, subject || 'Portfolio Inquiry', message);
      if (ok) {
        setSubmitted(true);
        setSenderName('');
        setSenderEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMsg('Unable to dispatch message. Please use direct email link.');
      }
    } catch {
      setErrorMsg('Unable to dispatch message. Please use direct email link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Section Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[#7767D8] tracking-widest uppercase">
              CONTACT // GET IN TOUCH
            </span>
            <span className="h-px w-12 bg-[#7767D8]/40" />
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F4F5FA] tracking-tight">
            Initiate Contact
          </h2>
          <p className="text-sm text-[#A9B1C7] mt-2 max-w-xl">
            Open to engineering conversations, technical collaborations, and software developer opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Verified Credentials & Résumé Download */}
          <div className="lg:col-span-5 space-y-6">
            <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-[#B8D8FF]/20 space-y-6">
              <h3 className="font-heading text-xl font-semibold text-[#F4F5FA]">
                Direct Coordinates
              </h3>

              <div className="space-y-4">
                {/* Working Email Mailto Link */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#101C3C] text-[#B8D8FF] border border-white/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#A9B1C7] uppercase">Electronic Mail</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm sm:text-base font-semibold text-[#F4F5FA] hover:text-[#B8D8FF] transition-colors underline underline-offset-4 decoration-[#7767D8]"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                {/* Verified Location */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-[#101C3C] text-[#7767D8] border border-white/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#A9B1C7] uppercase">Location Coordinates</div>
                    <div className="text-sm sm:text-base font-medium text-[#F4F5FA]">
                      {profile.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Download Résumé Link */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={profile.resumeUrl}
                  download={profile.resumeFileName}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#7767D8] text-[#F4F5FA] hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(119,103,216,0.3)]"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download Résumé (PDF)</span>
                </a>
                <p className="text-[11px] font-mono text-center text-[#A9B1C7] mt-2">
                  Official authentic document · File: {profile.resumeFileName}
                </p>
              </div>

              {/* Verified Social Profiles */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs font-mono text-[#A9B1C7] uppercase mb-3">
                  Connected Platforms
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#101C3C] border border-white/10 text-[#B8D8FF] hover:border-[#7767D8] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#101C3C] border border-white/10 text-[#B8D8FF] hover:border-[#7767D8] hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatcher Form */}
          <div className="lg:col-span-7">
            <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10">
              <h3 className="font-heading text-xl font-semibold text-[#F4F5FA] mb-2">
                Direct Dispatch Channel
              </h3>
              <p className="text-xs text-[#A9B1C7] mb-6">
                Deliver a direct message securely into Sanapathi Vamsi Mohan's inbox.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#101C3C]/80 border border-[#B8D8FF]/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#B8D8FF] mx-auto animate-pulse" />
                  <h4 className="font-heading text-lg font-bold text-[#F4F5FA]">Message Successfully Transmitted</h4>
                  <p className="text-xs text-[#A9B1C7]">
                    Thank you. Your message has been logged in the portal. I will respond to your provided email address shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-mono text-[#7767D8] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Elena Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="elena@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Opportunity / Collaboration Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Message Content *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your project, question, or engineering opportunity..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Transmit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
