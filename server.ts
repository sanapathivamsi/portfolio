import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'space_founder_vamsi_mohan_jwt_secure_secret_2026';
const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'portfolio-db.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial DB schema
interface DatabaseSchema {
  founder: {
    email: string;
    passwordHash: string | null;
    isConfigured: boolean;
    mustChangePassword: boolean;
    resetToken: string | null;
    resetExpires: number | null;
  };
  portfolio: any;
  publishedPortfolio: any;
  messages: Array<{
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    createdAt: string;
    read: boolean;
  }>;
}

// Initial password hash for Vamsi@2009 (bcrypt 10 rounds)
const INITIAL_FOUNDER_PASSWORD_HASH = '$2b$10$QmqDDd28cnoY6b3FgzJUduB9dS0z0R7u16c9YvCbTmH/lJtXmv/y2';

// Default initial data matching resume
function getDefaultData(): DatabaseSchema {
  const initialData = {
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
      twitter: "",
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
  };

  return {
    founder: {
      email: "sanapathivamsi47@gmail.com",
      passwordHash: INITIAL_FOUNDER_PASSWORD_HASH,
      isConfigured: true,
      mustChangePassword: true,
      resetToken: null,
      resetExpires: null,
    },
    portfolio: JSON.parse(JSON.stringify(initialData)),
    publishedPortfolio: JSON.parse(JSON.stringify(initialData)),
    messages: [
      {
        id: "msg-init",
        senderName: "System",
        senderEmail: "system@internal.space",
        subject: "Portfolio Initialized",
        message: "Portfolio initialized with official résumé data. Founder Access link is available at the bottom of the footer.",
        createdAt: new Date().toISOString(),
        read: false,
      }
    ],
  };
}

// Load DB
function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure initial founder credentials with mandatory change-password are set
      if (!parsed.founder) {
        parsed.founder = getDefaultData().founder;
      }
      if (!parsed.founder.passwordHash) {
        parsed.founder.passwordHash = INITIAL_FOUNDER_PASSWORD_HASH;
        parsed.founder.isConfigured = true;
        parsed.founder.mustChangePassword = true;
      }
      if (parsed.founder.mustChangePassword === undefined) {
        parsed.founder.mustChangePassword = true;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading database file, resetting to default:', err);
  }
  const defaultDb = getDefaultData();
  saveDatabase(defaultDb);
  return defaultDb;
}

