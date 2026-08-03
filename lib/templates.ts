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
  }
];
