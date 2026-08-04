import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient } from '@/lib/groq';
import { PRDData, EMPTY_PRD } from '@/types/prd';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prdData, targetLanguage } = body;

    if (!prdData || !targetLanguage) {
      return NextResponse.json({ error: 'Missing PRD data or target language' }, { status: 400 });
    }

    const groq = getGroqClient();

    const systemInstruction = `You are a professional technical translator and Product Manager.
Your task is to translate the provided Product Requirements Document (PRD) JSON into the requested language (${targetLanguage}).

CRITICAL INSTRUCTIONS:
1. Translate all text values inside the JSON (descriptions, objectives, labels, strings).
2. DO NOT translate JSON keys. The schema must exactly match PRDData.
3. Preserve the exact 33-section structure and all technical terminology (e.g., 'API', 'UI', 'OAuth' should remain technical).
4. Preserve the 'hiddenSections' array exactly as it is (it contains numbers, so no translation needed).
5. Only return the raw JSON output. No markdown wrappers (\`\`\`json), no explanations.
6. The output must strictly match the PRDData TypeScript interface.`;

    const userPromptText = `Translate the following PRD JSON into ${targetLanguage}:\n\n${JSON.stringify(prdData)}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPromptText }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    if (!responseText) {
      throw new Error('Empty response from Groq API');
    }

    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson) as PRDData;
      
      const safeData: PRDData = {
        ...EMPTY_PRD,
        ...parsed,
        hiddenSections: prdData.hiddenSections
      };
      
      return NextResponse.json({ prd: safeData });
    } catch (parseError) {
      console.error('Failed to parse translated PRD JSON from Groq:', parseError);
      return NextResponse.json({ error: 'Failed to generate valid JSON format.' }, { status: 500 });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error translating PRD with Groq:', errMessage);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
