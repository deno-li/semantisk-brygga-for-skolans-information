import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
};

interface AnalysisRequest {
  text: string;
}

interface AiSuggestion {
  standard: 'ICF' | 'BBIC' | 'KVÅ' | 'KSI';
  code: string;
  confidence: number;
  reasoning: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body as AnalysisRequest;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        suggestions: [{
          standard: 'INFO' as any,
          code: 'API-nyckel saknas',
          confidence: 0,
          reasoning: 'OpenAI API-nyckel saknas på servern. Lägg till OPENAI_API_KEY i Vercel Environment Variables.'
        }]
      });
    }

    const systemPrompt = `Du är en expert på svensk vård- och omsorgsdokumentation och terminologi.
Analysera observationstexter och föreslå koder för standarderna ICF (ICF-CY), BBIC, KVÅ och KSI.

INSTRUKTIONER FÖR MOTIVERING (REASONING):
För att analysen ska vara trovärdig MÅSTE du inkludera direkta citat från texten.
Följ denna struktur för varje motivering:
1. Ange exakt vilket citat analysen bygger på.
2. Förklara hur citatet tolkas i förhållande till standarden.
3. Ange varför den specifika koden valdes.

Exempelformat: "Baserat på citatet '[CITAT FRÅN TEXT]' som indikerar [TOLKNING/PROBLEM], föreslås koden [KOD] då den omfattar [DEFINITION]."

PRIORITERING PER STANDARD:
- ICF: Prioritera d-koder (aktivitet/delaktighet) och e-koder (omgivningsfaktorer) för att fånga barnets funktion i vardagen.
- BBIC: Koppla till barnets behov, föräldrarnas förmåga eller familj & miljö.
- KVÅ: Åtgärdskoder inom hälso- och sjukvård (t.ex. samtal, utredning).
- KSI: Insatskoder för socialtjänst (t.ex. bistånd, placering).

Svara ENDAST med ett JSON-objekt med följande struktur (ingen annan text):
{
  "suggestions": [
    {
      "standard": "ICF",
      "code": "d160 Uppmärksamhet",
      "confidence": 85,
      "reasoning": "Motivering med citat från texten"
    }
  ]
}`;

    // Call OpenAI using Vercel AI SDK
    const { text: aiResponse } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analysera följande text och föreslå lämpliga koder:\n\n"${text}"` }
      ],
      temperature: 0.3,
    });

    // Parse the JSON response
    const parsed = JSON.parse(aiResponse);
    const suggestions: AiSuggestion[] = Array.isArray(parsed)
      ? parsed
      : (parsed.suggestions || parsed.results || []);

    return res.status(200).json({ suggestions });

  } catch (error) {
    console.error('AI Analysis error:', error);

    // Return a user-friendly error
    return res.status(500).json({
      error: 'Analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      suggestions: []
    });
  }
}
