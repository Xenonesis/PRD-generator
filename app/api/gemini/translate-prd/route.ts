import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { PRDData, EMPTY_PRD } from '@/types/prd';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prdData, targetLanguage } = body;

    if (!prdData || !targetLanguage) {
      return NextResponse.json({ error: 'Missing PRD data or target language' }, { status: 400 });
    }

    const ai = getGeminiClient();

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPromptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temp for more accurate translation
      }
    });

    const responseText = response.text || '';
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    try {
      // Sometimes models wrap in markdown even with JSON mime type
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson) as PRDData;
      
      // Merge with EMPTY_PRD to ensure schema safety
      const safeData: PRDData = {
        ...EMPTY_PRD,
        ...parsed,
        hiddenSections: prdData.hiddenSections // Preserve original hidden sections
      };
      
      return NextResponse.json({ prd: safeData });
    } catch (parseError) {
      console.error('Failed to parse translated PRD JSON:', parseError);
      return NextResponse.json({ error: 'Failed to generate valid JSON format.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Translation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
