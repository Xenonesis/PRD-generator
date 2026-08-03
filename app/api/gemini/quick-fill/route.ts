import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { field, contextData, instructions, schemaDescription } = await req.json();
    
    if (!field || !contextData) {
      return NextResponse.json({ error: 'Field and context are required' }, { status: 400 });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class IT Solution Architect and Technical Product Manager. Your task is to generate specific content for a single section of a Product Requirements Document (PRD).
    
The field you are generating is: "${field}".
Expected Schema/Type for this field: ${schemaDescription || 'Appropriate string, array of strings, or object'}

Context of the overall project:
Project Name: ${contextData.projectName || 'Unknown'}
Description: ${contextData.projectDescription || 'Unknown'}
Tech Stack: ${JSON.stringify(contextData.techStack || {})}
Features so far: ${JSON.stringify(contextData.features || [])}

User Instructions for this field:
${instructions || 'Generate highly realistic, professional, detailed content for this section based on the project context.'}

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid JSON containing a single key "${field}" with the generated value.
2. Do not include markdown formatting like \`\`\`json in the output. Just raw JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate the JSON object for the field "${field}".`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');

    const json = JSON.parse(text);

    return NextResponse.json({ result: json[field] });
  } catch (err: any) {
    console.error('Quick fill error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
