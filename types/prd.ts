export interface FeatureItem {
  id: string;
  feature: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface TimelinePhase {
  phase: string;
  duration: string;
}

export interface PaymentMilestone {
  percentage: string;
  milestone: string;
  description: string;
}

export interface PRDData {
  // Header
  projectName: string;
  clientName: string;
  serviceProvider: string;
  docVersion: string;
  date: string;
  currencySymbol: string;
  projectCost: string;
  estimatedTimeline: string;
  coverBadge?: string;
  coverDocumentType?: string;
  coverSubtitle?: string;
  coverDescription?: string;
  brandingPrimaryColor?: string;
  brandingLogoUrl?: string;
  brandingHeaderStyle?: 'standard' | 'minimal' | 'bold';
  hiddenSections?: number[];

  // 1. PROJECT OVERVIEW
  projectDescription: string;
  projectObjectives: string[];
  targetUsers: {
    primary: string;
    secondary: string;
    admin: string;
  };

  // 2. PROJECT SCOPE
  includedPlatforms: {
    website: boolean;
    webApp: boolean;
    adminPanel: boolean;
    androidApp: boolean;
    iosApp: boolean;
    apiBackend: boolean;
    other: string;
  };

  // 3. FEATURES & FUNCTIONAL REQUIREMENTS
  features: FeatureItem[];

  // 4. PAGES / SCREENS
  pages: string[];

  // 5. USER ROLES & PERMISSIONS
  userRoles: {
    guest: string;
    registeredUser: string;
    admin: string;
    superAdmin: string;
  };

  // 6. USER FLOWS
  userFlows: {
    registration: string;
    primaryProductFlow: string;
    adminFlow: string;
  };

  // 7. UI/UX & DESIGN
  design: {
    style: string;
    primaryColor: string;
    secondaryColor: string;
    typography: string;
    referenceWebsites: string;
    clientAssets: {
      logo: boolean;
      brandGuidelines: boolean;
      finalTextContent: boolean;
      productInfo: boolean;
      imagesVideos: boolean;
      legalPolicies: boolean;
    };
  };

  // 8. TECHNICAL ARCHITECTURE
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    authentication: string;
    storage: string;
    hosting: string;
    analytics: string;
  };

  // 9. THIRD-PARTY INTEGRATIONS
  thirdPartyIntegrations: string[];

  // 10. SECURITY
  securityPractices: string[];

  // 11. PERFORMANCE
  performanceOptimizations: string[];

  // 12. SEO
  seoFeatures: string[];

  // 13. DELIVERABLES
  deliverables: string[];

  // 14. PROJECT TIMELINE
  timelinePhases: TimelinePhase[];

  // 15. PAYMENT TERMS
  paymentStructure: PaymentMilestone[];

  // 16. REVISION POLICY
  designRevisions: string;
  devRevisions: string;
  revisionPolicyNotes: string;

  // 17. CHANGE REQUEST POLICY
  changeRequestPolicy: string;

  // 18. CLIENT RESPONSIBILITIES
  clientResponsibilities: string[];

  // 19. TESTING & QUALITY ASSURANCE
  qaProcess: string;

  // 20. BUG VS CHANGE REQUEST
  bugVsChangePolicy: string;

  // 21. CLIENT APPROVAL
  approvalFeedbackDays: string;
  approvalNotes: string;

  // 22. POST-LAUNCH SUPPORT
  supportPeriod: string;
  includedSupport: string[];
  notIncludedSupport: string[];

  // 23. HOSTING, DOMAIN & THIRD-PARTY COSTS
  hostingDomainNotes: string;

  // 24. INTELLECTUAL PROPERTY & OWNERSHIP
  ipOwnershipNotes: string;

  // 25. CONFIDENTIALITY
  confidentialityNotes: string;

  // 26. CONTENT RESPONSIBILITY
  contentResponsibilityNotes: string;

  // 27. DATA & BACKUPS
  backupProvider: string;
  backupFrequency: string;
  backupRetention: string;

  // 28. PROJECT DELAYS / PAUSE
  delayThresholdDays: string;
  delayPolicyNotes: string;

  // 29. CANCELLATION & REFUND
  cancellationPolicyNotes: string;

  // 30. LIMITATIONS
  limitations: string[];

  // 31. OUT-OF-SCOPE WORK
  outOfScope: string[];

  // 32. FINAL HANDOVER
  finalHandoverItems: string[];

  // 33. FINAL APPROVAL & SIGN-OFF
  clientSignoff: {
    name: string;
    company: string;
    signatureDate: string;
    signatureDataUrl?: string;
  };
  providerSignoff: {
    name: string;
    company: string;
    signatureDate: string;
    signatureDataUrl?: string;
  };
  documentApproval: {
    prdVersion: string;
    status: 'Draft' | 'Under Review' | 'Approved';
    clientApprovalDate: string;
    projectStartDate: string;
    expectedDeliveryDate: string;
  };
  // 34. ADDITIONAL LEGAL CLAUSES (Optional)
  additionalLegalClauses?: {
    nda: boolean;
    ipAssignment: boolean;
    nonCompete: boolean;
    termination: boolean;
  };
}