// Atomic Save DB
function saveDatabase(db: DatabaseSchema) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Static files in public
  app.use(express.static(path.resolve(__dirname, 'public')));

  // ==========================================
  // AUTH MIDDLEWARE
  // ==========================================
  function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies['founder_token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Authentication token required.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
      if (decoded.email !== db.founder.email || decoded.role !== 'founder') {
        return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
      }
      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired session.' });
    }
  }

  // ==========================================
  // API ROUTES
  // ==========================================

  // Auth Status check
  app.get('/api/auth/status', (req, res) => {
    res.json({
      isConfigured: db.founder.isConfigured,
      founderEmail: db.founder.email,
    });
  });

  // Founder First-Time Secure Credential Setup
  app.post('/api/auth/setup-credentials', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (email?.toLowerCase().trim() !== db.founder.email.toLowerCase()) {
      return res.status(400).json({ error: 'Setup only permitted for verified founder email.' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    db.founder.passwordHash = hash;
    db.founder.isConfigured = true;
    saveDatabase(db);

    const token = jwt.sign({ email: db.founder.email, role: 'founder' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('founder_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({
      success: true,
      message: 'Founder credentials configured successfully.',
      token,
      user: { email: db.founder.email, role: 'founder' },
    });
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    if (email.toLowerCase().trim() !== db.founder.email.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!db.founder.isConfigured || !db.founder.passwordHash) {
      return res.status(400).json({
        error: 'Founder credentials have not been configured yet. Please complete initial setup.',
        requiresSetup: true,
      });
    }

    const isMatch = await bcrypt.compare(password, db.founder.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email: db.founder.email, role: 'founder' }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('founder_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({
      success: true,
      token,
      mustChangePassword: !!db.founder.mustChangePassword,
      user: { email: db.founder.email, role: 'founder' },
    });
  });

  // Forced / Authenticated Password Change
  app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters in length.' });
    }

    if (newPassword === 'Vamsi@2009') {
      return res.status(400).json({ error: 'You must select a new password different from the initial default password.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    db.founder.passwordHash = newHash;
    db.founder.mustChangePassword = false;
    db.founder.isConfigured = true;
    saveDatabase(db);

    res.json({
      success: true,
      message: 'Password successfully updated. Your account is secured.',
    });
  });

  // Password Reset Request
  app.post('/api/auth/request-reset', (req, res) => {
    const { email } = req.body;
    if (email?.toLowerCase().trim() !== db.founder.email.toLowerCase()) {
      return res.json({
        success: true,
        message: 'If the provided email belongs to the authorized founder, a reset token has been registered.',
      });
    }

    const resetToken = Math.random().toString(36).substring(2, 8).toUpperCase();
    db.founder.resetToken = resetToken;
    db.founder.resetExpires = Date.now() + 3600 * 1000; // 1 hour
    saveDatabase(db);

    res.json({
      success: true,
      message: 'Password reset code generated and registered for founder email.',
      verificationCode: resetToken, // Provided in response for simulated email verification environment
    });
  });

  // Complete Password Reset
  app.post('/api/auth/reset-password', async (req, res) => {
    const { resetCode, newPassword, confirmPassword } = req.body;

    if (!resetCode || resetCode.toUpperCase().trim() !== db.founder.resetToken) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    if (!db.founder.resetExpires || Date.now() > db.founder.resetExpires) {
      return res.status(400).json({ error: 'Verification code has expired. Request a new one.' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    db.founder.passwordHash = await bcrypt.hash(newPassword, salt);
    db.founder.resetToken = null;
    db.founder.resetExpires = null;
    db.founder.isConfigured = true;
    db.founder.mustChangePassword = false;
    saveDatabase(db);

    res.json({ success: true, message: 'Password reset successfully. You may now sign in.' });
  });

  // Verify Current Session
  app.get('/api/auth/session', authenticateToken, (req, res) => {
    res.json({
      authenticated: true,
      mustChangePassword: !!db.founder.mustChangePassword,
      user: { email: db.founder.email, role: 'founder' },
    });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('founder_token');
    res.json({ success: true });
  });

  // Public: Get Published Portfolio Data
  app.get('/api/portfolio', (req, res) => {
    // Only return published portfolio
    res.json({
      data: db.publishedPortfolio || db.portfolio,
    });
  });

  // Protected: Get Founder Portfolio (drafts + published + settings)
  app.get('/api/founder/portfolio', authenticateToken, (req, res) => {
    res.json({
      data: db.portfolio,
      messages: db.messages || [],
      published: db.publishedPortfolio,
    });
  });

  // Protected: Save Portfolio Drafts
  app.put('/api/founder/portfolio', authenticateToken, (req, res) => {
    const updatedData = req.body;
    if (!updatedData || !updatedData.profile) {
      return res.status(400).json({ error: 'Invalid portfolio schema provided.' });
    }

    db.portfolio = updatedData;
    db.portfolio.profile.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    saveDatabase(db);

    res.json({
      success: true,
      message: 'Changes saved successfully to draft database.',
      data: db.portfolio,
    });
  });

  // Protected: Publish Drafts to Live Portfolio
  app.post('/api/founder/publish', authenticateToken, (req, res) => {
    db.publishedPortfolio = JSON.parse(JSON.stringify(db.portfolio));
    saveDatabase(db);

    res.json({
      success: true,
      message: 'Live portfolio updated and published successfully.',
      data: db.publishedPortfolio,
    });
  });

  // Public: Submit Contact Inquiry
  app.post('/api/contact', (req, res) => {
    const { senderName, senderEmail, subject, message } = req.body;
    if (!senderName || !senderEmail || !message) {
      return res.status(400).json({ error: 'Name, email, and message content are required.' });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      subject: (subject || 'Portfolio Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    if (!db.messages) db.messages = [];
    db.messages.unshift(newMessage);
    saveDatabase(db);

    res.json({ success: true, message: 'Message recorded successfully.' });
  });

  // Protected: Mark message read
  app.post('/api/founder/messages/:id/read', authenticateToken, (req, res) => {
    const { id } = req.params;
    if (db.messages) {
      const msg = db.messages.find((m) => m.id === id);
      if (msg) msg.read = true;
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  // Protected: Delete message
  app.delete('/api/founder/messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    if (db.messages) {
      db.messages = db.messages.filter((m) => m.id !== id);
      saveDatabase(db);
    }
    res.json({ success: true });
  });

  // Protected: Upload file simulation / storage
  app.post('/api/founder/upload', authenticateToken, (req, res) => {
    const { fileName, fileType, fileBase64, target } = req.body;

    if (!fileName || !fileBase64) {
      return res.status(400).json({ error: 'Filename and content are required.' });
    }

    // Validate size (max 5MB)
    const approximateSize = (fileBase64.length * 3) / 4;
    if (approximateSize > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds maximum permitted limit (5MB).' });
    }

    if (target === 'resume') {
      if (!fileName.toLowerCase().endsWith('.pdf') && fileType !== 'application/pdf') {
        return res.status(400).json({ error: 'Résumé file must be a valid PDF document.' });
      }

      // Save to public folder
      const buffer = Buffer.from(fileBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64');
      const publicPath = path.resolve(__dirname, 'public', fileName);
      fs.writeFileSync(publicPath, buffer);

      db.portfolio.profile.resumeUrl = `/${fileName}`;
      db.portfolio.profile.resumeFileName = fileName;
      saveDatabase(db);

      return res.json({
        success: true,
        fileUrl: `/${fileName}`,
        message: 'Résumé uploaded and registered.',
      });
    }

    res.json({ success: true, message: 'File accepted.' });
  });

  // Mount Vite in development
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
});
