import { NextResponse } from 'next/server';

function extractText(data: any): string {
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  const chunks: string[] = [];

  for (const step of steps) {
    const content = step?.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block?.type === 'text' && typeof block?.text === 'string') {
          chunks.push(block.text);
        }
      }
    }
  }

  return chunks.join(' ').trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? '').trim();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'gemini-3.6-flash',
          system_instruction:
            'You are an expert ad prompt engineer. Rewrite the input into one polished cinematic English video prompt. Return only the final prompt, with no bullets, no quotes, and no explanation.',
          input: `Enhance this video prompt:\n${prompt}`,
          generation_config: {
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: 'Gemini request failed', details },
        { status: 500 }
      );
    }

    const data = await response.json();
    const enhancedPrompt = extractText(data) || prompt;

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
