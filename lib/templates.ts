import { PRDData, EMPTY_PRD } from '@/types/prd';

export interface PRDTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  data: PRDData;
}

export const PRD_TEMPLATES: PRDTemplate[] = [
  {
    id: 'ecommerce-marketplace',
    name: 'E-Commerce Marketplace',
    description: 'B2C/B2B online store with Razorpay/UPI payments, inventory tracking, and WhatsApp order alerts.',
    category: 'E-Commerce',
    data: EMPTY_PRD
  },
  {
    id: 'saas-ai-app',
    name: 'SaaS AI Content Platform',
    description: 'Subscription AI generator platform with tier limits, Stripe payments, user credits, and dashboard.',
    category: 'SaaS / AI',
    data: {
      ...EMPTY_PRD,
      projectName: 'NexusAI Studio',
      clientName: 'SynthWave Labs',
      serviceProvider: 'DevCraft Studio',
      projectCost: '6,20,000',
      estimatedTimeline: '8 Weeks',
      projectDescription: 'An AI-powered content generation SaaS platform that enables marketing teams to auto-generate SEO articles, social media captions, and brand images using Gemini 3.5 AI, with subscription tiers, team workspaces, and usage metrics.',
      projectObjectives: [
        'Build multi-tenant SaaS architecture with workspace role permissions',
        'Integrate Gemini 3.5 Flash server-side for streaming AI responses',
        'Implement Stripe usage-based billing and credit top-up system',
        'Deliver a fast, responsive, dark-mode sleek dashboard UI'
      ],
      targetUsers: {
        primary: 'Content marketers, agency copywriters, and social media managers',
        secondary: 'Freelance content creators requiring quick AI assistance',
        admin: 'SaaS platform superadmins, billing managers, and support agents'
      },
      includedPlatforms: {
        website: true,
        webApp: true,
        adminPanel: true,
        androidApp: false,
        iosApp: false,
        apiBackend: true,
        other: 'Chrome Browser Extension'
      },
      features: [
        { id: 'F-01', feature: 'AI Content Generation Studio', description: 'Interactive prompt studio with model selector, temperature controls, and streaming response reader.', priority: 'High' },
        { id: 'F-02', feature: 'Stripe Subscription & Credits', description: 'Starter, Pro, and Enterprise tiers with automated monthly credit allocation and webhook metering.', priority: 'High' },
        { id: 'F-03', feature: 'Team Workspaces & Roles', description: 'Invite team members, assign Editor/Viewer roles, and share generated content folders.', priority: 'High' },
        { id: 'F-04', feature: 'Export & Document Editor', description: 'Rich text editor with Markdown export, PDF download, and one-click copy.', priority: 'Medium' },
        { id: 'F-05', feature: 'Usage Analytics Dashboard', description: 'Graphs showing token consumption, monthly API spend, and generation history.', priority: 'Medium' }
      ],
      pages: [
        'Marketing Landing Page & Pricing Matrix',
        'Login / SSO Registration',
        'AI Studio Workspace & Editor',
        'Saved Projects & Brand Voice Vault',
        'Billing & Usage History',
        'Team Management Panel',
        'SuperAdmin Analytics & Moderation Panel'
      ],
      techStack: {
        frontend: 'Next.js 15, React 19, Tailwind CSS, Lucide Icons',
        backend: 'Next.js API Routes & Node.js ESM',
        database: 'PostgreSQL with Drizzle ORM',
        authentication: 'Clerk / NextAuth (Google & Email SSO)',
        storage: 'AWS S3 for AI Generated Image Assets',
        hosting: 'Vercel / GCP Cloud Run',
        analytics: 'PostHog & Mixpanel'
      },
      thirdPartyIntegrations: [
        'Google Gemini 3.5 API',
        'Stripe Billing & Webhooks',
        'Resend Transactional Email',
        'PostHog Product Analytics',
        'Sentry Error Tracking'
      ]
    }
  },
  {
    id: 'healthcare-telemedicine',
    name: 'Healthcare & Doctor Booking',
    description: 'Patient appointment scheduling, video consultation, prescription PDF, and doctor dashboard.',
    category: 'Healthcare',
    data: {
      ...EMPTY_PRD,
      projectName: 'CureLine Telehealth Portal',
      clientName: 'Apex Healthcare Pvt Ltd',
      serviceProvider: 'DevCraft Studio',
      projectCost: '8,50,000',
      estimatedTimeline: '10 Weeks',
      projectDescription: 'A HIPAA-compliant web and mobile telemedicine application facilitating patient appointment booking, instant video consultations, digital prescription downloads, and lab report tracking.',
      projectObjectives: [
        'Enable patients to search verified doctors by specialty, city, and availability',
        'Integrate WebRTC video call engine for secure doctor-patient consultations',
        'Generate digital signed prescription PDFs sent via SMS and Email',
        'Provide clinics with appointment queue management software'
      ],
      targetUsers: {
        primary: 'Patients seeking online specialist consultations and home lab tests',
        secondary: 'Caregivers booking appointments for family members',
        admin: 'Doctors, clinic receptionists, and hospital operations admins'
      },
      includedPlatforms: {
        website: true,
        webApp: true,
        adminPanel: true,
        androidApp: true,
        iosApp: true,
        apiBackend: true,
        other: ''
      },
      features: [
        { id: 'F-01', feature: 'Doctor Search & Booking', description: 'Filter by specialty, fee, experience, slot timing, and immediate video availability.', priority: 'High' },
        { id: 'F-02', feature: 'WebRTC Video Consultation', description: 'In-browser encrypted HD video calls with chat, screen sharing, and diagnostic image view.', priority: 'High' },
        { id: 'F-03', feature: 'Digital Prescription Generator', description: 'Doctor tool to quickly prescribe dosage, diagnosis notes, and export signed PDF.', priority: 'High' },
        { id: 'F-04', feature: 'Razorpay / Health Insurance Payment', description: 'Upfront consultation fee collection with UPI, Card, and digital insurance validation.', priority: 'High' },
        { id: 'F-05', feature: 'Lab Test Booking & Reports', description: 'Home sample pickup scheduling and automated report PDF upload notification.', priority: 'Medium' }
      ],
      pages: [
        'Patient Portal Home',
        'Doctor Directory & Slot Picker',
        'Secure Video Call Room',
        'My Consultations & Prescription Vault',
        'Doctor Dashboard & Patient Queue',
        'Clinic Admin & Financial Settlement Panel'
      ]
    }
  },
  {
    id: 'custom-erp-crm',
    name: 'Enterprise Logistics ERP / CRM',
    description: 'Internal operations dashboard, fleet tracking, invoice management, and role-based staff access.',
    category: 'Enterprise',
    data: {
      ...EMPTY_PRD,
      projectName: 'FleetPulse ERP',
      clientName: 'Vanguard Logistics India',
      serviceProvider: 'DevCraft Studio',
      projectCost: '12,00,000',
      estimatedTimeline: '12 Weeks',
      projectDescription: 'An enterprise logistics management ERP application built to track fleet shipments, driver dispatching, fuel expenses, client invoicing, and automated warehouse inventory reconciliation.',
      projectObjectives: [
        'Streamline end-to-end consignment tracking from pickup to proof of delivery',
        'Automate client GST invoice generation and payment tracking',
        'Provide drivers with a mobile web web app for live GPS updates and POD image uploads',
        'Ensure granular role-based permissions across 5 internal department teams'
      ],
      targetUsers: {
        primary: 'Logistics dispatch managers and warehouse operators',
        secondary: 'Truck drivers and field pickup personnel',
        admin: 'Executive management, finance head, and fleet directors'
      }
    }
  },
  {
    id: 'bizbuddy-loan-crm',
    name: 'BizBuddy Loan CRM & Finance Lead Management (MVP)',
    description: 'Loan CRM & Finance Lead Management System MVP for BizBuddy with branch, employee, agent, customer lead tracking, and report management.',
    category: 'Finance & CRM',
    data: {
      ...EMPTY_PRD,
      projectName: 'Loan CRM & Finance Lead Management System (MVP)',
      clientName: 'BizBuddy',
      serviceProvider: 'DevCraft Studio',
      docVersion: '1.0',
      date: '04/08/2026',
      currencySymbol: '₹',
      projectCost: '55,000',
      estimatedTimeline: '5–6 Weeks',
      coverBadge: 'OFFICIAL PRD & MVP AGREEMENT',
      coverDocumentType: 'PRODUCT REQUIREMENTS DOCUMENT & COMMERCIAL AGREEMENT',
      coverSubtitle: 'Centralized Branch, Employee, Agent, Lead CRM & Document Management Platform',
      coverDescription: 'Responsive web-based Loan CRM & Finance Lead Management System for BizBuddy enabling finance companies to manage branches, employees, agents, customer leads, documents, follow-ups, and reports.',

      clientSignoff: {
        name: 'Himanshu (Founder: 7061752337)',
        company: 'BizBuddy',
        signatureDate: '04/08/2026',
        signatureDataUrl: ''
      },
      providerSignoff: {
        name: 'Aditya (Technical Head: 9142409903)',
        company: 'BizBuddy / DevCraft Studio',
        signatureDate: '04/08/2026',
        signatureDataUrl: ''
      },

      projectDescription: 'Develop a responsive web-based Loan CRM & Finance Lead Management System for BizBuddy that enables finance companies to manage branches, employees, agents, customer leads, documents, follow-ups, and reports from a centralized platform. The application will support desktop, tablet, and mobile browsers.',
      projectObjectives: [
        'Centralize branch, employee, agent, and customer lead management into a single responsive web platform',
        'Track lead progress through 9 status stages (New, Contacted, Documents Pending, Under Process, Approved, Rejected, Disbursed, Hold, Closed)',
        'Provide document upload & management (PDF, JPG, PNG up to 10MB) for loan applicants (Aadhaar, PAN, Salary Slip, Bank Statement, Property Docs)',
        'Enable Role-Based Access Control (RBAC) for Super Admin, Branch Admin, Employee, and Agent',
        'Deliver real-time follow-up CRM reminders and branch/employee/agent analytics reports with Excel export'
      ],
      targetUsers: {
        primary: 'Employees and Agents managing customer leads and uploading loan documents',
        secondary: 'Branch Admins monitoring branch performance and assigned leads',
        admin: 'Super Admin with full system access, masters, settings, and comprehensive reports'
      },

      includedPlatforms: {
        website: false,
        webApp: true,
        adminPanel: true,
        androidApp: false,
        iosApp: false,
        apiBackend: true,
        other: 'Responsive Mobile Browser UI'
      },

      features: [
        { id: 'F-01', feature: 'Super Admin & Role Management', description: 'Full system access, manage branches, employees, agents, leads, reports, masters, and company settings with Role-Based Access Control (RBAC).', priority: 'High' },
        { id: 'F-02', feature: 'Branch & Employee Management', description: 'Create and manage branches (Branch Name, Code, Address, Phone, Manager) and branch employees (Name, Mobile, Email, Branch, Designation, Status).', priority: 'High' },
        { id: 'F-03', feature: 'Agent & Agency Portal', description: 'Agent onboarding (Name, Mobile, Email, Branch, Agency Name, Status). Agents can submit leads, edit own leads, and upload customer documents.', priority: 'High' },
        { id: 'F-04', feature: 'Bank Master & Product Master', description: 'Manage banks (Bank Name, Loan Type, Status) and products (Home Loan, Personal Loan, Business Loan, Loan Against Property, Car Loan).', priority: 'High' },
        { id: 'F-05', feature: 'Comprehensive Lead CRM', description: 'Customer details (Name, Mobile, Email, Address, Income) & Loan info (Type, Amount, Bank, Source, Status, Follow-up date). Supports 9 status stages.', priority: 'High' },
        { id: 'F-06', feature: 'Document Management System', description: 'Upload, view, download, replace & delete customer documents (Aadhaar, PAN, Salary Slip, Bank Statement, Property Docs) up to 10 MB (PDF, JPG, PNG).', priority: 'High' },
        { id: 'F-07', feature: 'Follow-up CRM & Reminders', description: 'Schedule follow-up dates, add remarks, view follow-up history, and receive dashboard reminders for today\'s pending follow-ups.', priority: 'High' },
        { id: 'F-08', feature: 'Reports & Analytics Dashboard', description: 'Branch-wise, employee-wise, agent-wise, status-wise, loan-type, and monthly reports with Excel export functionality.', priority: 'Medium' }
      ],

      pages: [
        'Authentication (Login, Forgot Password, Change Password)',
        'Executive Dashboard (Total Leads, Status Counts, Today\'s Follow-ups)',
        'Branch Management (List, Add/Edit Branch)',
        'Employee Management (List, Add/Edit Employee, Status Toggle)',
        'Agent Management (List, Add/Edit Agent, Profile)',
        'Bank Master & Product Master Configuration',
        'Lead Management (Grid View, Filter, Search, Add/Edit Lead)',
        'Lead Details View (Customer Info, Loan Details, Uploaded Docs, Activity Timeline)',
        'Document Vault (Upload, Preview, Replace, Download)',
        'Follow-up CRM Calendar & History Panel',
        'Reports & Analytics (Excel Export)',
        'Company Settings & Company Profile'
      ],

      userRoles: {
        guest: 'No public access. Login required.',
        registeredUser: 'Agent: Add lead, edit own lead, upload customer documents, view own lead status.',
        admin: 'Branch Admin: Manage branch employees, agents, branch leads, and branch reports. Employee: View assigned leads, update status, upload documents, add remarks.',
        superAdmin: 'Super Admin: Full system control, branch setup, masters, global reports, company settings, and user management.'
      },

      userFlows: {
        registration: 'Admin/Branch Admin creates Employee/Agent user accounts → Login credentials generated → User logs in via Mobile/Username and Password.',
        primaryProductFlow: 'Agent/Employee creates Lead → Selects Loan Product & Bank → Uploads Documents (Aadhaar/PAN/Statement) → Updates Status → Sets Follow-up Date → Disbursal.',
        adminFlow: 'Super Admin logs in → Monitors Dashboard metrics → Manages Branches & Employees → Configures Bank & Product Masters → Generates Excel Reports.'
      },

      design: {
        style: 'Clean Corporate Finance Dashboard with High Density Data Cards and Responsive Mobile First Navigation',
        primaryColor: '#0F172A',
        secondaryColor: '#2563EB',
        typography: 'Plus Jakarta Sans & Inter Sans',
        referenceWebsites: 'Salesforce Financial Services CRM, LeadSquared Finance CRM',
        clientAssets: {
          logo: true,
          brandGuidelines: true,
          finalTextContent: true,
          productInfo: true,
          imagesVideos: false,
          legalPolicies: true
        }
      },

      techStack: {
        frontend: 'React.js with Responsive CSS / Tailwind',
        backend: 'Node.js + Express.js API Framework',
        database: 'MySQL Database (Tables: Users, Roles, Branches, Employees, Agents, Customers, Leads, LeadStatusHistory, Followups, Documents, Banks, Products, Notifications, CompanySettings)',
        authentication: 'JWT (JSON Web Token) Auth & Password Encryption',
        storage: 'Local File Storage (Cloud storage optional extension)',
        hosting: 'Client Linux Web Server / VPS',
        analytics: 'Built-in SQL Analytics Reports'
      },
      thirdPartyIntegrations: [
        'Node.js Express REST APIs',
        'MySQL Database Connector',
        'Excel Export Library (xlsx/exceljs)',
        'JWT Authentication & Bcrypt Password Hashing'
      ],
      securityPractices: [
        'Password Encryption with Bcrypt',
        'JWT (JSON Web Token) Session Authentication',
        'Role-Based Access Control (RBAC) for Super Admin, Branch Admin, Employee, and Agent',
        'Secure File Upload Handling (PDF, JPG, PNG up to 10 MB)',
        'Input Validation & Sanitization (Unique Mobile Numbers, Mandatory Field Validation)',
        'Basic Activity & Status Audit Logging'
      ],
      deliverables: [
        'Responsive Web Application (React.js + Node.js Express + MySQL)',
        'Super Admin Dashboard, Branch Admin Portal, Employee Portal & Agent Portal',
        'Complete Source Code Repository',
        'MySQL Database Setup Scripts & Schema Dump',
        'Basic API Documentation',
        'One-time Client Linux VPS Server Deployment',
        'Basic User Manual & UAT Support'
      ],

      timelinePhases: [
        { phase: 'Week 1: Architecture & Auth', duration: '1 Week (UI Design, Database Setup, Authentication)' },
        { phase: 'Week 2: Masters & User Management', duration: '1 Week (Admin Panel, Bank/Product Masters, Employee/Agent Onboarding)' },
        { phase: 'Week 3: Lead CRM Core', duration: '1 Week (Lead Management, Status Workflow, Filtering)' },
        { phase: 'Week 4: Documents & Reports', duration: '1 Week (Document Storage, Follow-up CRM, Excel Reports)' },
        { phase: 'Week 5: QA & Deployment', duration: '1 Week (End-to-End Testing, Bug Fixes, Server Deployment)' },
        { phase: 'Week 6: Review & Handover', duration: '1 Week (Buffer & Client Review with BizBuddy)' }
      ],

      paymentStructure: [
        { percentage: '30%', milestone: 'Advance / Project Kickoff', description: 'Payable upon PRD approval and database setup (Week 1)' },
        { percentage: '40%', milestone: 'Mid-Term Core Lead CRM', description: 'Payable after completion of Lead Management & User Portals (Week 3)' },
        { percentage: '30%', milestone: 'Final Deployment & UAT Handover', description: 'Payable upon successful deployment and UAT signoff (Week 5)' }
      ],

      additionalLegalClauses: {
        nda: true,
        ipAssignment: true,
        nonCompete: true,
        termination: true
      },

      outOfScope: [
        'OTP Login / Two-Factor Authentication (2FA)',
        'Native Android / iOS Apps (Mobile browser responsive UI included)',
        'Attendance, HR, GPS Check-in & Leave Management',
        'EMI Calculator & Loan Eligibility Calculator',
        'Commission Management & Agent Payout Calculations',
        'WhatsApp Integration & SMS Gateway / Email Integration',
        'Push Notifications & CIBIL API / Aadhaar e-KYC / PAN Verification / Bank APIs',
        'AI Lead Scoring & Customer Self-Service Portal',
        'Multi-language Support, Dark Mode, e-Sign & Scheduled Automated Email Reports'
      ],

      limitations: [
        'Third-party Cloud storage costs (if opted later) are excluded.',
        'Change requests outside this 33-section PRD require revised commercial estimates.',
        'Deployment is on client-provided Linux server / VPS.'
      ],

      finalHandoverItems: [
        'Full Source Code (React.js Frontend & Node.js Backend)',
        'MySQL Database Dump & Schema Scripts',
        'Admin, Employee & Agent Web Application Deployment',
        'Basic API Documentation & User Manual'
      ]
    }
  }
];