export const EMPTY_PRD: PRDData = {
  hiddenSections: [],
  projectName: 'NexCommerce Marketplace',
  clientName: 'Aura Retail Pvt Ltd',
  serviceProvider: 'DevCraft Studio',
  docVersion: '1.0',
  date: new Date().toLocaleDateString('en-GB'),
  currencySymbol: '₹',
  projectCost: '4,50,000',
  estimatedTimeline: '6 Weeks',

  projectDescription: 'A modern, high-performance web and mobile e-commerce application designed for boutique brands to showcase artisanal goods, manage inventory, process secure multi-currency payments, and automate order notifications via WhatsApp.',
  projectObjectives: [
    'Enable customers to browse products with high-speed filtering and instant search',
    'Streamline mobile checkout with 1-click Razorpay/UPI payment integration',
    'Provide store managers with a comprehensive admin dashboard for order and inventory tracking',
    'Deliver a reliable and user-friendly product.',
    'Ensure the solution works effectively across agreed devices/platforms.',
    'Build the product in a way that allows reasonable future expansion.'
  ],
  targetUsers: {
    primary: 'Online shoppers seeking unique artisanal goods on web and mobile browsers',
    secondary: 'Guest buyers making quick purchases without creating a full account',
    admin: 'Store admins, catalog managers, and fulfillment team staff'
  },

  includedPlatforms: {
    website: true,
    webApp: true,
    adminPanel: true,
    androidApp: false,
    iosApp: false,
    apiBackend: true,
    other: ''
  },

  features: [
    { id: 'F-01', feature: 'Product Catalog & Search', description: 'Dynamic grid with real-time search, multi-category filters, and price ranges.', priority: 'High' },
    { id: 'F-02', feature: 'Shopping Cart & Checkout', description: 'Persistent cart, coupon code application, shipping calculator, and address manager.', priority: 'High' },
    { id: 'F-03', feature: 'Razorpay & UPI Payments', description: 'Secure checkout processing cards, netbanking, UPI apps, and instant receipt generation.', priority: 'High' },
    { id: 'F-04', feature: 'Admin Inventory Dashboard', description: 'Real-time SKU stock tracking, order status updates (Pending/Shipped/Delivered), and analytics.', priority: 'High' },
    { id: 'F-05', feature: 'WhatsApp Order Updates', description: 'Automated SMS/WhatsApp alerts for order placement and live tracking updates.', priority: 'Medium' },
    { id: 'F-06', feature: 'User Reviews & Ratings', description: 'Verified buyer product reviews with photo uploads and helpfulness votes.', priority: 'Low' }
  ],

  pages: [
    'Home / Landing Page',
    'Product Listing & Detail Pages',
    'Cart & Checkout Flow',
    'User Account & Order History',
    'Admin Analytics & Inventory Dashboard',
    'Admin Order Processing Panel',
    'Contact & Support Center',
    'Privacy Policy & Terms'
  ],

  userRoles: {
    guest: 'Can browse product catalog, add items to cart, and use guest checkout.',
    registeredUser: 'Can view saved wishlist, track past order status, save delivery addresses, and submit reviews.',
    admin: 'Full access to add/edit products, manage stock levels, update order fulfillment status, and view sales metrics.',
    superAdmin: 'Can manage admin staff accounts, configure system settings, export financial reports, and modify site settings.'
  },

  userFlows: {
    registration: 'Visitor → Sign Up (Email/Mobile OTP) → Account Verification → Profile Setup → Welcome Dashboard',
    primaryProductFlow: 'Customer → Select Category → View Product → Add to Cart → Enter Shipping Info → Razorpay Payment → Order Confirmation & WhatsApp Alert',
    adminFlow: 'Admin Login → Dashboard → Manage Inventory / Orders → Update Fulfillment Status → Trigger Customer Notification'
  },

  design: {
    style: 'Modern & Minimalist',
    primaryColor: '#0F172A (Deep Slate)',
    secondaryColor: '#E2E8F0 (Soft Neutral Gray)',
    typography: 'Plus Jakarta Sans / Inter',
    referenceWebsites: 'https://nike.com, https://myntra.com',
    clientAssets: {
      logo: true,
      brandGuidelines: true,
      finalTextContent: false,
      productInfo: true,
      imagesVideos: false,
      legalPolicies: true
    }
  },

  techStack: {
    frontend: 'Next.js 15 (React 19, TypeScript, Tailwind CSS)',
    backend: 'Node.js / Next.js Server Actions & API Routes',
    database: 'PostgreSQL / Supabase or Cloud SQL',
    authentication: 'NextAuth.js / Firebase Auth (JWT & OAuth)',
    storage: 'AWS S3 / Cloudflare R2 Bucket',
    hosting: 'Vercel / Cloud Run',
    analytics: 'Google Analytics 4 & PostHog'
  },

  thirdPartyIntegrations: [
    'Payment Gateway (Razorpay / Stripe)',
    'WhatsApp / SMS API (Twilio / Interakt)',
    'Email Service (Resend / SendGrid)',
    'Google Maps API (Address autocomplete)',
    'Google Analytics 4',
    'Cloud Storage (AWS S3)'
  ],

  securityPractices: [
    'Secure HTTPS enforcement & SSL configuration',
    'Encrypted password hashing (bcrypt/argon2)',
    'Role-based access control (RBAC) on API routes',
    'Input validation & sanitization (Zod/TypeBox)',
    'Environment variable isolation for secrets',
    'Database parameterization to prevent SQL injection',
    'Rate limiting on authentication and API routes'
  ],

  performanceOptimizations: [
    'Image optimization via WebP/AVIF format and Next/Image',
    'Server-side rendering (SSR) and edge caching for product pages',
    'Database index optimization for fast search queries',
    'Code splitting and lazy loading of heavy modules',
    'Compression and asset bundling'
  ],

  seoFeatures: [
    'SEO-friendly dynamic URLs',
    'Automated meta titles and descriptions generation',
    'Dynamic XML Sitemap & Robots.txt configuration',
    'Open Graph & Twitter card metadata for social sharing',
    'JSON-LD Schema markup for E-Commerce products',
    'Google Search Console verification readiness'
  ],

  deliverables: [
    'Production-ready application (Web & Responsive Mobile)',
    'Frontend & Backend source code repository',
    'Configured database schema & migrations',
    'Admin management dashboard',
    'Deployment setup on agreed hosting environment',
    'System access credentials & handover document',
    '1-Hour video walkthrough and training session'
  ],

  timelinePhases: [
    { phase: 'Requirements & Planning', duration: '5 Days' },
    { phase: 'UI/UX Wireframing & Design', duration: '7 Days' },
    { phase: 'Frontend & Backend Development', duration: '18 Days' },
    { phase: 'Testing & QA', duration: '5 Days' },
    { phase: 'Client Review (UAT)', duration: '4 Days' },
    { phase: 'Final Deployment & Handover', duration: '3 Days' }
  ],

  paymentStructure: [
    { percentage: '40%', milestone: 'Project Confirmation', description: 'Development begins after advance payment receipt' },
    { percentage: '30%', milestone: 'Development Milestone', description: 'Payable after completion of core features & UI review' },
    { percentage: '30%', milestone: 'Final Delivery', description: 'Payable before final production handover and code release' }
  ],

  designRevisions: '2',
  devRevisions: '2',
  revisionPolicyNotes: 'A revision means modification of an existing approved requirement. Adding new pages or payment options will be treated as a Change Request.',

  changeRequestPolicy: 'After PRD approval, any additional functionality will follow: Client Request → Technical Review → Cost/Timeline Estimate → Client Approval → Development. Additional features may result in revised cost and delivery schedule.',

  clientResponsibilities: [
    'Brand logo files (vector/PNG format)',
    'High-resolution product images and pricing details',
    'Razorpay/Stripe API credentials and merchant account setup',
    'Domain registrar and DNS access details',
    'Consolidated feedback provided within agreed review window'
  ],

  qaProcess: 'The project will go through: Development Testing → Internal QA → Client UAT → Bug Resolution → Approval → Production deployment.',

  bugVsChangePolicy: 'A bug occurs when documented and approved functionality does not behave according to this PRD. A change request occurs when existing functionality works as documented but different behavior is requested. Bugs during warranty are fixed free of cost.',

  approvalFeedbackDays: '3–5',
  approvalNotes: 'Approval may be documented through email, project management tool, or digital signature on this document.',

  supportPeriod: '30 Days',
  includedSupport: [
    'Fixing reproducible bugs in documented features',
    'Deployment and server configuration adjustments',
    'Minor text adjustments or bug fixes'
  ],
  notIncludedSupport: [
    'Adding new features or pages',
    'Third-party platform API policy changes',
    'Major layout or structural redesigns'
  ],

  hostingDomainNotes: 'Unless explicitly included, domain registration, server hosting plans, database charges, and third-party API subscriptions are paid directly by the client.',

  ipOwnershipNotes: 'The client retains ownership of supplied content. Full ownership and licensing of custom source code transfers upon receipt of 100% final payment.',

  confidentialityNotes: 'Both parties agree to maintain strict confidentiality regarding proprietary business information, credentials, customer data, and source code.',

  contentResponsibilityNotes: 'The client guarantees that all supplied logos, imagery, and text content comply with legal copyrights and intellectual property rights.',

  backupProvider: 'Hosting Provider (Automated Automated Daily Snapshots)',
  backupFrequency: 'Daily',
  backupRetention: '30 Days',

  delayThresholdDays: '30',
  delayPolicyNotes: 'Delays in receiving client materials, credentials, or approval feedback beyond 30 days may cause the project to be placed on hold with a revised timeline.',

  cancellationPolicyNotes: 'If cancelled after commencement, compensation will be based on work completed, allocated engineering hours, and incurred third-party fees as per commercial terms.',

  limitations: [
    'No guarantee of specific Google search engine rankings or traffic volume',
    'Sales or revenue outcomes are dependent on market factors outside development scope',
    'Third-party API downtime or rate limits remain subject to third-party providers'
  ],

  outOfScope: [
    'Native iOS/Android Swift/Kotlin app development (unless checked in Scope)',
    'Content writing, product photography, or video production',
    'Paid marketing campaigns or ad account setups',
    'Data entry for more than 50 sample product items'
  ],

  finalHandoverItems: [
    'Live production web deployment',
    'Git repository source code transfer',
    'Admin credentials & environment setup guide',
    'Database access & API key handover',
    '30-Day post-launch warranty support activation'
  ],

  clientSignoff: {
    name: '',
    company: 'Aura Retail Pvt Ltd',
    signatureDate: ''
  },
  providerSignoff: {
    name: '',
    company: 'DevCraft Studio',
    signatureDate: ''
  },
  documentApproval: {
    prdVersion: '1.0',
    status: 'Approved',
    clientApprovalDate: new Date().toLocaleDateString('en-GB'),
    projectStartDate: new Date().toLocaleDateString('en-GB'),
    expectedDeliveryDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
  },
  additionalLegalClauses: {
    nda: false,
    ipAssignment: false,
    nonCompete: false,
    termination: false,
  }
};

