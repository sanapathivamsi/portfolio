export interface ProfileData {
  name: string;
  title: string;
  headline: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  resumeFileName: string;
  lastUpdated: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  scoreType: 'CGPA' | 'Percentage';
  scoreValue: string;
  location?: string;
  highlights?: string[];
  isPublished: boolean;
}

export type SkillCategory = 'Programming Languages' | 'Database' | 'Core Concepts';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  note?: string;
  isPublished: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  status: 'Published' | 'Draft' | 'In Development';
  featured: boolean;
  order: number;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email: string;
  twitter?: string;
}

export interface WebsiteSettings {
  heroKicker: string;
  heroRole1: string;
  heroRole2: string;
  heroIntro: string;
  sectionsVisibility: {
    about: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    contact: boolean;
  };
  footerNote: string;
  cinematicModeDefault: boolean;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PortfolioData {
  profile: ProfileData;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  socialLinks: SocialLinks;
  settings: WebsiteSettings;
  messages?: ContactMessage[];
}

export interface UserSession {
  email: string;
  role: 'founder' | 'admin';
  name: string;
  token?: string;
}
