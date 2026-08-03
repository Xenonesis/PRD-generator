import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetField, projectName, projectDescription } = body;

    if (!targetField) {
      return NextResponse.json({ error: 'Target field is required' }, { status: 400 });
    }

    const ai = getGeminiClient();
    
    const systemInstruction = `You are an expert software architect and product manager. Based on the project name and description, suggest industry-standard content for the requested field. Return only valid JSON.`;
    
    let promptText = `Project Name: ${projectName || 'Untitled'}\nDescription: ${projectDescription || 'No description provided'}\n\n`;
    
    if (targetField === 'projectObjectives') {
      promptText += `Generate 3 to 5 clear, actionable project objectives. Return a JSON object with a single key "suggestions" containing an array of strings.`;
    } else if (targetField === 'techStack') {
      promptText += `Suggest a modern, appropriate tech stack for this project. Return a JSON object with a single key "suggestions" containing an object with these exact keys: frontend, backend, database, authentication, storage, hosting, analytics. Use short strings for values (e.g., "Next.js & React", "Node.js & Express", "PostgreSQL").`;
    } else {
      return NextResponse.json({ error: 'Unsupported target field' }, { status: 400 });
    }

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

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
    console.error('Error generating autocomplete:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
