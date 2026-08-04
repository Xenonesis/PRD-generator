import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetField, projectName, projectDescription } = body;

    if (!targetField) {
      return NextResponse.json({ error: 'Target field is required' }, { status: 400 });
    }

    const groq = getGroqClient();
    
    const systemInstruction = `You are an expert software architect and product manager. Based on the project name and description, suggest industry-standard content for the requested field. Return only valid JSON.`;
    
    let promptText = `Project Name: ${projectName || 'Untitled'}\nDescription: ${projectDescription || 'No description provided'}\n\n`;
    
    if (targetField === 'projectObjectives') {
      promptText += `Generate 3 to 5 clear, actionable project objectives. Return a JSON object with a single key "suggestions" containing an array of strings.`;
    } else if (targetField === 'techStack') {
      promptText += `Suggest a modern, appropriate tech stack for this project. Return a JSON object with a single key "suggestions" containing an object with these exact keys: frontend, backend, database, authentication, storage, hosting, analytics. Use short strings for values (e.g., "Next.js & React", "Node.js & Express", "PostgreSQL").`;
    } else {
      return NextResponse.json({ error: 'Unsupported target field' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: promptText }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '';
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
    console.error('Error generating autocomplete with Groq:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
