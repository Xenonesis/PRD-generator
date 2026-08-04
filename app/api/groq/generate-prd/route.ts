import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/groq';
import { PRDData, EMPTY_PRD } from '@/types/prd';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, clientName, serviceProvider, projectCost, timeline, industry, tone } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const groq = getGroqClient();

    const systemInstruction = `You are a world-class IT Solution Architect and Technical Product Manager. Your task is to generate a comprehensive, highly detailed Product Requirements Document (PRD) & Project Agreement in structured JSON format based on the user's project request.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid JSON matching the schema of PRDData provided below.
2. Ensure realistic, professional content for ALL 33 standard sections:
   - Project Name, Client Name, Service Provider, Version (1.0), Date (current date in DD/MM/YYYY), Currency Symbol (₹ or $), Project Cost, Timeline.
   - Project Description, Objectives (at least 5 bullet points), Target Users (Primary, Secondary, Admin).
   - Included Platforms (booleans for website, webApp, adminPanel, androidApp, iosApp, apiBackend, other).
   - Features list (at least 6-10 detailed features with ID format 'F-01', 'F-02'..., name, description, and priority 'High'|'Medium'|'Low').
   - Pages list (at least 6-10 realistic pages/screens).
   - User roles (Guest, Registered User, Admin, Super Admin permissions).
   - User flows (Registration flow, Primary Product flow, Admin flow).
   - UI/UX specs (Style, Primary Color, Secondary Color, Typography, Reference websites, Client assets booleans).
   - Tech Stack (Frontend, Backend, Database, Authentication, Storage, Hosting, Analytics).
   - Third-Party Integrations array (e.g. Payment Gateway, WhatsApp API, Email Service, Cloud Storage, etc.).
   - Security Practices array (e.g. HTTPS, JWT, Bcrypt, SQL injection protection, Rate limiting).
   - Performance Optimizations array.
   - SEO Features array.
   - Deliverables array.
   - Timeline phases array (Requirements & Planning, UI/UX, Development, QA, Client Review, Handover with estimated durations).
   - Payment Structure array (e.g. 40% Confirmation, 30% Milestone, 30% Final Delivery).
   - Revision policy (Design revisions e.g. '2', Dev revisions e.g. '2', notes).
   - Change Request Policy, Client Responsibilities array, QA process, Bug vs Change Request policy, Client approval feedback days ('3-5').
   - Post-launch support period ('30 Days'), included support items array, not included support items array.
   - Hosting & domain costs notes, IP ownership notes, Confidentiality notes, Content responsibility notes.
   - Backups (Backup Provider, Backup Frequency e.g. 'Daily', Backup Retention e.g. '30 Days').
   - Project delays pause threshold ('30' days), Cancellation policy, Limitations array, Out of scope array, Final handover items array.
   - Signoff placeholders and document approval metadata.
3. NEVER leave empty strings or mock generic placeholders like '[Feature]' — generate exact realistic technical strings matching the requested app!
4. MATCH THE REQUESTED TONE exactly in all generated descriptions, objectives, and text fields.`;

    const userPromptText = `Project Request: "${prompt}"
${clientName ? `Client Name: ${clientName}` : ''}
${serviceProvider ? `Service Provider: ${serviceProvider}` : ''}
${projectCost ? `Estimated Budget: ${projectCost}` : ''}
${timeline ? `Estimated Timeline: ${timeline}` : ''}
${industry ? `Industry: ${industry}` : ''}
${tone ? `Tone of Voice: ${tone}` : ''}

Generate the complete structured JSON PRDData for this project now.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPromptText }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '';
    let parsedData: Partial<PRDData> = {};

    try {
      parsedData = JSON.parse(text);
    } catch {
      console.error('Failed to parse Groq JSON output, falling back to merged data');
    }

    const finalPRD: PRDData = {
      ...EMPTY_PRD,
      ...parsedData,
      date: new Date().toLocaleDateString('en-GB'),
      includedPlatforms: {
        ...EMPTY_PRD.includedPlatforms,
        ...(parsedData.includedPlatforms || {}),
      },
      targetUsers: {
        ...EMPTY_PRD.targetUsers,
        ...(parsedData.targetUsers || {}),
      },
      userRoles: {
        ...EMPTY_PRD.userRoles,
        ...(parsedData.userRoles || {}),
      },
      userFlows: {
        ...EMPTY_PRD.userFlows,
        ...(parsedData.userFlows || {}),
      },
      design: {
        ...EMPTY_PRD.design,
        ...(parsedData.design || {}),
        clientAssets: {
          ...EMPTY_PRD.design.clientAssets,
          ...(parsedData.design?.clientAssets || {}),
        },
      },
      techStack: {
        ...EMPTY_PRD.techStack,
        ...(parsedData.techStack || {}),
      },
      clientSignoff: {
        ...EMPTY_PRD.clientSignoff,
        ...(parsedData.clientSignoff || {}),
      },
      providerSignoff: {
        ...EMPTY_PRD.providerSignoff,
        ...(parsedData.providerSignoff || {}),
      },
      documentApproval: {
        ...EMPTY_PRD.documentApproval,
        ...(parsedData.documentApproval || {}),
      },
    };

    return NextResponse.json({ prd: finalPRD });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error generating PRD with Groq:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
