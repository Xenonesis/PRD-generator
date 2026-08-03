import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionName, currentContent, instruction, projectName, projectDescription } = body;

    if (!sectionName || !instruction) {
      return NextResponse.json({ error: 'Section name and instruction are required' }, { status: 400 });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert IT Product Manager assisting with crafting a Product Requirements Document (PRD). Your goal is to improve or expand a specific section of the PRD based on user instructions. Keep formatting clean, precise, and professional. Return your response in clean JSON format according to the requested section format.`;

    const promptText = `Project: ${projectName || 'Software Project'}
Description: ${projectDescription || 'Custom application'}

Section to Refine: "${sectionName}"
Current Content: ${JSON.stringify(currentContent || '')}

User Refinement Request: "${instruction}"

Return a JSON object with a single key "refinedContent" containing the improved content (which can be a string, array, or object depending on section type).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return NextResponse.json({ refinedContent: parsed.refinedContent || parsed });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to refine section';
    console.error('Error refining section:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
