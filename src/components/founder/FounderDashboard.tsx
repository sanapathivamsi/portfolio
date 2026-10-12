import React, { useState, useEffect } from 'react';
import {
  Shield, LogOut, Save, RefreshCw, Eye, CheckCircle2, AlertTriangle, Trash2, Plus,
  FileText, User, GraduationCap, Cpu, Layers, Link as LinkIcon, Settings, Mail,
  Upload, ArrowUp, ArrowDown, ChevronRight, X, ExternalLink, AlertCircle, Clock
} from 'lucide-react';
import { PortfolioData, EducationItem, SkillItem, ProjectItem, ContactMessage, SkillCategory } from '../../types/portfolio';

interface FounderDashboardProps {
  initialData: PortfolioData;
  onClose: () => void;
  onLogout: () => void;
  onDataPublished: (data: PortfolioData) => void;
}

export const FounderDashboard: React.FC<FounderDashboardProps> = ({
  initialData,
  onClose,
  onLogout,
  onDataPublished,
}) => {
  // Working draft data
  const [data, setData] = useState<PortfolioData>(JSON.parse(JSON.stringify(initialData)));
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'education' | 'skills' | 'projects' | 'resume' | 'social' | 'settings' | 'inbox'
  >('overview');

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Destructive Action Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'project' | 'education' | 'skill' | 'message';
    id: string;
    title: string;
  } | null>(null);

  // New Item Modals / Forms
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>(initialData.messages || []);

  // Fetch full server state on mount
  useEffect(() => {
    const token = localStorage.getItem('founder_token');
    if (!token) return;

    fetch('/api/founder/portfolio', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.data) {
          setData(resp.data);
        }
        if (resp.messages) {
          setMessages(resp.messages);
        }
      })
      .catch((err) => {
        console.error('Failed to load server data:', err);
      });
  }, []);

  // Notify user before closing if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const markDirty = () => {
    setHasUnsavedChanges(true);
  };

  // Save changes to draft DB
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setFeedbackMsg(null);
    const token = localStorage.getItem('founder_token');

    try {
      const res = await fetch('/api/founder/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: result.error || 'Failed to persist changes.' });
        return;
      }

      setHasUnsavedChanges(false);
      setFeedbackMsg({ type: 'success', text: 'Draft changes saved successfully to database.' });
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network failure while attempting to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Drafts to Live Portfolio
  const handlePublishLive = async () => {
    setIsPublishing(true);
    setFeedbackMsg(null);
    const token = localStorage.getItem('founder_token');

    try {
      // First save current draft if dirty
      if (hasUnsavedChanges) {
        await fetch('/api/founder/portfolio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
      }

      const res = await fetch('/api/founder/publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!res.ok) {
        setFeedbackMsg({ type: 'error', text: result.error || 'Failed to publish changes.' });
        return;
      }

      setHasUnsavedChanges(false);
      onDataPublished(data);
      setFeedbackMsg({ type: 'success', text: 'Live portfolio updated and published to all visitors!' });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch {
      setFeedbackMsg({ type: 'error', text: 'Network failure while attempting to publish.' });
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard Unsaved Changes
  const handleCancelChanges = () => {
    if (confirm('Discard all unsaved edits and reload current state?')) {
      setData(JSON.parse(JSON.stringify(initialData)));
      setHasUnsavedChanges(false);
      setFeedbackMsg({ type: 'success', text: 'Unsaved edits discarded.' });
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  // Confirm and Execute Deletion
  const executeDelete = () => {
    if (!deleteConfirm) return;
    markDirty();

    if (deleteConfirm.type === 'project') {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== deleteConfirm.id),
      }));
    } else if (deleteConfirm.type === 'education') {
      setData((prev) => ({
        ...prev,
        education: prev.education.filter((e) => e.id !== deleteConfirm.id),
      }));
    } else if (deleteConfirm.type === 'skill') {
      setData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s.id !== deleteConfirm.id),
      }));
    } else if (deleteConfirm.type === 'message') {
      const token = localStorage.getItem('founder_token');
      fetch(`/api/founder/messages/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
    }

    setDeleteConfirm(null);
  };

  // Résumé File Upload Handler
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Only valid PDF documents are accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const token = localStorage.getItem('founder_token');

      try {
        const res = await fetch('/api/founder/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileBase64: base64,
            target: 'resume',
          }),
        });
        const resp = await res.json();
        if (res.ok) {
          setData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              resumeUrl: resp.fileUrl,
              resumeFileName: file.name,
            },
          }));
          markDirty();
          setFeedbackMsg({ type: 'success', text: `Uploaded and registered ${file.name}` });
        } else {
          alert(resp.error || 'Upload failed');
        }
      } catch {
        alert('Failed to transmit upload.');
      }
    };
    reader.readAsDataURL(file);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'resume', label: 'Résumé', icon: FileText },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'inbox', label: 'Inquiries', icon: Mail, badge: messages.filter((m) => !m.read).length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080B18] text-[#F4F5FA] overflow-hidden">
      {/* ====================================================
          TOP APPLICATION BAR
         ==================================================== */}
      <header className="h-16 border-b border-white/10 bg-[#101C3C]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#7767D8]/20 border border-[#7767D8]/50 text-[#B8D8FF]">
            <Shield className="w-5 h-5 text-[#B8D8FF]" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm sm:text-base text-[#F4F5FA] flex items-center gap-2">
              <span>FOUNDER MANAGEMENT SUITE</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#7767D8]/30 text-[#B8D8FF]">
                LIVE PRODUCTION
              </span>
            </h1>
            <div className="text-[11px] font-mono text-[#A9B1C7]">
              {data.profile.email} · Authenticated
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasUnsavedChanges && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Unsaved Edits</span>
            </div>
          )}

          {hasUnsavedChanges && (
            <button
              onClick={handleCancelChanges}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-[#A9B1C7] hover:text-white transition-colors"
            >
              Discard
            </button>
          )}

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#101C3C] border border-[#B8D8FF]/30 hover:border-[#7767D8] text-[#B8D8FF] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handlePublishLive}
            disabled={isPublishing}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(119,103,216,0.3)] disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-[#A9B1C7] hover:text-white flex items-center gap-1.5"
            title="Preview Public Website"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-950/40 transition-colors"
            title="End Session & Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`px-4 py-2.5 text-xs font-mono flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/80 border-b border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ====================================================
          MAIN DASHBOARD BODY: SIDEBAR + CONTENT AREA
         ==================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-56 sm:w-64 border-r border-white/10 bg-[#0c1224]/70 p-4 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[10px] font-mono text-[#A9B1C7]/70 uppercase px-3 py-2 tracking-wider">
            Station Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#7767D8]/20 text-[#B8D8FF] border border-[#7767D8]/40 font-semibold'
                    : 'text-[#A9B1C7] hover:text-[#F4F5FA] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B8D8FF]' : 'text-[#A9B1C7]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#7767D8] text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-5xl">
          {/* ==========================================
              TAB 1: OVERVIEW
             ========================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Executive Control Hub</h2>
                <p className="text-xs font-mono text-[#A9B1C7] mt-1">
                  System telemetry, publication status, and quick operations.
                </p>
              </div>

              {/* Status Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="cosmic-surface p-5 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#A9B1C7]">Published Projects</div>
                  <div className="text-2xl font-heading font-bold text-[#B8D8FF]">
                    {data.projects.filter((p) => p.status === 'Published').length}
                  </div>
                  <div className="text-[11px] text-[#A9B1C7] font-mono">
                    Total: {data.projects.length}
                  </div>
                </div>

                <div className="cosmic-surface p-5 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#A9B1C7]">Education Entries</div>
                  <div className="text-2xl font-heading font-bold text-[#7767D8]">
                    {data.education.length}
                  </div>
                  <div className="text-[11px] text-[#A9B1C7] font-mono">B.Tech · Diploma · SSC</div>
                </div>

                <div className="cosmic-surface p-5 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#A9B1C7]">Technical Skills</div>
                  <div className="text-2xl font-heading font-bold text-[#F4F5FA]">
                    {data.skills.length}
                  </div>
                  <div className="text-[11px] text-[#A9B1C7] font-mono">Across 3 categories</div>
                </div>

                <div className="cosmic-surface p-5 rounded-2xl border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#A9B1C7]">Inquiries Logged</div>
                  <div className="text-2xl font-heading font-bold text-[#B8D8FF]">
                    {messages.length}
                  </div>
                  <div className="text-[11px] text-[#A9B1C7] font-mono">
                    Unread: {messages.filter((m) => !m.read).length}
                  </div>
                </div>
              </div>

              {/* Quick Action Matrix */}
              <div className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-heading text-base font-semibold text-[#F4F5FA]">Quick Management Tasks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="p-4 rounded-xl bg-[#080B18]/60 border border-white/5 hover:border-[#7767D8] text-left transition-all"
                  >
                    <Layers className="w-5 h-5 text-[#B8D8FF] mb-2" />
                    <div className="text-xs font-mono font-semibold text-[#F4F5FA]">Manage Projects</div>
                    <div className="text-[11px] text-[#A9B1C7]">Add, reorder, or edit system cards</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('resume')}
                    className="p-4 rounded-xl bg-[#080B18]/60 border border-white/5 hover:border-[#7767D8] text-left transition-all"
                  >
                    <FileText className="w-5 h-5 text-[#7767D8] mb-2" />
                    <div className="text-xs font-mono font-semibold text-[#F4F5FA]">Update Résumé</div>
                    <div className="text-[11px] text-[#A9B1C7]">Upload replacement official PDF</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('inbox')}
                    className="p-4 rounded-xl bg-[#080B18]/60 border border-white/5 hover:border-[#7767D8] text-left transition-all"
                  >
                    <Mail className="w-5 h-5 text-[#B8D8FF] mb-2" />
                    <div className="text-xs font-mono font-semibold text-[#F4F5FA]">Review Inquiries</div>
                    <div className="text-[11px] text-[#A9B1C7]">Inspect incoming visitor inquiries</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: PROFILE
             ========================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Profile Information</h2>
                <p className="text-xs font-mono text-[#A9B1C7]">
                  Edit core identity, title, biography, and credentials.
                </p>
              </div>

              <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Full Legal / Professional Name
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, name: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, title: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, email: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, location: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={data.profile.avatarUrl}
                    onChange={(e) => {
                      setData({ ...data, profile: { ...data.profile, avatarUrl: e.target.value } });
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                    Official Biography (grounded in résumé)
                  </label>
                  <textarea
                    rows={4}
                    value={data.profile.bio}
                    onChange={(e) => {
                      setData({ ...data, profile: { ...data.profile, bio: e.target.value } });
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: EDUCATION
             ========================================== */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Education Records</h2>
                  <p className="text-xs font-mono text-[#A9B1C7]">
                    Manage verified degrees, scores, and institutional credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newEdu: EducationItem = {
                      id: `edu-${Date.now()}`,
                      degree: 'New Credential',
                      institution: 'Academic Institution',
                      duration: '2026',
                      scoreType: 'CGPA',
                      scoreValue: '8.0',
                      location: 'Andhra Pradesh, India',
                      highlights: [],
                      isPublished: true,
                    };
                    setData((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
                    markDirty();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#7767D8] text-white text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Credential</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.education.map((edu, idx) => (
                  <div key={edu.id} className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#7767D8]" />
                        <span className="font-heading font-semibold text-sm text-[#F4F5FA]">
                          {edu.degree || 'Untitled Degree'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              education: prev.education.map((e) =>
                                e.id === edu.id ? { ...e, isPublished: !e.isPublished } : e
                              ),
                            }));
                            markDirty();
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            edu.isPublished ? 'bg-emerald-950/60 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {edu.isPublished ? 'Published' : 'Hidden'}
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'education',
                              id: edu.id,
                              title: edu.degree,
                            })
                          }
                          className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A9B1C7] mb-1">Degree Title</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, degree: e.target.value } : item
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A9B1C7] mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, institution: e.target.value } : item
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A9B1C7] mb-1">Duration</label>
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, duration: e.target.value } : item
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A9B1C7] mb-1">
                          Score (e.g. 8.0 CGPA or 84%)
                        </label>
                        <input
                          type="text"
                          value={edu.scoreValue}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, scoreValue: e.target.value } : item
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: SKILLS
             ========================================== */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Skills Manager</h2>
                  <p className="text-xs font-mono text-[#A9B1C7]">
                    Manage programming languages, databases, and core concepts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newSkill: SkillItem = {
                      id: `sk-${Date.now()}`,
                      name: 'New Skill',
                      category: 'Programming Languages',
                      note: 'Skill proficiency details',
                      isPublished: true,
                    };
                    setData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
                    markDirty();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#7767D8] text-white text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="cosmic-surface p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          setData((prev) => ({
                            ...prev,
                            skills: prev.skills.map((s) =>
                              s.id === skill.id ? { ...s, category: e.target.value as SkillCategory } : s
                            ),
                          }));
                          markDirty();
                        }}
                        className="px-2 py-1 rounded bg-[#080B18] border border-white/10 text-[11px] font-mono text-[#B8D8FF]"
                      >
                        <option value="Programming Languages">Programming Languages</option>
                        <option value="Database">Database</option>
                        <option value="Core Concepts">Core Concepts</option>
                      </select>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'skill',
                            id: skill.id,
                            title: skill.name,
                          })
                        }
                        className="p-1 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          skills: prev.skills.map((s) =>
                            s.id === skill.id ? { ...s, name: e.target.value } : s
                          ),
                        }));
                        markDirty();
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080B18]/70 border border-white/10 text-xs font-semibold text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />

                    <input
                      type="text"
                      value={skill.note || ''}
                      placeholder="Note/Context"
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          skills: prev.skills.map((s) =>
                            s.id === skill.id ? { ...s, note: e.target.value } : s
                          ),
                        }));
                        markDirty();
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#080B18]/70 border border-white/10 text-[11px] text-[#A9B1C7] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 5: PROJECTS
             ========================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Projects Manager</h2>
                  <p className="text-xs font-mono text-[#A9B1C7]">
                    Manage showcase systems, links, image URLs, and publication status.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProj: ProjectItem = {
                      id: `proj-${Date.now()}`,
                      title: 'New Engineering Project',
                      slug: `project-${Date.now()}`,
                      tagline: 'Technical summary and purpose',
                      description: 'Comprehensive architectural and functional overview.',
                      category: 'Systems Software',
                      technologies: ['TypeScript', 'Node.js'],
                      highlights: ['Feature milestone 1'],
                      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
                      status: 'Draft',
                      featured: false,
                      order: data.projects.length + 1,
                    };
                    setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
                    markDirty();
                  }}
                  className="px-3 py-2 rounded-xl bg-[#7767D8] text-white text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.projects.map((proj, index) => (
                  <div key={proj.id} className="cosmic-surface p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono text-[#7767D8]">PROJECT 0{index + 1}</span>
                        <h3 className="font-heading font-bold text-lg text-[#F4F5FA]">{proj.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Toggle */}
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id
                                  ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
                                  : p
                              ),
                            }));
                            markDirty();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                            proj.status === 'Published'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}
                        >
                          {proj.status}
                        </button>

                        {/* Reorder Up/Down */}
                        <button
                          disabled={index === 0}
                          onClick={() => {
                            const newProjects = [...data.projects];
                            const temp = newProjects[index];
                            newProjects[index] = newProjects[index - 1];
                            newProjects[index - 1] = temp;
                            setData({ ...data, projects: newProjects });
                            markDirty();
                          }}
                          className="p-1.5 rounded-lg border border-white/10 text-[#A9B1C7] hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={index === data.projects.length - 1}
                          onClick={() => {
                            const newProjects = [...data.projects];
                            const temp = newProjects[index];
                            newProjects[index] = newProjects[index + 1];
                            newProjects[index + 1] = temp;
                            setData({ ...data, projects: newProjects });
                            markDirty();
                          }}
                          className="p-1.5 rounded-lg border border-white/10 text-[#A9B1C7] hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete with confirmation */}
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              type: 'project',
                              id: proj.id,
                              title: proj.title,
                            })
                          }
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 border border-red-500/20"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#A9B1C7] mb-1">Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, title: e.target.value } : p
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[#A9B1C7] mb-1">Tagline</label>
                        <input
                          type="text"
                          value={proj.tagline}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, tagline: e.target.value } : p
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          setData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, description: e.target.value } : p
                            ),
                          }));
                          markDirty();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[#A9B1C7] mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, githubUrl: e.target.value } : p
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[#A9B1C7] mb-1">Project Image URL</label>
                        <input
                          type="url"
                          value={proj.imageUrl}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              projects: prev.projects.map((p) =>
                                p.id === proj.id ? { ...p, imageUrl: e.target.value } : p
                              ),
                            }));
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] mb-1">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                          setData((prev) => ({
                            ...prev,
                            projects: prev.projects.map((p) =>
                              p.id === proj.id ? { ...p, technologies: list } : p
                            ),
                          }));
                          markDirty();
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#080B18]/70 border border-white/10 text-xs text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 6: RÉSUMÉ
             ========================================== */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Résumé Asset Management</h2>
                <p className="text-xs font-mono text-[#A9B1C7]">
                  Upload an updated official PDF résumé and configure download endpoints.
                </p>
              </div>

              <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#101C3C]/80 border border-[#B8D8FF]/20">
                  <FileText className="w-8 h-8 text-[#B8D8FF]" />
                  <div className="flex-1">
                    <div className="text-xs font-mono text-[#A9B1C7] uppercase">Current Active Document</div>
                    <div className="font-heading font-semibold text-sm text-[#F4F5FA]">
                      {data.profile.resumeFileName}
                    </div>
                    <div className="text-[11px] font-mono text-[#7767D8]">{data.profile.resumeUrl}</div>
                  </div>

                  <a
                    href={data.profile.resumeUrl}
                    download={data.profile.resumeFileName}
                    className="px-3 py-2 rounded-lg bg-[#7767D8] text-white text-xs font-mono flex items-center gap-1.5"
                  >
                    <span>Test Download</span>
                  </a>
                </div>

                {/* Upload Section with File Size & Type Validation */}
                <div className="p-6 rounded-xl border-2 border-dashed border-white/15 hover:border-[#7767D8] transition-colors text-center space-y-3">
                  <Upload className="w-8 h-8 text-[#A9B1C7] mx-auto" />
                  <div>
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#101C3C] border border-[#B8D8FF]/30 text-xs font-mono text-[#B8D8FF] hover:border-[#7767D8] transition-colors inline-block">
                      <span>Choose Replacement PDF</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] font-mono text-[#A9B1C7]">
                    Strict validation: PDF only · Maximum file size 5MB · Auto-persisted to asset directory
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 7: SOCIAL LINKS
             ========================================== */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Social Coordinates</h2>
                <p className="text-xs font-mono text-[#A9B1C7]">
                  Configure external engineering hubs. Social links are only displayed on the public site when valid URLs are present.
                </p>
              </div>

              <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={data.socialLinks.github || ''}
                    onChange={(e) => {
                      setData({ ...data, socialLinks: { ...data.socialLinks, github: e.target.value } });
                      markDirty();
                    }}
                    placeholder="https://github.com/vamsimohan47"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={data.socialLinks.linkedin || ''}
                    onChange={(e) => {
                      setData({ ...data, socialLinks: { ...data.socialLinks, linkedin: e.target.value } });
                      markDirty();
                    }}
                    placeholder="https://linkedin.com/in/sanapathi-vamsi-mohan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">Twitter / X Profile URL</label>
                  <input
                    type="url"
                    value={data.socialLinks.twitter || ''}
                    onChange={(e) => {
                      setData({ ...data, socialLinks: { ...data.socialLinks, twitter: e.target.value } });
                      markDirty();
                    }}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 8: WEBSITE SETTINGS
             ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Website Settings</h2>
                <p className="text-xs font-mono text-[#A9B1C7]">
                  Configure hero headlines, section visibility toggles, and footer copy.
                </p>
              </div>

              <div className="cosmic-surface p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">Hero Kicker</label>
                    <input
                      type="text"
                      value={data.settings.heroKicker}
                      onChange={(e) => {
                        setData({ ...data, settings: { ...data.settings, heroKicker: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">Primary Role 1</label>
                      <input
                        type="text"
                        value={data.settings.heroRole1}
                        onChange={(e) => {
                          setData({ ...data, settings: { ...data.settings, heroRole1: e.target.value } });
                          markDirty();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">Secondary Role 2</label>
                      <input
                        type="text"
                        value={data.settings.heroRole2}
                        onChange={(e) => {
                          setData({ ...data, settings: { ...data.settings, heroRole2: e.target.value } });
                          markDirty();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">Footer Attribution</label>
                    <input
                      type="text"
                      value={data.settings.footerNote}
                      onChange={(e) => {
                        setData({ ...data, settings: { ...data.settings, footerNote: e.target.value } });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] focus:outline-none focus:border-[#7767D8]"
                    />
                  </div>
                </div>

                {/* Section Visibility Controls */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs font-mono text-[#F4F5FA] uppercase mb-3">
                    Portfolio Section Visibility Toggles
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(data.settings.sectionsVisibility).map(([sec, isVis]) => (
                      <label
                        key={sec}
                        className="flex items-center gap-2.5 p-3 rounded-xl cosmic-surface border border-white/5 cursor-pointer hover:border-white/20"
                      >
                        <input
                          type="checkbox"
                          checked={isVis}
                          onChange={(e) => {
                            setData({
                              ...data,
                              settings: {
                                ...data.settings,
                                sectionsVisibility: {
                                  ...data.settings.sectionsVisibility,
                                  [sec]: e.target.checked,
                                },
                              },
                            });
                            markDirty();
                          }}
                          className="w-4 h-4 rounded text-[#7767D8] focus:ring-0"
                        />
                        <span className="text-xs font-mono capitalize">{sec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 9: INBOX
             ========================================== */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#F4F5FA]">Visitor Inquiry Inbox</h2>
                <p className="text-xs font-mono text-[#A9B1C7]">
                  Messages transmitted by visitors via the public contact terminal.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="cosmic-surface p-8 rounded-2xl border border-white/10 text-center text-[#A9B1C7] text-xs font-mono">
                  No inquiries recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`cosmic-surface p-6 rounded-2xl border transition-all ${
                        msg.read ? 'border-white/5 opacity-80' : 'border-[#7767D8]/60 bg-[#101C3C]/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-sm text-[#F4F5FA]">{msg.senderName}</h4>
                            <span className="text-xs font-mono text-[#B8D8FF]">&lt;{msg.senderEmail}&gt;</span>
                            {!msg.read && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#7767D8] text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-[#A9B1C7] mt-0.5">{msg.subject}</div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-[#A9B1C7]/60 text-[11px]">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>

                          {!msg.read && (
                            <button
                              onClick={() => {
                                const token = localStorage.getItem('founder_token');
                                fetch(`/api/founder/messages/${msg.id}/read`, {
                                  method: 'POST',
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                setMessages((prev) =>
                                  prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
                                );
                              }}
                              className="px-2 py-1 rounded bg-[#101C3C] text-[#B8D8FF] hover:bg-[#7767D8] hover:text-white transition-colors"
                            >
                              Mark Read
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'message',
                                id: msg.id,
                                title: `Message from ${msg.senderName}`,
                              })
                            }
                            className="p-1 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#F4F5FA]/90 mt-3 whitespace-pre-wrap leading-relaxed font-light">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ====================================================
          DESTRUCTIVE ACTION CONFIRMATION MODAL
         ==================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md cosmic-surface border border-red-500/50 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-bold text-lg text-white">Confirm Removal</h3>
            </div>
            <p className="text-xs text-[#A9B1C7] leading-relaxed">
              Are you certain you wish to remove <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone once changes are saved.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-[#A9B1C7] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-mono hover:bg-red-700 transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
