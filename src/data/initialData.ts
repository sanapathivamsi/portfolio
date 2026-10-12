import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Sanapathi Vamsi Mohan",
    title: "Computer Science Engineering · Aspiring Software Developer",
    headline: "Engineering Reliable Software & Scalable Computational Systems",
    bio: "Computer Science Engineering student and aspiring software developer with a disciplined foundation in core programming, algorithms, and software design. Passionate about problem-solving, building reliable real-world systems, and continuously exploring modern technologies. Eager to contribute to software development work and collaborative engineering teams.",
    email: "sanapathivamsi47@gmail.com",
    location: "Chukkavalasa, Andhra Pradesh, India",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    resumeUrl: "/Sanapathi_Vamsi_Mohan_Resume.pdf",
    resumeFileName: "Sanapathi_Vamsi_Mohan_Resume.pdf",
    lastUpdated: "October 2026",
  },
  education: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science Engineering",
      institution: "Lendi Institute of Engineering and Technology",
      duration: "2025 – 2028",
      scoreType: "CGPA",
      scoreValue: "8.0",
      location: "Andhra Pradesh, India",
      highlights: [
        "Advanced computing coursework in algorithms, data structures, and DBMS",
        "Active technical development focusing on systems engineering and application architecture"
      ],
      isPublished: true,
    },
    {
      id: "edu-2",
      degree: "Diploma",
      institution: "Avanthi's St Theressa Institute of Engineering and Technology",
      duration: "2022 – 2025",
      scoreType: "Percentage",
      scoreValue: "84%",
      location: "Andhra Pradesh, India",
      highlights: [
        "Graduated with distinction (84%) in technical diploma studies",
        "Comprehensive foundations in object-oriented programming, computer networks, and practical lab work"
      ],
      isPublished: true,
    },
    {
      id: "edu-3",
      degree: "SSC (Secondary School Certificate)",
      institution: "Siddhartha Public School",
      duration: "2022",
      scoreType: "Percentage",
      scoreValue: "69%",
      location: "Cheepurupalli, Andhra Pradesh, India",
      highlights: [
        "Completed secondary education with focused interest in mathematics and computer applications"
      ],
      isPublished: true,
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Java",
      category: "Programming Languages",
      note: "Object-oriented software development and backend logic",
      isPublished: true,
    },
    {
      id: "sk-2",
      name: "Python",
      category: "Programming Languages",
      note: "Scripting, algorithm implementations, and intelligent computing",
      isPublished: true,
    },
    {
      id: "sk-3",
      name: "SQL",
      category: "Database",
      note: "Relational database querying, schema structuring, and data integrity",
      isPublished: true,
    },
    {
      id: "sk-4",
      name: "Object-Oriented Programming (OOP)",
      category: "Core Concepts",
      note: "Inheritance, encapsulation, polymorphism, abstraction, and clean architectural design",
      isPublished: true,
    },
    {
      id: "sk-5",
      name: "Database Management Systems (DBMS)",
      category: "Core Concepts",
      note: "Relational modeling, normalization, transaction management, and indexing",
      isPublished: true,
    },
    {
      id: "sk-6",
      name: "Data Structures",
      category: "Core Concepts",
      note: "Arrays, linked lists, trees, graphs, sorting, and algorithmic optimization",
      isPublished: true,
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Vortex-Monitoring-System",
      slug: "vortex-monitoring-system",
      tagline: "Frontend telemetry and visual monitoring dashboard",
      description: "A frontend development project focused on a monitoring system interface. Designed to deliver intuitive telemetry visualizers, live system status tracking, and structured metric overviews with responsive, high-performance UI components.",
      category: "Frontend Development",
      technologies: ["Frontend Architecture", "UI Engineering", "Telemetry Interface", "Modern Web Standards"],
      highlights: [
        "Architected an intuitive telemetry dashboard interface for real-time equipment and operational monitoring",
        "Focused on high-clarity data presentation, visual hierarchy, and instant cognitive readability for operators",
        "Crafted responsive interface components ensuring seamless cross-device diagnostic workflows"
      ],
      liveUrl: "https://github.com/vamsimohan47/Vortex-Monitoring-System",
      githubUrl: "https://github.com/vamsimohan47/Vortex-Monitoring-System",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      status: "Published",
      featured: true,
      order: 1,
    },
    {
      id: "proj-2",
      title: "Voice-Based Attendance System Using an IoT Device",
      slug: "voice-based-attendance-system-iot",
      tagline: "Automated student attendance verification through voice recognition and connected IoT hardware",
      description: "Uses voice recognition to identify students and record attendance through an IoT-based device. Eliminates manual roll calls, mitigates proxy attendance, and logs data directly into a centralized database system.",
      category: "IoT & Voice Computing",
      technologies: ["Voice Recognition", "IoT Hardware", "Python", "SQL Database", "Embedded Systems"],
      highlights: [
        "Integrated acoustic voice feature extraction to identify unique student vocal signatures",
        "Connected edge IoT module with centralized relational database for instant timestamped attendance logging",
        "Streamlined classroom operational efficiency with touchless, tamper-resistant biometric verification"
      ],
      liveUrl: "",
      githubUrl: "https://github.com/vamsimohan47",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      status: "Published",
      featured: true,
      order: 2,
    },
  ],
  socialLinks: {
    github: "https://github.com/vamsimohan47",
    linkedin: "https://linkedin.com/in/sanapathi-vamsi-mohan",
    email: "sanapathivamsi47@gmail.com",
    twitter: "https://twitter.com",
  },
  settings: {
    heroKicker: "SPACE EXPLORATION OF CODE & ARCHITECTURE",
    heroRole1: "COMPUTER SCIENCE ENGINEERING",
    heroRole2: "ASPIRING SOFTWARE DEVELOPER",
    heroIntro: "Traversing algorithms, relational databases, and systems engineering through a cinematic space-inspired landscape.",
    sectionsVisibility: {
      about: true,
      education: true,
      skills: true,
      projects: true,
      contact: true,
    },
    footerNote: "Designed & Engineered for Sanapathi Vamsi Mohan · Andhra Pradesh, India",
    cinematicModeDefault: true,
  },
  messages: [
    {
      id: "msg-welcome",
      senderName: "System Welcome",
      senderEmail: "system@portfolio.internal",
      subject: "Welcome to your Founder Dashboard",
      message: "Hello Vamsi Mohan! Your portfolio is initialized with your verified résumé information. You can customize projects, skills, education, and credentials at any time.",
      createdAt: "2026-10-12T07:00:00Z",
      read: false,
    }
  ]
};