/**
 * Converts a PRDData object into the exact Markdown format specified in the prompt.
 */
export function prdToMarkdown(d: PRDData): string {
  const check = (val: boolean) => (val ? '[x]' : '[ ]');

  const platformsList = [
    `* ${check(d.includedPlatforms.website)} Website`,
    `* ${check(d.includedPlatforms.webApp)} Web Application`,
    `* ${check(d.includedPlatforms.adminPanel)} Admin Panel`,
    `* ${check(d.includedPlatforms.androidApp)} Android Application`,
    `* ${check(d.includedPlatforms.iosApp)} iOS Application`,
    `* ${check(d.includedPlatforms.apiBackend)} API / Backend`,
    `* ${check(Boolean(d.includedPlatforms.other))} Other: ${d.includedPlatforms.other || '__________'}`
  ].join('\n');

  const featureRows = d.features
    .map(f => `| ${f.id} | ${f.feature} | ${f.description} | ${f.priority} |`)
    .join('\n');

  const pagesList = d.pages.map((p, idx) => `${idx + 1}. ${p}`).join('\n');

  const objList = d.projectObjectives.map(o => `* ${o}`).join('\n');

  const thirdPartyList = d.thirdPartyIntegrations.map(t => `* ${t}`).join('\n');

  const securityList = d.securityPractices.map(s => `* ${s}`).join('\n');

  const perfList = d.performanceOptimizations.map(p => `* ${p}`).join('\n');

  const seoList = d.seoFeatures.map(s => `* ${s}`).join('\n');

  const delivList = d.deliverables.map(item => `* ${item}`).join('\n');

  const clientRespList = d.clientResponsibilities.map(c => `* ${c}`).join('\n');

  const supportInc = d.includedSupport.map(s => `* ${s}`).join('\n');
  const supportNotInc = d.notIncludedSupport.map(s => `* ${s}`).join('\n');

  const limitList = d.limitations.map(l => `* ${l}`).join('\n');
  const outOfScopeList = d.outOfScope.map(o => `* ${o}`).join('\n');
  const handoverList = d.finalHandoverItems.map(h => `* ${h}`).join('\n');

  const timelineRows = d.timelinePhases
    .map(t => `| ${t.phase} | ${t.duration} |`)
    .join('\n');

  const paymentBreakdown = d.paymentStructure
    .map(p => `**${p.percentage} — ${p.milestone}**\n\n${p.description}`)
    .join('\n\n');

  const assetsCheck = [
    `* ${check(d.design.clientAssets.logo)} Logo`,
    `* ${check(d.design.clientAssets.brandGuidelines)} Brand guidelines`,
    `* ${check(d.design.clientAssets.finalTextContent)} Final text/content`,
    `* ${check(d.design.clientAssets.productInfo)} Product information`,
    `* ${check(d.design.clientAssets.imagesVideos)} Images/videos where applicable`,
    `* ${check(d.design.clientAssets.legalPolicies)} Legal policies where applicable`
  ].join('\n');

  const statusBox = `☐ Draft  ☐ Under Review  ☐ Approved`.replace(
    d.documentApproval.status === 'Draft'
      ? '☐ Draft'
      : d.documentApproval.status === 'Under Review'
      ? '☐ Under Review'
      : '☐ Approved',
    `☑ ${d.documentApproval.status}`
  );

  const hasAdditionalLegal = d.additionalLegalClauses && Object.values(d.additionalLegalClauses).some(Boolean);
  const finalSectionNum = hasAdditionalLegal ? '34' : '33';
  const legalClausesText = hasAdditionalLegal
    ? `\n---\n\n# 33. ADDITIONAL LEGAL CLAUSES\n\n${d.additionalLegalClauses!.nda ? '## Non-Disclosure Agreement (NDA)\nBoth parties agree to keep all sensitive information, including source code, business strategies, and client data, strictly confidential during and after the project duration. Information shall not be disclosed to third parties without prior written consent.\n\n' : ''}${d.additionalLegalClauses!.ipAssignment ? '## Intellectual Property (IP) Assignment\nUpon full and final payment, the Service Provider agrees to assign, transfer, and convey all rights, title, and interest in the custom deliverables (including custom source code and design assets) exclusively to the Client. Third-party open-source components remain under their respective licenses.\n\n' : ''}${d.additionalLegalClauses!.nonCompete ? '## Non-Compete\nThe Service Provider agrees not to independently build or offer an exact replica of the Client’s core proprietary software to a direct competitor of the Client for a period of 12 months following project completion.\n\n' : ''}${d.additionalLegalClauses!.termination ? '## Termination Terms\nEither party may terminate this agreement with 14 days written notice. In the event of termination by the Client before project completion, the Client agrees to pay for all work completed up to the termination date based on an hourly rate or prorated milestone calculation.\n\n' : ''}`.trimEnd() + '\n'
    : '';

  return `# PRODUCT REQUIREMENTS & PROJECT AGREEMENT

**Project Name:** ${d.projectName || '[Project Name]'}
**Client Name:** ${d.clientName || '[Client / Company Name]'}
**Service Provider:** ${d.serviceProvider || '[Your Name / Company]'}
**Document Version:** ${d.docVersion || '1.0'}
**Date:** ${d.date || '[DD/MM/YYYY]'}
**Project Cost:** ${d.currencySymbol}${d.projectCost || '[Amount]'}
**Estimated Timeline:** ${d.estimatedTimeline || '[X Days / Weeks]'}

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

${d.projectDescription || '[Briefly describe what will be designed/developed, the business problem it solves, and its primary purpose.]'}

## 1.2 Project Objectives

The primary objectives of this project are:

${objList || '* Deliver a reliable and user-friendly product.\n* Ensure the solution works effectively across agreed devices/platforms.\n* Build the product in a way that allows reasonable future expansion.'}

## 1.3 Target Users

Primary Users: ${d.targetUsers.primary || '[User Type]'}

Secondary Users: ${d.targetUsers.secondary || '[User Type]'}

Admin Users: ${d.targetUsers.admin || '[Admin / Staff / Management]'}

---

# 2. PROJECT SCOPE

The project includes the design, development, testing, and deployment of the features specifically mentioned in this document.

## Included Platforms

${platformsList}

Only checked and explicitly documented platforms are included.

---

# 3. FEATURES & FUNCTIONAL REQUIREMENTS

| ID   | Feature   | Description   | Priority |
| ---- | --------- | ------------- | -------- |
${featureRows || '| F-01 | [Feature] | [Description] | High     |'}

Each feature will be implemented according to the behavior described and approved in this document.

Any functionality not mentioned in the approved PRD will not automatically be considered part of the project.

---

# 4. PAGES / SCREENS

The project will contain the following agreed pages/screens:

${pagesList || '1. [Home]\n2. [Login / Registration]\n3. [Dashboard]'}

Any additional page or major screen requested after approval may be treated as additional scope.

---

# 5. USER ROLES & PERMISSIONS

### Guest

${d.userRoles.guest || '[Define permissions]'}

### Registered User

${d.userRoles.registeredUser || '[Define permissions]'}

### Admin

${d.userRoles.admin || '[Define permissions]'}

### Super Admin

${d.userRoles.superAdmin || '[Define permissions]'}

Access to features and data will be controlled according to the approved role structure.

---

# 6. USER FLOWS

Example:

**Registration**

${d.userFlows.registration || 'Visitor → Sign Up → Verification → Account Creation → Dashboard'}

**Primary Product Flow**

${d.userFlows.primaryProductFlow || 'User → [Step 1] → [Step 2] → [Step 3] → Completion'}

**Admin Flow**

${d.userFlows.adminFlow || 'Admin Login → Dashboard → Select Module → Manage Data → Save/Publish'}

Major workflows should be finalized before development of the relevant module begins.

---

# 7. UI/UX & DESIGN

The product will follow the approved visual direction.

### Design Requirements

**Style:** ${d.design.style || '[Modern / Premium / Minimal / Corporate]'}

**Primary Color:** ${d.design.primaryColor || '[Color]'}

**Secondary Color:** ${d.design.secondaryColor || '[Color]'}

**Typography:** ${d.design.typography || '[Font]'}

**Reference Websites/Apps:** ${d.design.referenceWebsites || '[References]'}

The interface will be designed for the agreed screen sizes and platforms.

### Client-Provided Assets

The client is responsible for supplying:

${assetsCheck}

Placeholder content may be used during development if final content has not yet been provided.

---

# 8. TECHNICAL ARCHITECTURE

| Component      | Technology   |
| -------------- | ------------ |
| Frontend       | ${d.techStack.frontend || '[Technology]'} |
| Backend        | ${d.techStack.backend || '[Technology]'} |
| Database       | ${d.techStack.database || '[Technology]'} |
| Authentication | ${d.techStack.authentication || '[Technology]'} |
| Storage        | ${d.techStack.storage || '[Technology]'} |
| Hosting        | ${d.techStack.hosting || '[Provider]'} |
| Analytics      | ${d.techStack.analytics || '[Provider]'} |

The technical stack may be adjusted where necessary for security, compatibility, maintainability, or performance, provided the agreed functionality is not materially reduced.

---

# 9. THIRD-PARTY INTEGRATIONS

Potential integrations include:

${thirdPartyList || '* Payment Gateway\n* WhatsApp/SMS API\n* Email Service'}

Unless explicitly included in the quotation, third-party subscription and usage charges are paid separately by the client.

Changes, outages, restrictions, pricing changes, or discontinuation of third-party services are outside the direct control of the development team.

---

# 10. SECURITY

Where applicable, the project will implement reasonable security practices such as:

${securityList || '* Secure authentication\n* Password hashing\n* Role-based authorization'}

No software system can be guaranteed to be completely immune from every security vulnerability or attack.

---

# 11. PERFORMANCE

Reasonable optimization will be implemented for:

${perfList || '* Page loading\n* Images/assets\n* Database queries'}

Specific uptime, concurrent-user capacity, response-time, Lighthouse, or Core Web Vitals guarantees apply only if separately documented.

---

# 12. SEO

If SEO is included, the implementation may include:

${seoList || '* SEO-friendly URLs\n* Meta titles and descriptions\n* Sitemap'}

SEO implementation does not guarantee any particular search ranking, traffic level, lead volume, or revenue.

---

# 13. DELIVERABLES

The final deliverables will include the items selected for this project:

${delivList || '* Production-ready application\n* Frontend\n* Backend/API'}

---

# 14. PROJECT TIMELINE

| Phase                   | Estimated Duration |
| ----------------------- | -----------------: |
${timelineRows || '| Requirements & Planning | [X Days] |'}

**Estimated Total:** ${d.estimatedTimeline || '[X Days / Weeks]'}

The project timeline begins after receipt of the agreed advance payment and required project information/assets.

Delays in feedback, approvals, content, credentials, or other client dependencies may extend the delivery timeline.

---

# 15. PAYMENT TERMS

**Total Project Cost:** ${d.currencySymbol}${d.projectCost || '[Amount]'}

### Recommended Payment Structure

${paymentBreakdown || '**40% — Project Confirmation**\n\nDevelopment begins after the advance payment is received.'}

Applicable taxes will be added where required.

---

# 16. REVISION POLICY

The project includes:

**Design Revisions:** [${d.designRevisions || '2'}] rounds

**Development Revisions:** [${d.devRevisions || '2'}] rounds

A revision means modification of an existing approved requirement.

Examples:

Changing button placement → Revision

Changing text → Revision

Minor layout adjustment → Revision

Adding an entirely new dashboard → New Feature

Adding a new payment system → New Feature

Creating an additional major workflow → New Feature

New features are not counted as revisions.

---

# 17. CHANGE REQUEST POLICY

After PRD approval, additional functionality will follow:

**Client Request → Technical Review → Cost/Timeline Estimate → Client Approval → Development**

Additional features may result in:

* Additional development charges
* Additional delivery time
* Updated milestones

No additional paid work will begin until the change is approved.

---

# 18. CLIENT RESPONSIBILITIES

The client must provide required materials and access in a timely manner, including:

${clientRespList || '* Content\n* Logos\n* Brand assets'}

Delays caused by missing client materials or approvals may affect the project schedule.

---

# 19. TESTING & QUALITY ASSURANCE

The project will go through:

${d.qaProcess || 'Development Testing → Internal QA → Client UAT → Bug Resolution → Approval → Production'}

The client is expected to test important workflows during User Acceptance Testing.

Issues should include sufficient details to reproduce the problem.

---

# 20. BUG VS CHANGE REQUEST

A **bug** occurs when documented and approved functionality does not behave according to the PRD.

A **change request** occurs when existing functionality works according to the PRD but the client wants different or additional behavior.

Bugs covered by the agreed warranty/support period will be fixed without additional development charges.

Change requests may be separately chargeable.

---

# 21. CLIENT APPROVAL

The client should provide consolidated feedback within **[${d.approvalFeedbackDays || '3–5'}] business days** after receiving a milestone for review.

Once a milestone has been approved, significant modifications to that milestone may be treated as a change request.

Approval may be documented through email, project management software, or another agreed written communication channel.

---

# 22. POST-LAUNCH SUPPORT

**Included Support Period:** [${d.supportPeriod || '30 Days'}]

Included:

${supportInc || '* Reproducible bug fixes\n* Deployment-related issues'}

Not included:

${supportNotInc || '* New features\n* New pages'}

A separate maintenance plan can be created for ongoing work.

---

# 23. HOSTING, DOMAIN & THIRD-PARTY COSTS

Unless explicitly included in the quotation, the following are separate from development charges:

* Domain registration/renewal
* Hosting/server
* Database plans
* Cloud storage
* Email/SMS services
* WhatsApp API
* AI/API usage
* Payment gateway charges
* CDN
* Premium plugins/services
* Other third-party subscriptions

${d.hostingDomainNotes ? d.hostingDomainNotes + '\n\n' : ''}The client is responsible for ongoing renewal and usage charges for services registered for their project unless a maintenance agreement states otherwise.

---

# 24. INTELLECTUAL PROPERTY & OWNERSHIP

The client retains ownership of materials they provide.

Ownership/licensing of custom code, designs, documentation, and other project deliverables will follow the agreed commercial terms.

Where full ownership transfer is included, it will take effect after receipt of all outstanding project payments.

Third-party libraries, frameworks, fonts, plugins, APIs, stock assets, and open-source components remain subject to their respective licenses.

${d.ipOwnershipNotes ? d.ipOwnershipNotes + '\n' : ''}

---

# 25. CONFIDENTIALITY

Both parties should keep confidential information received during the project reasonably protected.

This may include:

* Business information
* Customer information
* Credentials
* Source code
* Internal documentation
* Business strategies
* Non-public project data

A separate NDA may be executed where stronger confidentiality requirements apply.

${d.confidentialityNotes ? d.confidentialityNotes + '\n' : ''}

---

# 26. CONTENT RESPONSIBILITY

The client is responsible for ensuring that content and materials supplied for the project can legally be used.

This includes:

* Images
* Videos
* Logos
* Trademarks
* Text
* Product information
* Customer datasets
* Documents

The client should obtain required permissions and licenses before supplying third-party materials.

${d.contentResponsibilityNotes ? d.contentResponsibilityNotes + '\n' : ''}

---

# 27. DATA & BACKUPS

Backup responsibilities must be established before launch.

**Backup Provider:** [${d.backupProvider || 'Client / Developer / Hosting Provider'}]

**Backup Frequency:** [${d.backupFrequency || 'Daily / Weekly / Other'}]

**Retention:** [${d.backupRetention || 'X Days'}]

If ongoing maintenance is not included, the developer is not automatically responsible for indefinite monitoring, backups, or recovery after project handover.

---

# 28. PROJECT DELAYS / PAUSE

If required information, approvals, payments, access, or feedback are delayed, the delivery timeline may be adjusted accordingly.

If a project remains inactive for more than **[${d.delayThresholdDays || '30'}] days** due to client-side dependencies, it may be placed on hold.

A significantly delayed project may require a revised delivery schedule when resumed.

${d.delayPolicyNotes ? d.delayPolicyNotes + '\n' : ''}

---

# 29. CANCELLATION & REFUND

If the project is cancelled after work has started, payment/refund eligibility will be determined according to:

* Work already completed
* Resources already allocated
* Third-party expenses already incurred
* Approved milestones
* The signed commercial agreement

Any non-refundable component of an advance payment should be explicitly stated in the quotation or service agreement.

${d.cancellationPolicyNotes ? d.cancellationPolicyNotes + '\n' : ''}

---

# 30. LIMITATIONS

Unless specifically guaranteed in writing, the project does not guarantee:

${limitList || '* Specific Google rankings\n* Specific website traffic\n* Sales\n* Leads\n* Revenue'}

External platforms and services remain subject to their own policies and availability.

---

# 31. OUT-OF-SCOPE WORK

Unless specifically included, the following are excluded:

${outOfScopeList || '* Additional pages\n* Additional dashboards\n* Mobile applications'}

Anything not explicitly included in the approved scope should be reviewed as a potential change request.

---

# 32. FINAL HANDOVER

After completion and receipt of applicable final payment, the agreed handover may include:

${handoverList || '* Production deployment\n* Source code\n* Admin credentials'}

The exact handover package will follow the agreed quotation and project scope.

---
${legalClausesText}
# ${finalSectionNum}. FINAL APPROVAL & SIGN-OFF

By approving this document, both parties confirm that they understand and accept the documented project scope, requirements, deliverables, responsibilities, exclusions, commercial terms, and change-management process.

Any future changes to the approved scope should be documented and mutually agreed.

### CLIENT

**Name:** ${d.clientSignoff.name || '______________________________'}

**Company:** ${d.clientSignoff.company || '___________________________'}

**Signature:** __________________________

**Date:** ${d.clientSignoff.signatureDate || '______________________________'}

### SERVICE PROVIDER

**Name:** ${d.providerSignoff.name || '______________________________'}

**Company:** ${d.providerSignoff.company || '___________________________'}

**Signature:** __________________________

**Date:** ${d.providerSignoff.signatureDate || '______________________________'}

---

## DOCUMENT APPROVAL

**PRD Version:** ${d.documentApproval.prdVersion || '1.0'}

**Status:** ${statusBox}

**Client Approval Date:** ${d.documentApproval.clientApprovalDate || '__________________'}

**Project Start Date:** ${d.documentApproval.projectStartDate || '____________________'}

**Expected Delivery Date:** ${d.documentApproval.expectedDeliveryDate || '__________________'}
`;
}
