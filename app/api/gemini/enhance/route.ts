import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function stripCodeFences(text: string): string {
  return text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY in environment' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = String((body as { prompt?: unknown })?.prompt ?? '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents:
        `Rewrite this into one polished cinematic English video prompt. ` +
        `Return only the final prompt, with no bullets, no quotes, and no explanation.\n\n${prompt}`,
      config: {
        temperature: 0.7,
      },
    });

    const enhancedPrompt = stripCodeFences(
      String(response.text ?? '').trim() || prompt
    );

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unexpected server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
