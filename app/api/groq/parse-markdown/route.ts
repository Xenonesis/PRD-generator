import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/groq';
import { PRDData, EMPTY_PRD } from '@/types/prd';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { markdown, prompt } = body;

    if (!markdown) {
      return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
    }

    const groq = getGroqClient();

    const systemInstruction = `You are a world-class IT Solution Architect and Technical Product Manager. Your task is to take a PRD (Product Requirements Document) provided in Markdown format, parse it accurately, and return it strictly in the JSON format matching the PRDData schema.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid JSON matching the exact schema of PRDData provided below.
2. Ensure realistic, professional content for ALL 33 standard sections:
   - Project Name, Client Name, Service Provider, Version (1.0), Date (current date in DD/MM/YYYY), Currency Symbol (₹ or $), Project Cost, Timeline.
   - Project Description, Objectives (array), Target Users (Primary, Secondary, Admin).
   - Included Platforms (booleans for website, webApp, adminPanel, androidApp, iosApp, apiBackend, other).
   - Features list (array of objects with id, feature, description, priority).
   - Pages list (array of strings).
   - User roles (Guest, Registered User, Admin, Super Admin).
   - User flows (Registration flow, Primary Product flow, Admin flow).
   - UI/UX specs (Style, Primary Color, Secondary Color, Typography, Reference websites, Client assets booleans).
   - Tech Stack (Frontend, Backend, Database, Authentication, Storage, Hosting, Analytics).
   - Third-Party Integrations array.
   - Security Practices array.
   - Performance Optimizations array.
   - SEO Features array.
   - Deliverables array.
   - Timeline phases array (objects with phase and duration).
   - Payment Structure array (objects with percentage, milestone, description).
   - Revision policy (Design revisions, Dev revisions, notes).
   - Change Request Policy, Client Responsibilities array, QA process, Bug vs Change Request policy, approvalFeedbackDays.
   - Post-launch support period, included support items array, not included support items array.
   - Hosting & domain costs notes, IP ownership notes, Confidentiality notes, Content responsibility notes.
   - Backups (backupProvider, backupFrequency, backupRetention).
   - delayThresholdDays, delayPolicyNotes, cancellationPolicyNotes, limitations array, outOfScope array, finalHandoverItems array.
   - Signoff placeholders (clientSignoff, providerSignoff) and documentApproval.
3. If the user provides a 'Prompt/Instruction', you must APPLY that instruction to modify the markdown content before parsing it into JSON. If no instruction is provided, just parse the markdown exactly as is.`;

    const userPromptText = `Here is the current PRD in Markdown format:
---
${markdown}
---

${prompt ? `USER INSTRUCTION FOR MODIFICATION: "${prompt}"\n\nPlease apply the above instruction to the markdown content, and return the final updated PRD strictly as JSON.` : 'Please parse the above markdown and return it strictly as JSON.'}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPromptText }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: prompt ? 0.7 : 0.1, // Use low temp for pure parsing, higher for generative modifications
    });

    const text = completion.choices[0]?.message?.content || '';
    let parsedData: Partial<PRDData> = {};

    try {
      parsedData = JSON.parse(text);
    } catch {
      console.error('Failed to parse Groq JSON output');
      return NextResponse.json({ error: 'Failed to parse AI output' }, { status: 500 });
    }

    const finalPRD: PRDData = {
      ...EMPTY_PRD,
      ...parsedData,
      date: parsedData.date || new Date().toLocaleDateString('en-GB'),
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
    console.error('Error parsing markdown with Groq:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
